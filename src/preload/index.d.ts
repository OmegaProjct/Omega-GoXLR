import type {
  GoXlrAppState,
  GoXlrChannelName,
  GoXlrEffectPreset,
  GoXlrFaderName,
  GoXlrInputDevice,
  GoXlrMix,
  GoXlrMicrophoneType,
  GoXlrOutputDevice,
  GoXlrPathType,
  GoXlrVodMode
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
  setMonitorMix: (serial: string, output: GoXlrOutputDevice) => Promise<GoXlrAppState>
  setMonitorWithFx: (serial: string, enabled: boolean) => Promise<GoXlrAppState>
  setSubmixEnabled: (serial: string, enabled: boolean) => Promise<GoXlrAppState>
  setSubmixVolume: (
    serial: string,
    channel: 'Mic' | 'LineIn' | 'Console' | 'System' | 'Game' | 'Chat' | 'Sample' | 'Music',
    volume: number
  ) => Promise<GoXlrAppState>
  setSubmixLinked: (
    serial: string,
    channel: 'Mic' | 'LineIn' | 'Console' | 'System' | 'Game' | 'Chat' | 'Sample' | 'Music',
    linked: boolean
  ) => Promise<GoXlrAppState>
  setSubmixOutputMix: (
    serial: string,
    output: GoXlrOutputDevice,
    mix: GoXlrMix
  ) => Promise<GoXlrAppState>
  setBleepLevel: (serial: string, value: number) => Promise<GoXlrAppState>
  setDeEsser: (serial: string, value: number) => Promise<GoXlrAppState>
  setLockFaders: (serial: string, enabled: boolean) => Promise<GoXlrAppState>
  setVodMode: (serial: string, mode: GoXlrVodMode) => Promise<GoXlrAppState>
  setEffectPreset: (serial: string, preset: GoXlrEffectPreset) => Promise<GoXlrAppState>
  saveEffectPreset: (serial: string) => Promise<GoXlrAppState>
}

declare global {
  interface Window {
    goxlrApi: GoXlrBridge
  }
}
