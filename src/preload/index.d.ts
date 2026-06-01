import type { GoXlrAppState } from '../main/goxlrTypes'

export interface GoXlrBridge {
  getAppState: () => Promise<GoXlrAppState>
  startDaemon: () => Promise<GoXlrAppState>
  refreshStatus: () => Promise<GoXlrAppState>
  setVolume: (serial: string, channel: string, volume: number) => Promise<GoXlrAppState>
}

declare global {
  interface Window {
    goxlrApi: GoXlrBridge
  }
}
