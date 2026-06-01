export type GoXlrAppState = {
  daemon: {
    running: boolean
    source: string | null
    startedByApp: boolean
    endpoint: string
    lastError: string | null
  }
  status: DaemonStatus | null
}

export type DaemonStatus = {
  config: {
    daemon_version: string
    http_settings: {
      enabled: boolean
      bind_address: string
      cors_enabled: boolean
      port: number
    }
  }
  mixers: Record<string, MixerStatus>
}

export type MixerStatus = {
  hardware: {
    serial_number: string
    device_type: string
  }
  profile_name: string
  mic_profile_name: string
  levels: {
    volumes: Record<string, number>
  }
}
