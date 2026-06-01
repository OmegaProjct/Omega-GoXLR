export type GoXlrPathType =
  | 'Profiles'
  | 'MicProfiles'
  | 'Presets'
  | 'Samples'
  | 'Icons'
  | 'Logs'
  | 'Backups'

export type GoXlrFaderName = 'A' | 'B' | 'C' | 'D'

export type GoXlrChannelName =
  | 'Mic'
  | 'LineIn'
  | 'Console'
  | 'System'
  | 'Game'
  | 'Chat'
  | 'Sample'
  | 'Music'
  | 'Headphones'
  | 'MicMonitor'
  | 'LineOut'

export type GoXlrInputDevice =
  | 'Microphone'
  | 'Chat'
  | 'Music'
  | 'Game'
  | 'Console'
  | 'LineIn'
  | 'System'
  | 'Samples'

export type GoXlrOutputDevice =
  | 'Headphones'
  | 'BroadcastMix'
  | 'ChatMic'
  | 'Sampler'
  | 'LineOut'
  | 'StreamMix2'

export type GoXlrMicrophoneType = 'Dynamic' | 'Condenser' | 'Jack'

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
    platform: string
    locale?: {
      system_locale: string
      user_locale?: string | null
    }
    driver_interface?: {
      interface: string
      version?: string | null
    }
    http_settings: {
      enabled: boolean
      bind_address: string
      cors_enabled: boolean
      port: number
    }
  }
  mixers: Record<string, MixerStatus>
  paths: {
    profile_directory: string
    mic_profile_directory: string
    samples_directory: string
    presets_directory: string
    icons_directory: string
    logs_directory: string
  }
  files: {
    profiles: string[]
    mic_profiles: string[]
    presets: string[]
    icons: string[]
  }
}

export type MixerStatus = {
  hardware: {
    serial_number: string
    device_type: string
    manufactured_date: string
    usb_device: {
      manufacturer_name: string
      product_name: string
      version: [number, number, number]
      bus_number: number
      address: number
      identifier: string
    }
  }
  profile_name: string
  mic_profile_name: string
  fader_status: Record<
    GoXlrFaderName,
    {
      channel: GoXlrChannelName
      mute_type: string
      mute_state: string
    }
  >
  mic_status: {
    mic_type: GoXlrMicrophoneType
    mic_gains: Record<GoXlrMicrophoneType, number>
    noise_gate: {
      threshold: number
      enabled: boolean
      attenuation: number
    }
    compressor: {
      threshold: number
      ratio: string
      makeup_gain: number
    }
  }
  levels: {
    submix_supported: boolean
    output_monitor: GoXlrOutputDevice
    volumes: Record<GoXlrChannelName, number>
    bleep: number
    deess: number
  }
  router: Record<GoXlrInputDevice, Record<GoXlrOutputDevice, boolean>>
  settings: {
    mute_hold_duration: number
    lock_faders: boolean
    vod_mode: string
  }
}
