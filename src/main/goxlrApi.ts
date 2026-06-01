import {
  GoXlrAnimationMode,
  DaemonStatus,
  GoXlrChannelName,
  GoXlrCompressorAttackTime,
  GoXlrCompressorRatio,
  GoXlrCompressorReleaseTime,
  GoXlrDisplayMode,
  GoXlrEqFrequency,
  GoXlrEchoStyle,
  GoXlrEffectPreset,
  GoXlrFaderName,
  GoXlrGateTime,
  GoXlrGenderStyle,
  GoXlrHardTuneSource,
  GoXlrHardTuneStyle,
  GoXlrInputDevice,
  GoXlrMegaphoneStyle,
  GoXlrMix,
  GoXlrMiniEqFrequency,
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

const ENDPOINT = 'http://127.0.0.1:14564'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Daemon HTTP error ${response.status}`)
  }
  return (await response.json()) as T
}

export async function fetchDaemonStatus(): Promise<DaemonStatus> {
  const response = await fetch(`${ENDPOINT}/api/get-devices`)
  return handleResponse<DaemonStatus>(response)
}

export async function sendDaemonRequest(payload: unknown): Promise<unknown> {
  const response = await fetch(`${ENDPOINT}/api/command`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  return handleResponse<unknown>(response)
}

export async function sendMixerCommand(serial: string, command: unknown): Promise<void> {
  const response = (await sendDaemonRequest({
    Command: [serial, command]
  })) as { Error?: string }

  if (response && typeof response === 'object' && 'Error' in response && response.Error) {
    throw new Error(response.Error)
  }
}

export async function sendDaemonControl(command: unknown): Promise<void> {
  const response = (await sendDaemonRequest({
    Daemon: command
  })) as { Error?: string }

  if (response && typeof response === 'object' && 'Error' in response && response.Error) {
    throw new Error(response.Error)
  }
}

export async function setChannelVolume(
  serial: string,
  channel: GoXlrChannelName,
  volume: number
): Promise<void> {
  await sendMixerCommand(serial, {
    SetVolume: [channel, volume]
  })
}

export async function setFaderAssignment(
  serial: string,
  fader: GoXlrFaderName,
  channel: GoXlrChannelName
): Promise<void> {
  await sendMixerCommand(serial, {
    SetFader: [fader, channel]
  })
}

export async function setRouterEntry(
  serial: string,
  input: GoXlrInputDevice,
  output: GoXlrOutputDevice,
  enabled: boolean
): Promise<void> {
  await sendMixerCommand(serial, {
    SetRouter: [input, output, enabled]
  })
}

export async function setMicrophoneType(
  serial: string,
  microphoneType: GoXlrMicrophoneType
): Promise<void> {
  await sendMixerCommand(serial, {
    SetMicrophoneType: microphoneType
  })
}

export async function setMicrophoneGain(
  serial: string,
  microphoneType: GoXlrMicrophoneType,
  gain: number
): Promise<void> {
  await sendMixerCommand(serial, {
    SetMicrophoneGain: [microphoneType, gain]
  })
}

export async function setGateThreshold(serial: string, value: number): Promise<void> {
  await sendMixerCommand(serial, {
    SetGateThreshold: value
  })
}

export async function setGateAttenuation(serial: string, value: number): Promise<void> {
  await sendMixerCommand(serial, {
    SetGateAttenuation: value
  })
}

export async function setGateAttack(serial: string, value: GoXlrGateTime): Promise<void> {
  await sendMixerCommand(serial, {
    SetGateAttack: value
  })
}

export async function setGateRelease(serial: string, value: GoXlrGateTime): Promise<void> {
  await sendMixerCommand(serial, {
    SetGateRelease: value
  })
}

export async function setGateActive(serial: string, enabled: boolean): Promise<void> {
  await sendMixerCommand(serial, {
    SetGateActive: enabled
  })
}

export async function setCompressorThreshold(serial: string, value: number): Promise<void> {
  await sendMixerCommand(serial, {
    SetCompressorThreshold: value
  })
}

export async function setCompressorRatio(
  serial: string,
  value: GoXlrCompressorRatio
): Promise<void> {
  await sendMixerCommand(serial, {
    SetCompressorRatio: value
  })
}

export async function setCompressorAttack(
  serial: string,
  value: GoXlrCompressorAttackTime
): Promise<void> {
  await sendMixerCommand(serial, {
    SetCompressorAttack: value
  })
}

export async function setCompressorReleaseTime(
  serial: string,
  value: GoXlrCompressorReleaseTime
): Promise<void> {
  await sendMixerCommand(serial, {
    SetCompressorReleaseTime: value
  })
}

export async function setCompressorMakeupGain(serial: string, value: number): Promise<void> {
  await sendMixerCommand(serial, {
    SetCompressorMakeUpGain: value
  })
}

export async function setElementDisplayMode(
  serial: string,
  component: 'NoiseGate' | 'Equaliser' | 'Compressor' | 'EqFineTune',
  mode: GoXlrDisplayMode
): Promise<void> {
  await sendMixerCommand(serial, {
    SetElementDisplayMode: [component, mode]
  })
}

export async function setEqMiniGain(
  serial: string,
  frequency: GoXlrMiniEqFrequency,
  value: number
): Promise<void> {
  await sendMixerCommand(serial, {
    SetEqMiniGain: [frequency, value]
  })
}

export async function setEqMiniFreq(
  serial: string,
  frequency: GoXlrMiniEqFrequency,
  value: number
): Promise<void> {
  await sendMixerCommand(serial, {
    SetEqMiniFreq: [frequency, value]
  })
}

export async function setEqGain(
  serial: string,
  frequency: GoXlrEqFrequency,
  value: number
): Promise<void> {
  await sendMixerCommand(serial, {
    SetEqGain: [frequency, value]
  })
}

export async function setEqFreq(
  serial: string,
  frequency: GoXlrEqFrequency,
  value: number
): Promise<void> {
  await sendMixerCommand(serial, {
    SetEqFreq: [frequency, value]
  })
}

export async function loadProfile(serial: string, profileName: string): Promise<void> {
  await sendMixerCommand(serial, {
    LoadProfile: [profileName, false]
  })
}

export async function saveProfile(serial: string): Promise<void> {
  await sendMixerCommand(serial, 'SaveProfile')
}

export async function loadMicProfile(serial: string, profileName: string): Promise<void> {
  await sendMixerCommand(serial, {
    LoadMicProfile: [profileName, false]
  })
}

export async function saveMicProfile(serial: string): Promise<void> {
  await sendMixerCommand(serial, 'SaveMicProfile')
}

export async function openPath(pathType: GoXlrPathType): Promise<void> {
  await sendDaemonControl({
    OpenPath: pathType
  })
}

export async function setMonitorMix(serial: string, output: GoXlrOutputDevice): Promise<void> {
  await sendMixerCommand(serial, {
    SetMonitorMix: output
  })
}

export async function setMonitorWithFx(serial: string, enabled: boolean): Promise<void> {
  await sendMixerCommand(serial, {
    SetMonitorWithFx: enabled
  })
}

export async function setSubmixEnabled(serial: string, enabled: boolean): Promise<void> {
  await sendMixerCommand(serial, {
    SetSubMixEnabled: enabled
  })
}

export async function setSubmixVolume(
  serial: string,
  channel: 'Mic' | 'LineIn' | 'Console' | 'System' | 'Game' | 'Chat' | 'Sample' | 'Music',
  volume: number
): Promise<void> {
  await sendMixerCommand(serial, {
    SetSubMixVolume: [channel, volume]
  })
}

export async function setSubmixLinked(
  serial: string,
  channel: 'Mic' | 'LineIn' | 'Console' | 'System' | 'Game' | 'Chat' | 'Sample' | 'Music',
  linked: boolean
): Promise<void> {
  await sendMixerCommand(serial, {
    SetSubMixLinked: [channel, linked]
  })
}

export async function setSubmixOutputMix(
  serial: string,
  output: GoXlrOutputDevice,
  mix: GoXlrMix
): Promise<void> {
  await sendMixerCommand(serial, {
    SetSubMixOutputMix: [output, mix]
  })
}

export async function setBleepLevel(serial: string, value: number): Promise<void> {
  await sendMixerCommand(serial, {
    SetSwearButtonVolume: value
  })
}

export async function setDeEsser(serial: string, value: number): Promise<void> {
  await sendMixerCommand(serial, {
    SetDeeser: value
  })
}

export async function setLockFaders(serial: string, enabled: boolean): Promise<void> {
  await sendMixerCommand(serial, {
    SetLockFaders: enabled
  })
}

export async function setVodMode(serial: string, mode: GoXlrVodMode): Promise<void> {
  await sendMixerCommand(serial, {
    SetVodMode: mode
  })
}

export async function setMuteHoldDuration(serial: string, duration: number): Promise<void> {
  await sendMixerCommand(serial, {
    SetMuteHoldDuration: duration
  })
}

export async function setVcMuteAlsoMuteCm(serial: string, enabled: boolean): Promise<void> {
  await sendMixerCommand(serial, {
    SetVCMuteAlsoMuteCM: enabled
  })
}

export async function setSamplerResetOnClear(serial: string, enabled: boolean): Promise<void> {
  await sendMixerCommand(serial, {
    SetSamplerResetOnClear: enabled
  })
}

export async function setSamplerFadeDuration(serial: string, duration: number): Promise<void> {
  await sendMixerCommand(serial, {
    SetSamplerFadeDuration: duration
  })
}

export async function setActiveEffectPreset(
  serial: string,
  preset: GoXlrEffectPreset
): Promise<void> {
  await sendMixerCommand(serial, {
    SetActiveEffectPreset: preset
  })
}

export async function saveActivePreset(serial: string): Promise<void> {
  await sendMixerCommand(serial, 'SaveActivePreset')
}

export async function setFxEnabled(serial: string, enabled: boolean): Promise<void> {
  await sendMixerCommand(serial, {
    SetFXEnabled: enabled
  })
}

export async function setMegaphoneEnabled(serial: string, enabled: boolean): Promise<void> {
  await sendMixerCommand(serial, {
    SetMegaphoneEnabled: enabled
  })
}

export async function setRobotEnabled(serial: string, enabled: boolean): Promise<void> {
  await sendMixerCommand(serial, {
    SetRobotEnabled: enabled
  })
}

export async function setHardTuneEnabled(serial: string, enabled: boolean): Promise<void> {
  await sendMixerCommand(serial, {
    SetHardTuneEnabled: enabled
  })
}

export async function setReverbStyle(serial: string, style: GoXlrReverbStyle): Promise<void> {
  await sendMixerCommand(serial, {
    SetReverbStyle: style
  })
}

export async function setReverbAmount(serial: string, amount: number): Promise<void> {
  await sendMixerCommand(serial, {
    SetReverbAmount: amount
  })
}

export async function setEchoStyle(serial: string, style: GoXlrEchoStyle): Promise<void> {
  await sendMixerCommand(serial, {
    SetEchoStyle: style
  })
}

export async function setEchoAmount(serial: string, amount: number): Promise<void> {
  await sendMixerCommand(serial, {
    SetEchoAmount: amount
  })
}

export async function setPitchStyle(serial: string, style: GoXlrPitchStyle): Promise<void> {
  await sendMixerCommand(serial, {
    SetPitchStyle: style
  })
}

export async function setPitchAmount(serial: string, amount: number): Promise<void> {
  await sendMixerCommand(serial, {
    SetPitchAmount: amount
  })
}

export async function setGenderStyle(serial: string, style: GoXlrGenderStyle): Promise<void> {
  await sendMixerCommand(serial, {
    SetGenderStyle: style
  })
}

export async function setGenderAmount(serial: string, amount: number): Promise<void> {
  await sendMixerCommand(serial, {
    SetGenderAmount: amount
  })
}

export async function setMegaphoneStyle(serial: string, style: GoXlrMegaphoneStyle): Promise<void> {
  await sendMixerCommand(serial, {
    SetMegaphoneStyle: style
  })
}

export async function setMegaphoneAmount(serial: string, amount: number): Promise<void> {
  await sendMixerCommand(serial, {
    SetMegaphoneAmount: amount
  })
}

export async function setRobotStyle(serial: string, style: GoXlrRobotStyle): Promise<void> {
  await sendMixerCommand(serial, {
    SetRobotStyle: style
  })
}

export async function setHardTuneStyle(serial: string, style: GoXlrHardTuneStyle): Promise<void> {
  await sendMixerCommand(serial, {
    SetHardTuneStyle: style
  })
}

export async function setHardTuneAmount(serial: string, amount: number): Promise<void> {
  await sendMixerCommand(serial, {
    SetHardTuneAmount: amount
  })
}

export async function setHardTuneSource(
  serial: string,
  source: GoXlrHardTuneSource
): Promise<void> {
  await sendMixerCommand(serial, {
    SetHardTuneSource: source
  })
}

export async function setAnimationMode(serial: string, mode: GoXlrAnimationMode): Promise<void> {
  await sendMixerCommand(serial, {
    SetAnimationMode: mode
  })
}

export async function setAnimationMod1(serial: string, value: number): Promise<void> {
  await sendMixerCommand(serial, {
    SetAnimationMod1: value
  })
}

export async function setAnimationMod2(serial: string, value: number): Promise<void> {
  await sendMixerCommand(serial, {
    SetAnimationMod2: value
  })
}

export async function setAnimationWaterfall(
  serial: string,
  direction: GoXlrWaterfallDirection
): Promise<void> {
  await sendMixerCommand(serial, {
    SetAnimationWaterfall: direction
  })
}

export async function setSimpleColour(
  serial: string,
  target: GoXlrSimpleColourTarget,
  colour: string
): Promise<void> {
  await sendMixerCommand(serial, {
    SetSimpleColour: [target, colour]
  })
}

export async function setActiveSamplerBank(serial: string, bank: GoXlrSampleBank): Promise<void> {
  await sendMixerCommand(serial, {
    SetActiveSamplerBank: bank
  })
}

export async function setSamplerFunction(
  serial: string,
  bank: GoXlrSampleBank,
  button: GoXlrSampleButton,
  mode: GoXlrSamplePlaybackMode
): Promise<void> {
  await sendMixerCommand(serial, {
    SetSamplerFunction: [bank, button, mode]
  })
}

export async function setSamplerOrder(
  serial: string,
  bank: GoXlrSampleBank,
  button: GoXlrSampleButton,
  order: GoXlrSamplePlayOrder
): Promise<void> {
  await sendMixerCommand(serial, {
    SetSamplerOrder: [bank, button, order]
  })
}

export async function addSampleToButton(
  serial: string,
  bank: GoXlrSampleBank,
  button: GoXlrSampleButton,
  sampleName: string
): Promise<void> {
  await sendMixerCommand(serial, {
    AddSample: [bank, button, sampleName]
  })
}

export async function removeSampleByIndex(
  serial: string,
  bank: GoXlrSampleBank,
  button: GoXlrSampleButton,
  index: number
): Promise<void> {
  await sendMixerCommand(serial, {
    RemoveSampleByIndex: [bank, button, index]
  })
}

export async function setSampleStartPercent(
  serial: string,
  bank: GoXlrSampleBank,
  button: GoXlrSampleButton,
  index: number,
  value: number
): Promise<void> {
  await sendMixerCommand(serial, {
    SetSampleStartPercent: [bank, button, index, value]
  })
}

export async function setSampleStopPercent(
  serial: string,
  bank: GoXlrSampleBank,
  button: GoXlrSampleButton,
  index: number,
  value: number
): Promise<void> {
  await sendMixerCommand(serial, {
    SetSampleStopPercent: [bank, button, index, value]
  })
}

export async function playNextSample(
  serial: string,
  bank: GoXlrSampleBank,
  button: GoXlrSampleButton
): Promise<void> {
  await sendMixerCommand(serial, {
    PlayNextSample: [bank, button]
  })
}

export async function stopSamplePlayback(
  serial: string,
  bank: GoXlrSampleBank,
  button: GoXlrSampleButton
): Promise<void> {
  await sendMixerCommand(serial, {
    StopSamplePlayback: [bank, button]
  })
}
