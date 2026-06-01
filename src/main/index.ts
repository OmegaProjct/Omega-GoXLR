import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { GoXlrDaemonManager } from './goxlrDaemon'
import {
  fetchDaemonStatus,
  loadMicProfile,
  loadProfile,
  openPath,
  playNextSample,
  saveMicProfile,
  saveProfile,
  saveActivePreset,
  setActiveSamplerBank,
  setActiveEffectPreset,
  setAnimationMod1,
  setAnimationMod2,
  setAnimationMode,
  setAnimationWaterfall,
  setBleepLevel,
  setChannelVolume,
  setDeEsser,
  setFaderAssignment,
  setLockFaders,
  setMonitorMix,
  setMonitorWithFx,
  setMicrophoneGain,
  setMicrophoneType,
  setSimpleColour,
  setRouterEntry,
  stopSamplePlayback,
  setSubmixEnabled,
  setSubmixLinked,
  setSubmixOutputMix,
  setSubmixVolume,
  setVodMode
} from './goxlrApi'
import {
  GoXlrAnimationMode,
  GoXlrAppState,
  GoXlrChannelName,
  GoXlrEffectPreset,
  GoXlrFaderName,
  GoXlrInputDevice,
  GoXlrMix,
  GoXlrMicrophoneType,
  GoXlrOutputDevice,
  GoXlrPathType,
  GoXlrSampleBank,
  GoXlrSampleButton,
  GoXlrSimpleColourTarget,
  GoXlrVodMode
  ,
  GoXlrWaterfallDirection
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

  ipcMain.handle(
    'goxlr:set-monitor-mix',
    async (_event, payload: { serial: string; output: GoXlrOutputDevice }) => {
      await setMonitorMix(payload.serial, payload.output)
      return buildAppState()
    }
  )

  ipcMain.handle(
    'goxlr:set-monitor-with-fx',
    async (_event, payload: { serial: string; enabled: boolean }) => {
      await setMonitorWithFx(payload.serial, payload.enabled)
      return buildAppState()
    }
  )

  ipcMain.handle(
    'goxlr:set-submix-enabled',
    async (_event, payload: { serial: string; enabled: boolean }) => {
      await setSubmixEnabled(payload.serial, payload.enabled)
      return buildAppState()
    }
  )

  ipcMain.handle(
    'goxlr:set-submix-volume',
    async (
      _event,
      payload: {
        serial: string
        channel: 'Mic' | 'LineIn' | 'Console' | 'System' | 'Game' | 'Chat' | 'Sample' | 'Music'
        volume: number
      }
    ) => {
      await setSubmixVolume(payload.serial, payload.channel, payload.volume)
      return buildAppState()
    }
  )

  ipcMain.handle(
    'goxlr:set-submix-linked',
    async (
      _event,
      payload: {
        serial: string
        channel: 'Mic' | 'LineIn' | 'Console' | 'System' | 'Game' | 'Chat' | 'Sample' | 'Music'
        linked: boolean
      }
    ) => {
      await setSubmixLinked(payload.serial, payload.channel, payload.linked)
      return buildAppState()
    }
  )

  ipcMain.handle(
    'goxlr:set-submix-output-mix',
    async (_event, payload: { serial: string; output: GoXlrOutputDevice; mix: GoXlrMix }) => {
      await setSubmixOutputMix(payload.serial, payload.output, payload.mix)
      return buildAppState()
    }
  )

  ipcMain.handle(
    'goxlr:set-bleep-level',
    async (_event, payload: { serial: string; value: number }) => {
      await setBleepLevel(payload.serial, payload.value)
      return buildAppState()
    }
  )

  ipcMain.handle(
    'goxlr:set-deesser',
    async (_event, payload: { serial: string; value: number }) => {
      await setDeEsser(payload.serial, payload.value)
      return buildAppState()
    }
  )

  ipcMain.handle(
    'goxlr:set-lock-faders',
    async (_event, payload: { serial: string; enabled: boolean }) => {
      await setLockFaders(payload.serial, payload.enabled)
      return buildAppState()
    }
  )

  ipcMain.handle(
    'goxlr:set-vod-mode',
    async (_event, payload: { serial: string; mode: GoXlrVodMode }) => {
      await setVodMode(payload.serial, payload.mode)
      return buildAppState()
    }
  )

  ipcMain.handle(
    'goxlr:set-effect-preset',
    async (_event, payload: { serial: string; preset: GoXlrEffectPreset }) => {
      await setActiveEffectPreset(payload.serial, payload.preset)
      return buildAppState()
    }
  )

  ipcMain.handle('goxlr:save-effect-preset', async (_event, payload: { serial: string }) => {
    await saveActivePreset(payload.serial)
    return buildAppState()
  })

  ipcMain.handle(
    'goxlr:set-animation-mode',
    async (_event, payload: { serial: string; mode: GoXlrAnimationMode }) => {
      await setAnimationMode(payload.serial, payload.mode)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-animation-mod1',
    async (_event, payload: { serial: string; value: number }) => {
      await setAnimationMod1(payload.serial, payload.value)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-animation-mod2',
    async (_event, payload: { serial: string; value: number }) => {
      await setAnimationMod2(payload.serial, payload.value)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-animation-waterfall',
    async (_event, payload: { serial: string; direction: GoXlrWaterfallDirection }) => {
      await setAnimationWaterfall(payload.serial, payload.direction)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-simple-colour',
    async (_event, payload: { serial: string; target: GoXlrSimpleColourTarget; colour: string }) => {
      await setSimpleColour(payload.serial, payload.target, payload.colour)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-sampler-bank',
    async (_event, payload: { serial: string; bank: GoXlrSampleBank }) => {
      await setActiveSamplerBank(payload.serial, payload.bank)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:play-next-sample',
    async (_event, payload: { serial: string; bank: GoXlrSampleBank; button: GoXlrSampleButton }) => {
      await playNextSample(payload.serial, payload.bank, payload.button)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:stop-sample',
    async (_event, payload: { serial: string; bank: GoXlrSampleBank; button: GoXlrSampleButton }) => {
      await stopSamplePlayback(payload.serial, payload.bank, payload.button)
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
