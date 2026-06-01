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
  openPath: (pathType: string) => ipcRenderer.invoke('goxlr:open-path', { pathType })
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('goxlrApi', api)
} else {
  window.goxlrApi = api
}
