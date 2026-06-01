import { app } from 'electron'
import { existsSync } from 'fs'
import { join } from 'path'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'

const DEFAULT_PORT = 14564
const DEFAULT_HOST = '127.0.0.1'

type DaemonLaunchResult = {
  alreadyRunning: boolean
  startedByApp: boolean
  source: string | null
}

export class GoXlrDaemonManager {
  private child: ChildProcessWithoutNullStreams | null = null
  private startedByApp = false
  private source: string | null = null
  private lastError: string | null = null

  get endpoint(): string {
    return `http://${DEFAULT_HOST}:${DEFAULT_PORT}`
  }

  getState() {
    return {
      running: this.startedByApp ? this.child !== null : false,
      source: this.source,
      startedByApp: this.startedByApp,
      endpoint: this.endpoint,
      lastError: this.lastError
    }
  }

  async ensureRunning(): Promise<DaemonLaunchResult> {
    if (await this.isReachable()) {
      this.startedByApp = false
      this.source = 'existing-daemon'
      this.lastError = null
      return {
        alreadyRunning: true,
        startedByApp: false,
        source: this.source
      }
    }

    const candidate = this.resolveLaunchCandidate()
    if (!candidate) {
      this.lastError =
        'No GoXLR daemon launch candidate found. Build the Rust daemon or install Cargo.'
      throw new Error(this.lastError)
    }

    const child = spawn(candidate.command, candidate.args, {
      cwd: candidate.cwd,
      windowsHide: true,
      stdio: 'pipe'
    })

    this.child = child
    this.startedByApp = true
    this.source = candidate.label
    this.lastError = null

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString().trim()
      if (text.length > 0) {
        console.log(`[GoXLR daemon] ${text}`)
      }
    })

    child.stderr.on('data', (chunk) => {
      const text = chunk.toString().trim()
      if (text.length > 0) {
        console.error(`[GoXLR daemon error] ${text}`)
      }
    })

    child.on('exit', (code, signal) => {
      console.log(`[GoXLR daemon] exited code=${code} signal=${signal}`)
      this.child = null
    })

    await this.waitForReachable(15000)

    return {
      alreadyRunning: false,
      startedByApp: true,
      source: this.source
    }
  }

  async stop(): Promise<void> {
    if (!this.child) {
      return
    }

    const currentChild = this.child
    await new Promise<void>((resolve) => {
      const timer = setTimeout(() => {
        if (currentChild.exitCode === null) {
          currentChild.kill()
        }
        resolve()
      }, 3000)

      currentChild.once('exit', () => {
        clearTimeout(timer)
        resolve()
      })

      currentChild.kill()
    })

    this.child = null
  }

  async isReachable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.endpoint}/api/get-devices`)
      return response.ok
    } catch {
      return false
    }
  }

  private async waitForReachable(timeoutMs: number): Promise<void> {
    const startedAt = Date.now()
    while (Date.now() - startedAt < timeoutMs) {
      if (await this.isReachable()) {
        return
      }
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    this.lastError = 'Timed out while waiting for the GoXLR daemon HTTP endpoint.'
    throw new Error(this.lastError)
  }

  private resolveLaunchCandidate():
    | { command: string; args: string[]; cwd: string; label: string }
    | null {
    const repoRoot = join(app.getPath('home'), 'Coding', 'Omega GoXLR')
    const releaseExe = join(repoRoot, 'target', 'release', 'goxlr-daemon.exe')
    const debugExe = join(repoRoot, 'target', 'debug', 'goxlr-daemon.exe')

    if (existsSync(releaseExe)) {
      return {
        command: releaseExe,
        args: ['--http-bind-address', DEFAULT_HOST],
        cwd: repoRoot,
        label: 'release-binary'
      }
    }

    if (existsSync(debugExe)) {
      return {
        command: debugExe,
        args: ['--http-bind-address', DEFAULT_HOST],
        cwd: repoRoot,
        label: 'debug-binary'
      }
    }

    const cargoToml = join(repoRoot, 'Cargo.toml')
    if (existsSync(cargoToml)) {
      return {
        command: 'cargo',
        args: ['run', '-p', 'goxlr-daemon', '--', '--http-bind-address', DEFAULT_HOST],
        cwd: repoRoot,
        label: 'cargo-run'
      }
    }

    return null
  }
}
