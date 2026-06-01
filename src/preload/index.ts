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
  setEffectPreset: (serial: string, preset: string) =>
    ipcRenderer.invoke('goxlr:set-effect-preset', { serial, preset }),
  saveEffectPreset: (serial: string) => ipcRenderer.invoke('goxlr:save-effect-preset', { serial })
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('goxlrApi', api)
} else {
  window.goxlrApi = api
}
