import type {
  GoXlrAppState,
  GoXlrChannelName,
  GoXlrFaderName,
  GoXlrInputDevice,
  GoXlrMicrophoneType,
  GoXlrOutputDevice,
  GoXlrPathType
} from '../main/goxlrTypes'

export interface GoXlrBridge {
  getAppState: () => Promise<GoXlrAppState>
  startDaemon: () => Promise<GoXlrAppState>
  refreshStatus: () => Promise<GoXlrAppState>
  setVolume: (serial: string, channel: GoXlrChannelName, volume: number) => Promise<GoXlrAppState>
  setFader: (
    serial: string,
    fader: GoXlrFaderName,
    channel: GoXlrChannelName
  ) => Promise<GoXlrAppState>
  setRouter: (
    serial: string,
    input: GoXlrInputDevice,
    output: GoXlrOutputDevice,
    enabled: boolean
  ) => Promise<GoXlrAppState>
  setMicType: (serial: string, microphoneType: GoXlrMicrophoneType) => Promise<GoXlrAppState>
  setMicGain: (
    serial: string,
    microphoneType: GoXlrMicrophoneType,
    gain: number
  ) => Promise<GoXlrAppState>
  loadProfile: (serial: string, profileName: string) => Promise<GoXlrAppState>
  saveProfile: (serial: string) => Promise<GoXlrAppState>
  loadMicProfile: (serial: string, profileName: string) => Promise<GoXlrAppState>
  saveMicProfile: (serial: string) => Promise<GoXlrAppState>
  openPath: (pathType: GoXlrPathType) => Promise<boolean>
}

declare global {
  interface Window {
    goxlrApi: GoXlrBridge
  }
}
