import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { GoXlrDaemonManager } from './goxlrDaemon'
import {
  fetchDaemonStatus,
  loadMicProfile,
  loadProfile,
  openPath,
  saveMicProfile,
  saveProfile,
  setChannelVolume,
  setFaderAssignment,
  setMicrophoneGain,
  setMicrophoneType,
  setRouterEntry
} from './goxlrApi'
import {
  GoXlrAppState,
  GoXlrChannelName,
  GoXlrFaderName,
  GoXlrInputDevice,
  GoXlrMicrophoneType,
  GoXlrOutputDevice,
  GoXlrPathType
} from './goxlrTypes'

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
    async (_event, payload: { serial: string; channel: GoXlrChannelName; volume: number }) => {
      await setChannelVolume(payload.serial, payload.channel, payload.volume)
      return buildAppState()
    }
  )

  ipcMain.handle(
    'goxlr:set-fader',
    async (_event, payload: { serial: string; fader: GoXlrFaderName; channel: GoXlrChannelName }) => {
      await setFaderAssignment(payload.serial, payload.fader, payload.channel)
      return buildAppState()
    }
  )

  ipcMain.handle(
    'goxlr:set-router',
    async (
      _event,
      payload: {
        serial: string
        input: GoXlrInputDevice
        output: GoXlrOutputDevice
        enabled: boolean
      }
    ) => {
      await setRouterEntry(payload.serial, payload.input, payload.output, payload.enabled)
      return buildAppState()
    }
  )

  ipcMain.handle(
    'goxlr:set-mic-type',
    async (_event, payload: { serial: string; microphoneType: GoXlrMicrophoneType }) => {
      await setMicrophoneType(payload.serial, payload.microphoneType)
      return buildAppState()
    }
  )

  ipcMain.handle(
    'goxlr:set-mic-gain',
    async (_event, payload: { serial: string; microphoneType: GoXlrMicrophoneType; gain: number }) => {
      await setMicrophoneGain(payload.serial, payload.microphoneType, payload.gain)
      return buildAppState()
    }
  )

  ipcMain.handle('goxlr:load-profile', async (_event, payload: { serial: string; profileName: string }) => {
    await loadProfile(payload.serial, payload.profileName)
    return buildAppState()
  })

  ipcMain.handle('goxlr:save-profile', async (_event, payload: { serial: string }) => {
    await saveProfile(payload.serial)
    return buildAppState()
  })

  ipcMain.handle(
    'goxlr:load-mic-profile',
    async (_event, payload: { serial: string; profileName: string }) => {
      await loadMicProfile(payload.serial, payload.profileName)
      return buildAppState()
    }
  )

  ipcMain.handle('goxlr:save-mic-profile', async (_event, payload: { serial: string }) => {
    await saveMicProfile(payload.serial)
    return buildAppState()
  })

  ipcMain.handle('goxlr:open-path', async (_event, payload: { pathType: GoXlrPathType }) => {
    await openPath(payload.pathType)
    return true
  })
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
