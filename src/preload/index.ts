import { contextBridge, ipcRenderer } from 'electron'

const api = {
  getAppState: () => ipcRenderer.invoke('goxlr:get-app-state'),
  startDaemon: () => ipcRenderer.invoke('goxlr:start-daemon'),
  refreshStatus: () => ipcRenderer.invoke('goxlr:refresh-status'),
  setVolume: (serial: string, channel: string, volume: number) =>
    ipcRenderer.invoke('goxlr:set-volume', { serial, channel, volume })
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('goxlrApi', api)
} else {
  window.goxlrApi = api
}
