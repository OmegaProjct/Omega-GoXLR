import type {
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
  setGateThreshold: (serial: string, value: number) => Promise<GoXlrAppState>
  setGateAttenuation: (serial: string, value: number) => Promise<GoXlrAppState>
  setGateAttack: (serial: string, value: GoXlrGateTime) => Promise<GoXlrAppState>
  setGateRelease: (serial: string, value: GoXlrGateTime) => Promise<GoXlrAppState>
  setGateActive: (serial: string, enabled: boolean) => Promise<GoXlrAppState>
  setCompressorThreshold: (serial: string, value: number) => Promise<GoXlrAppState>
  setCompressorRatio: (serial: string, value: GoXlrCompressorRatio) => Promise<GoXlrAppState>
  setCompressorAttack: (
    serial: string,
    value: GoXlrCompressorAttackTime
  ) => Promise<GoXlrAppState>
  setCompressorRelease: (
    serial: string,
    value: GoXlrCompressorReleaseTime
  ) => Promise<GoXlrAppState>
  setCompressorMakeupGain: (serial: string, value: number) => Promise<GoXlrAppState>
  setDisplayMode: (
    serial: string,
    component: 'NoiseGate' | 'Equaliser' | 'Compressor' | 'EqFineTune',
    mode: GoXlrDisplayMode
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
  setMuteHoldDuration: (serial: string, duration: number) => Promise<GoXlrAppState>
  setVcMuteAlsoMuteCm: (serial: string, enabled: boolean) => Promise<GoXlrAppState>
  setSamplerResetOnClear: (serial: string, enabled: boolean) => Promise<GoXlrAppState>
  setSamplerFadeDuration: (serial: string, duration: number) => Promise<GoXlrAppState>
  setEffectPreset: (serial: string, preset: GoXlrEffectPreset) => Promise<GoXlrAppState>
  saveEffectPreset: (serial: string) => Promise<GoXlrAppState>
  setFxEnabled: (serial: string, enabled: boolean) => Promise<GoXlrAppState>
  setMegaphoneEnabled: (serial: string, enabled: boolean) => Promise<GoXlrAppState>
  setRobotEnabled: (serial: string, enabled: boolean) => Promise<GoXlrAppState>
  setHardTuneEnabled: (serial: string, enabled: boolean) => Promise<GoXlrAppState>
  setReverbStyle: (serial: string, style: GoXlrReverbStyle) => Promise<GoXlrAppState>
  setReverbAmount: (serial: string, amount: number) => Promise<GoXlrAppState>
  setEchoStyle: (serial: string, style: GoXlrEchoStyle) => Promise<GoXlrAppState>
  setEchoAmount: (serial: string, amount: number) => Promise<GoXlrAppState>
  setPitchStyle: (serial: string, style: GoXlrPitchStyle) => Promise<GoXlrAppState>
  setPitchAmount: (serial: string, amount: number) => Promise<GoXlrAppState>
  setGenderStyle: (serial: string, style: GoXlrGenderStyle) => Promise<GoXlrAppState>
  setGenderAmount: (serial: string, amount: number) => Promise<GoXlrAppState>
  setMegaphoneStyle: (serial: string, style: GoXlrMegaphoneStyle) => Promise<GoXlrAppState>
  setMegaphoneAmount: (serial: string, amount: number) => Promise<GoXlrAppState>
  setRobotStyle: (serial: string, style: GoXlrRobotStyle) => Promise<GoXlrAppState>
  setHardTuneStyle: (serial: string, style: GoXlrHardTuneStyle) => Promise<GoXlrAppState>
  setHardTuneAmount: (serial: string, amount: number) => Promise<GoXlrAppState>
  setHardTuneSource: (serial: string, source: GoXlrHardTuneSource) => Promise<GoXlrAppState>
  setAnimationMode: (serial: string, mode: GoXlrAnimationMode) => Promise<GoXlrAppState>
  setAnimationMod1: (serial: string, value: number) => Promise<GoXlrAppState>
  setAnimationMod2: (serial: string, value: number) => Promise<GoXlrAppState>
  setAnimationWaterfall: (
    serial: string,
    direction: GoXlrWaterfallDirection
  ) => Promise<GoXlrAppState>
  setSimpleColour: (
    serial: string,
    target: GoXlrSimpleColourTarget,
    colour: string
  ) => Promise<GoXlrAppState>
  setSamplerBank: (serial: string, bank: GoXlrSampleBank) => Promise<GoXlrAppState>
  setSamplerFunction: (
    serial: string,
    bank: GoXlrSampleBank,
    button: GoXlrSampleButton,
    mode: GoXlrSamplePlaybackMode
  ) => Promise<GoXlrAppState>
  setSamplerOrder: (
    serial: string,
    bank: GoXlrSampleBank,
    button: GoXlrSampleButton,
    order: GoXlrSamplePlayOrder
  ) => Promise<GoXlrAppState>
  addSample: (
    serial: string,
    bank: GoXlrSampleBank,
    button: GoXlrSampleButton,
    sampleName: string
  ) => Promise<GoXlrAppState>
  removeSample: (
    serial: string,
    bank: GoXlrSampleBank,
    button: GoXlrSampleButton,
    index: number
  ) => Promise<GoXlrAppState>
  setSampleStart: (
    serial: string,
    bank: GoXlrSampleBank,
    button: GoXlrSampleButton,
    index: number,
    value: number
  ) => Promise<GoXlrAppState>
  setSampleStop: (
    serial: string,
    bank: GoXlrSampleBank,
    button: GoXlrSampleButton,
    index: number,
    value: number
  ) => Promise<GoXlrAppState>
  playNextSample: (
    serial: string,
    bank: GoXlrSampleBank,
    button: GoXlrSampleButton
  ) => Promise<GoXlrAppState>
  stopSample: (
    serial: string,
    bank: GoXlrSampleBank,
    button: GoXlrSampleButton
  ) => Promise<GoXlrAppState>
}

declare global {
  interface Window {
    goxlrApi: GoXlrBridge
  }
}
