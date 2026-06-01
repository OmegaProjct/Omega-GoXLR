import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { GoXlrDaemonManager } from './goxlrDaemon'
import { fetchDaemonStatus, setChannelVolume } from './goxlrApi'
import { GoXlrAppState } from './goxlrTypes'

const appDataPath = app.getPath('appData')
const customUserDataPath = join(appDataPath, 'OmegaProjects', 'Omega GoXLR Desktop')
app.setPath('userData', customUserDataPath)

let mainWindow: BrowserWindow | null = null
const daemonManager = new GoXlrDaemonManager()

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1320,
    height: 860,
    minWidth: 1080,
    minHeight: 720,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#0f1115',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    if (!app.isPackaged) {
      mainWindow?.webContents.openDevTools()
    }
  })

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

async function buildAppState(): Promise<GoXlrAppState> {
  const daemon = daemonManager.getState()

  try {
    const status = await fetchDaemonStatus()
    return {
      daemon: {
        ...daemon,
        running: true,
        lastError: null
      },
      status
    }
  } catch (error) {
    return {
      daemon: {
        ...daemon,
        running: await daemonManager.isReachable(),
        lastError: error instanceof Error ? error.message : 'Unknown daemon error'
      },
      status: null
    }
  }
}

function setupIpc(): void {
  ipcMain.handle('goxlr:get-app-state', async () => {
    return buildAppState()
  })

  ipcMain.handle('goxlr:start-daemon', async () => {
    await daemonManager.ensureRunning()
    return buildAppState()
  })

  ipcMain.handle('goxlr:refresh-status', async () => {
    return buildAppState()
  })

  ipcMain.handle(
    'goxlr:set-volume',
    async (_event, payload: { serial: string; channel: string; volume: number }) => {
      await setChannelVolume(payload.serial, payload.channel, payload.volume)
      return buildAppState()
    }
  )
}

app.whenReady().then(async () => {
  setupIpc()
  createWindow()
})

app.on('window-all-closed', async () => {
  await daemonManager.stop()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
