import { DaemonStatus } from './goxlrTypes'

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

export async function setChannelVolume(serial: string, channel: string, volume: number): Promise<void> {
  await sendDaemonRequest({
    Command: [serial, { SetVolume: [channel, volume] }]
  })
}
