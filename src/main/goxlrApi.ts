import {
  DaemonStatus,
  GoXlrChannelName,
  GoXlrEffectPreset,
  GoXlrFaderName,
  GoXlrInputDevice,
  GoXlrMix,
  GoXlrMicrophoneType,
  GoXlrOutputDevice,
  GoXlrPathType,
  GoXlrVodMode
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
