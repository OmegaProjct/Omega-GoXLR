import { contextBridge, ipcRenderer } from 'electron'

const api = {
  getAppState: () => ipcRenderer.invoke('goxlr:get-app-state'),
  startDaemon: () => ipcRenderer.invoke('goxlr:start-daemon'),
  refreshStatus: () => ipcRenderer.invoke('goxlr:refresh-status'),
  setVolume: (serial: string, channel: string, volume: number) =>
    ipcRenderer.invoke('goxlr:set-volume', { serial, channel, volume }),
  setFader: (serial: string, fader: string, channel: string) =>
    ipcRenderer.invoke('goxlr:set-fader', { serial, fader, channel }),
  setRouter: (serial: string, input: string, output: string, enabled: boolean) =>
    ipcRenderer.invoke('goxlr:set-router', { serial, input, output, enabled }),
  setMicType: (serial: string, microphoneType: string) =>
    ipcRenderer.invoke('goxlr:set-mic-type', { serial, microphoneType }),
  setMicGain: (serial: string, microphoneType: string, gain: number) =>
    ipcRenderer.invoke('goxlr:set-mic-gain', { serial, microphoneType, gain }),
  loadProfile: (serial: string, profileName: string) =>
    ipcRenderer.invoke('goxlr:load-profile', { serial, profileName }),
  saveProfile: (serial: string) => ipcRenderer.invoke('goxlr:save-profile', { serial }),
  loadMicProfile: (serial: string, profileName: string) =>
    ipcRenderer.invoke('goxlr:load-mic-profile', { serial, profileName }),
  saveMicProfile: (serial: string) => ipcRenderer.invoke('goxlr:save-mic-profile', { serial }),
  openPath: (pathType: string) => ipcRenderer.invoke('goxlr:open-path', { pathType }),
  setMonitorMix: (serial: string, output: string) =>
    ipcRenderer.invoke('goxlr:set-monitor-mix', { serial, output }),
  setMonitorWithFx: (serial: string, enabled: boolean) =>
    ipcRenderer.invoke('goxlr:set-monitor-with-fx', { serial, enabled }),
  setSubmixEnabled: (serial: string, enabled: boolean) =>
    ipcRenderer.invoke('goxlr:set-submix-enabled', { serial, enabled }),
  setSubmixVolume: (serial: string, channel: string, volume: number) =>
    ipcRenderer.invoke('goxlr:set-submix-volume', { serial, channel, volume }),
  setSubmixLinked: (serial: string, channel: string, linked: boolean) =>
    ipcRenderer.invoke('goxlr:set-submix-linked', { serial, channel, linked }),
  setSubmixOutputMix: (serial: string, output: string, mix: string) =>
    ipcRenderer.invoke('goxlr:set-submix-output-mix', { serial, output, mix }),
  setBleepLevel: (serial: string, value: number) =>
    ipcRenderer.invoke('goxlr:set-bleep-level', { serial, value }),
  setDeEsser: (serial: string, value: number) =>
    ipcRenderer.invoke('goxlr:set-deesser', { serial, value }),
  setLockFaders: (serial: string, enabled: boolean) =>
    ipcRenderer.invoke('goxlr:set-lock-faders', { serial, enabled }),
  setVodMode: (serial: string, mode: string) =>
    ipcRenderer.invoke('goxlr:set-vod-mode', { serial, mode }),
  setMuteHoldDuration: (serial: string, duration: number) =>
    ipcRenderer.invoke('goxlr:set-mute-hold-duration', { serial, duration }),
  setVcMuteAlsoMuteCm: (serial: string, enabled: boolean) =>
    ipcRenderer.invoke('goxlr:set-vc-mute-also-mute-cm', { serial, enabled }),
  setSamplerResetOnClear: (serial: string, enabled: boolean) =>
    ipcRenderer.invoke('goxlr:set-sampler-reset-on-clear', { serial, enabled }),
  setSamplerFadeDuration: (serial: string, duration: number) =>
    ipcRenderer.invoke('goxlr:set-sampler-fade-duration', { serial, duration }),
  setEffectPreset: (serial: string, preset: string) =>
    ipcRenderer.invoke('goxlr:set-effect-preset', { serial, preset }),
  saveEffectPreset: (serial: string) => ipcRenderer.invoke('goxlr:save-effect-preset', { serial }),
  setFxEnabled: (serial: string, enabled: boolean) =>
    ipcRenderer.invoke('goxlr:set-fx-enabled', { serial, enabled }),
  setMegaphoneEnabled: (serial: string, enabled: boolean) =>
    ipcRenderer.invoke('goxlr:set-megaphone-enabled', { serial, enabled }),
  setRobotEnabled: (serial: string, enabled: boolean) =>
    ipcRenderer.invoke('goxlr:set-robot-enabled', { serial, enabled }),
  setHardTuneEnabled: (serial: string, enabled: boolean) =>
    ipcRenderer.invoke('goxlr:set-hard-tune-enabled', { serial, enabled }),
  setReverbStyle: (serial: string, style: string) =>
    ipcRenderer.invoke('goxlr:set-reverb-style', { serial, style }),
  setReverbAmount: (serial: string, amount: number) =>
    ipcRenderer.invoke('goxlr:set-reverb-amount', { serial, amount }),
  setEchoStyle: (serial: string, style: string) =>
    ipcRenderer.invoke('goxlr:set-echo-style', { serial, style }),
  setEchoAmount: (serial: string, amount: number) =>
    ipcRenderer.invoke('goxlr:set-echo-amount', { serial, amount }),
  setPitchStyle: (serial: string, style: string) =>
    ipcRenderer.invoke('goxlr:set-pitch-style', { serial, style }),
  setPitchAmount: (serial: string, amount: number) =>
    ipcRenderer.invoke('goxlr:set-pitch-amount', { serial, amount }),
  setGenderStyle: (serial: string, style: string) =>
    ipcRenderer.invoke('goxlr:set-gender-style', { serial, style }),
  setGenderAmount: (serial: string, amount: number) =>
    ipcRenderer.invoke('goxlr:set-gender-amount', { serial, amount }),
  setMegaphoneStyle: (serial: string, style: string) =>
    ipcRenderer.invoke('goxlr:set-megaphone-style', { serial, style }),
  setMegaphoneAmount: (serial: string, amount: number) =>
    ipcRenderer.invoke('goxlr:set-megaphone-amount', { serial, amount }),
  setRobotStyle: (serial: string, style: string) =>
    ipcRenderer.invoke('goxlr:set-robot-style', { serial, style }),
  setHardTuneStyle: (serial: string, style: string) =>
    ipcRenderer.invoke('goxlr:set-hard-tune-style', { serial, style }),
  setHardTuneAmount: (serial: string, amount: number) =>
    ipcRenderer.invoke('goxlr:set-hard-tune-amount', { serial, amount }),
  setHardTuneSource: (serial: string, source: string) =>
    ipcRenderer.invoke('goxlr:set-hard-tune-source', { serial, source }),
  setAnimationMode: (serial: string, mode: string) =>
    ipcRenderer.invoke('goxlr:set-animation-mode', { serial, mode }),
  setAnimationMod1: (serial: string, value: number) =>
    ipcRenderer.invoke('goxlr:set-animation-mod1', { serial, value }),
  setAnimationMod2: (serial: string, value: number) =>
    ipcRenderer.invoke('goxlr:set-animation-mod2', { serial, value }),
  setAnimationWaterfall: (serial: string, direction: string) =>
    ipcRenderer.invoke('goxlr:set-animation-waterfall', { serial, direction }),
  setSimpleColour: (serial: string, target: string, colour: string) =>
    ipcRenderer.invoke('goxlr:set-simple-colour', { serial, target, colour }),
  setSamplerBank: (serial: string, bank: string) =>
    ipcRenderer.invoke('goxlr:set-sampler-bank', { serial, bank }),
  setSamplerFunction: (serial: string, bank: string, button: string, mode: string) =>
    ipcRenderer.invoke('goxlr:set-sampler-function', { serial, bank, button, mode }),
  setSamplerOrder: (serial: string, bank: string, button: string, order: string) =>
    ipcRenderer.invoke('goxlr:set-sampler-order', { serial, bank, button, order }),
  addSample: (serial: string, bank: string, button: string, sampleName: string) =>
    ipcRenderer.invoke('goxlr:add-sample', { serial, bank, button, sampleName }),
  removeSample: (serial: string, bank: string, button: string, index: number) =>
    ipcRenderer.invoke('goxlr:remove-sample', { serial, bank, button, index }),
  setSampleStart: (serial: string, bank: string, button: string, index: number, value: number) =>
    ipcRenderer.invoke('goxlr:set-sample-start', { serial, bank, button, index, value }),
  setSampleStop: (serial: string, bank: string, button: string, index: number, value: number) =>
    ipcRenderer.invoke('goxlr:set-sample-stop', { serial, bank, button, index, value }),
  playNextSample: (serial: string, bank: string, button: string) =>
    ipcRenderer.invoke('goxlr:play-next-sample', { serial, bank, button }),
  stopSample: (serial: string, bank: string, button: string) =>
    ipcRenderer.invoke('goxlr:stop-sample', { serial, bank, button })
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('goxlrApi', api)
} else {
  window.goxlrApi = api
}
