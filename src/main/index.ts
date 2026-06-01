import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { GoXlrDaemonManager } from './goxlrDaemon'
import {
  addSampleToButton,
  fetchDaemonStatus,
  removeSampleByIndex,
  setCompressorAttack,
  setCompressorMakeupGain,
  setCompressorRatio,
  setCompressorReleaseTime,
  setCompressorThreshold,
  setElementDisplayMode,
  setEchoAmount,
  setEchoStyle,
  setFxEnabled,
  setGateActive,
  setGateAttack,
  setGateAttenuation,
  setGateRelease,
  setGateThreshold,
  setGenderAmount,
  setGenderStyle,
  setHardTuneAmount,
  setHardTuneEnabled,
  setHardTuneSource,
  setHardTuneStyle,
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
  setMegaphoneAmount,
  setMegaphoneEnabled,
  setMegaphoneStyle,
  setMonitorMix,
  setMonitorWithFx,
  setMicrophoneGain,
  setMicrophoneType,
  setMuteHoldDuration,
  setPitchAmount,
  setPitchStyle,
  setReverbAmount,
  setReverbStyle,
  setRobotEnabled,
  setRobotStyle,
  setSampleStartPercent,
  setSampleStopPercent,
  setSamplerFadeDuration,
  setSamplerFunction,
  setSamplerOrder,
  setSamplerResetOnClear,
  setSimpleColour,
  setRouterEntry,
  stopSamplePlayback,
  setSubmixEnabled,
  setSubmixLinked,
  setSubmixOutputMix,
  setSubmixVolume,
  setVcMuteAlsoMuteCm,
  setVodMode
} from './goxlrApi'
import {
  GoXlrAnimationMode,
  GoXlrAppState,
  GoXlrChannelName,
  GoXlrCompressorAttackTime,
  GoXlrCompressorRatio,
  GoXlrCompressorReleaseTime,
  GoXlrDisplayMode,
  GoXlrEchoStyle,
  GoXlrEffectPreset,
  GoXlrFaderName,
  GoXlrGateTime,
  GoXlrGenderStyle,
  GoXlrHardTuneSource,
  GoXlrHardTuneStyle,
  GoXlrInputDevice,
  GoXlrMix,
  GoXlrMegaphoneStyle,
  GoXlrMicrophoneType,
  GoXlrOutputDevice,
  GoXlrPathType,
  GoXlrPitchStyle,
  GoXlrReverbStyle,
  GoXlrRobotStyle,
  GoXlrSampleBank,
  GoXlrSampleButton,
  GoXlrSamplePlaybackMode,
  GoXlrSamplePlayOrder,
  GoXlrSimpleColourTarget,
  GoXlrVodMode,
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
  ipcMain.handle(
    'goxlr:set-gate-threshold',
    async (_event, payload: { serial: string; value: number }) => {
      await setGateThreshold(payload.serial, payload.value)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-gate-attenuation',
    async (_event, payload: { serial: string; value: number }) => {
      await setGateAttenuation(payload.serial, payload.value)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-gate-attack',
    async (_event, payload: { serial: string; value: GoXlrGateTime }) => {
      await setGateAttack(payload.serial, payload.value)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-gate-release',
    async (_event, payload: { serial: string; value: GoXlrGateTime }) => {
      await setGateRelease(payload.serial, payload.value)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-gate-active',
    async (_event, payload: { serial: string; enabled: boolean }) => {
      await setGateActive(payload.serial, payload.enabled)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-compressor-threshold',
    async (_event, payload: { serial: string; value: number }) => {
      await setCompressorThreshold(payload.serial, payload.value)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-compressor-ratio',
    async (_event, payload: { serial: string; value: GoXlrCompressorRatio }) => {
      await setCompressorRatio(payload.serial, payload.value)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-compressor-attack',
    async (_event, payload: { serial: string; value: GoXlrCompressorAttackTime }) => {
      await setCompressorAttack(payload.serial, payload.value)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-compressor-release',
    async (_event, payload: { serial: string; value: GoXlrCompressorReleaseTime }) => {
      await setCompressorReleaseTime(payload.serial, payload.value)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-compressor-makeup-gain',
    async (_event, payload: { serial: string; value: number }) => {
      await setCompressorMakeupGain(payload.serial, payload.value)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-display-mode',
    async (
      _event,
      payload: {
        serial: string
        component: 'NoiseGate' | 'Equaliser' | 'Compressor' | 'EqFineTune'
        mode: GoXlrDisplayMode
      }
    ) => {
      await setElementDisplayMode(payload.serial, payload.component, payload.mode)
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
    'goxlr:set-mute-hold-duration',
    async (_event, payload: { serial: string; duration: number }) => {
      await setMuteHoldDuration(payload.serial, payload.duration)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-vc-mute-also-mute-cm',
    async (_event, payload: { serial: string; enabled: boolean }) => {
      await setVcMuteAlsoMuteCm(payload.serial, payload.enabled)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-sampler-reset-on-clear',
    async (_event, payload: { serial: string; enabled: boolean }) => {
      await setSamplerResetOnClear(payload.serial, payload.enabled)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-sampler-fade-duration',
    async (_event, payload: { serial: string; duration: number }) => {
      await setSamplerFadeDuration(payload.serial, payload.duration)
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
    'goxlr:set-fx-enabled',
    async (_event, payload: { serial: string; enabled: boolean }) => {
      await setFxEnabled(payload.serial, payload.enabled)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-megaphone-enabled',
    async (_event, payload: { serial: string; enabled: boolean }) => {
      await setMegaphoneEnabled(payload.serial, payload.enabled)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-robot-enabled',
    async (_event, payload: { serial: string; enabled: boolean }) => {
      await setRobotEnabled(payload.serial, payload.enabled)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-hard-tune-enabled',
    async (_event, payload: { serial: string; enabled: boolean }) => {
      await setHardTuneEnabled(payload.serial, payload.enabled)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-reverb-style',
    async (_event, payload: { serial: string; style: GoXlrReverbStyle }) => {
      await setReverbStyle(payload.serial, payload.style)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-reverb-amount',
    async (_event, payload: { serial: string; amount: number }) => {
      await setReverbAmount(payload.serial, payload.amount)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-echo-style',
    async (_event, payload: { serial: string; style: GoXlrEchoStyle }) => {
      await setEchoStyle(payload.serial, payload.style)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-echo-amount',
    async (_event, payload: { serial: string; amount: number }) => {
      await setEchoAmount(payload.serial, payload.amount)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-pitch-style',
    async (_event, payload: { serial: string; style: GoXlrPitchStyle }) => {
      await setPitchStyle(payload.serial, payload.style)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-pitch-amount',
    async (_event, payload: { serial: string; amount: number }) => {
      await setPitchAmount(payload.serial, payload.amount)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-gender-style',
    async (_event, payload: { serial: string; style: GoXlrGenderStyle }) => {
      await setGenderStyle(payload.serial, payload.style)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-gender-amount',
    async (_event, payload: { serial: string; amount: number }) => {
      await setGenderAmount(payload.serial, payload.amount)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-megaphone-style',
    async (_event, payload: { serial: string; style: GoXlrMegaphoneStyle }) => {
      await setMegaphoneStyle(payload.serial, payload.style)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-megaphone-amount',
    async (_event, payload: { serial: string; amount: number }) => {
      await setMegaphoneAmount(payload.serial, payload.amount)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-robot-style',
    async (_event, payload: { serial: string; style: GoXlrRobotStyle }) => {
      await setRobotStyle(payload.serial, payload.style)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-hard-tune-style',
    async (_event, payload: { serial: string; style: GoXlrHardTuneStyle }) => {
      await setHardTuneStyle(payload.serial, payload.style)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-hard-tune-amount',
    async (_event, payload: { serial: string; amount: number }) => {
      await setHardTuneAmount(payload.serial, payload.amount)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-hard-tune-source',
    async (_event, payload: { serial: string; source: GoXlrHardTuneSource }) => {
      await setHardTuneSource(payload.serial, payload.source)
      return buildAppState()
    }
  )

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
    'goxlr:set-sampler-function',
    async (
      _event,
      payload: {
        serial: string
        bank: GoXlrSampleBank
        button: GoXlrSampleButton
        mode: GoXlrSamplePlaybackMode
      }
    ) => {
      await setSamplerFunction(payload.serial, payload.bank, payload.button, payload.mode)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-sampler-order',
    async (
      _event,
      payload: {
        serial: string
        bank: GoXlrSampleBank
        button: GoXlrSampleButton
        order: GoXlrSamplePlayOrder
      }
    ) => {
      await setSamplerOrder(payload.serial, payload.bank, payload.button, payload.order)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:add-sample',
    async (
      _event,
      payload: {
        serial: string
        bank: GoXlrSampleBank
        button: GoXlrSampleButton
        sampleName: string
      }
    ) => {
      await addSampleToButton(payload.serial, payload.bank, payload.button, payload.sampleName)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:remove-sample',
    async (
      _event,
      payload: {
        serial: string
        bank: GoXlrSampleBank
        button: GoXlrSampleButton
        index: number
      }
    ) => {
      await removeSampleByIndex(payload.serial, payload.bank, payload.button, payload.index)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-sample-start',
    async (
      _event,
      payload: {
        serial: string
        bank: GoXlrSampleBank
        button: GoXlrSampleButton
        index: number
        value: number
      }
    ) => {
      await setSampleStartPercent(payload.serial, payload.bank, payload.button, payload.index, payload.value)
      return buildAppState()
    }
  )
  ipcMain.handle(
    'goxlr:set-sample-stop',
    async (
      _event,
      payload: {
        serial: string
        bank: GoXlrSampleBank
        button: GoXlrSampleButton
        index: number
        value: number
      }
    ) => {
      await setSampleStopPercent(payload.serial, payload.bank, payload.button, payload.index, payload.value)
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
