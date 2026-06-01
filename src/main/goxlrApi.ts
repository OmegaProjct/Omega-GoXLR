import {
  DaemonStatus,
  GoXlrChannelName,
  GoXlrFaderName,
  GoXlrInputDevice,
  GoXlrMicrophoneType,
  GoXlrOutputDevice,
  GoXlrPathType
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
