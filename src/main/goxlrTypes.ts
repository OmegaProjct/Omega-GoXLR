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
export type GoXlrMix = 'A' | 'B'
export type GoXlrEffectPreset = 'Preset1' | 'Preset2' | 'Preset3' | 'Preset4' | 'Preset5' | 'Preset6'
export type GoXlrVodMode = 'Routable' | 'StreamNoMusic'
export type GoXlrCompressorRatio =
  | 'Ratio1_0'
  | 'Ratio1_1'
  | 'Ratio1_2'
  | 'Ratio1_4'
  | 'Ratio1_6'
  | 'Ratio1_8'
  | 'Ratio2_0'
  | 'Ratio2_5'
  | 'Ratio3_2'
  | 'Ratio4_0'
  | 'Ratio5_6'
  | 'Ratio8_0'
  | 'Ratio16_0'
  | 'Ratio32_0'
  | 'Ratio64_0'
export type GoXlrGateTime =
  | 'Gate10ms'
  | 'Gate20ms'
  | 'Gate30ms'
  | 'Gate40ms'
  | 'Gate50ms'
  | 'Gate60ms'
  | 'Gate70ms'
  | 'Gate80ms'
  | 'Gate90ms'
  | 'Gate100ms'
  | 'Gate110ms'
  | 'Gate120ms'
  | 'Gate130ms'
  | 'Gate140ms'
  | 'Gate150ms'
  | 'Gate160ms'
  | 'Gate170ms'
  | 'Gate180ms'
  | 'Gate190ms'
  | 'Gate200ms'
  | 'Gate250ms'
  | 'Gate300ms'
  | 'Gate350ms'
  | 'Gate400ms'
  | 'Gate450ms'
  | 'Gate500ms'
  | 'Gate550ms'
  | 'Gate600ms'
  | 'Gate650ms'
  | 'Gate700ms'
  | 'Gate750ms'
  | 'Gate800ms'
  | 'Gate850ms'
  | 'Gate900ms'
  | 'Gate950ms'
  | 'Gate1000ms'
  | 'Gate1100ms'
  | 'Gate1200ms'
  | 'Gate1300ms'
  | 'Gate1400ms'
  | 'Gate1500ms'
  | 'Gate1600ms'
  | 'Gate1700ms'
  | 'Gate1800ms'
  | 'Gate1900ms'
  | 'Gate2000ms'
export type GoXlrCompressorAttackTime =
  | 'Comp0ms'
  | 'Comp2ms'
  | 'Comp3ms'
  | 'Comp4ms'
  | 'Comp5ms'
  | 'Comp6ms'
  | 'Comp7ms'
  | 'Comp8ms'
  | 'Comp9ms'
  | 'Comp10ms'
  | 'Comp12ms'
  | 'Comp14ms'
  | 'Comp16ms'
  | 'Comp18ms'
  | 'Comp20ms'
  | 'Comp23ms'
  | 'Comp26ms'
  | 'Comp30ms'
  | 'Comp35ms'
  | 'Comp40ms'
export type GoXlrCompressorReleaseTime =
  | 'Comp0ms'
  | 'Comp15ms'
  | 'Comp25ms'
  | 'Comp35ms'
  | 'Comp45ms'
  | 'Comp55ms'
  | 'Comp65ms'
  | 'Comp75ms'
  | 'Comp85ms'
  | 'Comp100ms'
  | 'Comp115ms'
  | 'Comp140ms'
  | 'Comp170ms'
  | 'Comp230ms'
  | 'Comp340ms'
  | 'Comp680ms'
  | 'Comp1000ms'
  | 'Comp1500ms'
  | 'Comp2000ms'
  | 'Comp3000ms'
export type GoXlrDisplayMode = 'Simple' | 'Advanced'
export type GoXlrReverbStyle =
  | 'Library'
  | 'DarkBloom'
  | 'MusicClub'
  | 'RealPlate'
  | 'Chapel'
  | 'HockeyArena'
export type GoXlrEchoStyle =
  | 'Quarter'
  | 'Eighth'
  | 'Triplet'
  | 'PingPong'
  | 'ClassicSlap'
  | 'MultiTap'
export type GoXlrPitchStyle = 'Narrow' | 'Wide'
export type GoXlrGenderStyle = 'Narrow' | 'Medium' | 'Wide'
export type GoXlrMegaphoneStyle =
  | 'Megaphone'
  | 'Radio'
  | 'OnThePhone'
  | 'Overdrive'
  | 'BuzzCutt'
  | 'Tweed'
export type GoXlrRobotStyle = 'Robot1' | 'Robot2' | 'Robot3'
export type GoXlrHardTuneStyle = 'Natural' | 'Medium' | 'Hard'
export type GoXlrHardTuneSource = 'All' | 'Music' | 'Game' | 'LineIn' | 'System'
export type GoXlrAnimationMode =
  | 'RetroRainbow'
  | 'RainbowDark'
  | 'RainbowBright'
  | 'Simple'
  | 'Ripple'
  | 'None'
export type GoXlrWaterfallDirection = 'Down' | 'Up' | 'Off'
export type GoXlrSimpleColourTarget =
  | 'Global'
  | 'Accent'
  | 'Scribble1'
  | 'Scribble2'
  | 'Scribble3'
  | 'Scribble4'
export type GoXlrSampleBank = 'A' | 'B' | 'C'
export type GoXlrSampleButton = 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight'
export type GoXlrSamplePlaybackMode =
  | 'PlayNext'
  | 'PlayStop'
  | 'PlayFade'
  | 'StopOnRelease'
  | 'FadeOnRelease'
  | 'Loop'
export type GoXlrSamplePlayOrder = 'Sequential' | 'Random'

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
    samples: Record<
      string,
      {
        name: string
        gain_pct: number
      }
    >
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
      attack: GoXlrGateTime
      release: GoXlrGateTime
      enabled: boolean
      attenuation: number
    }
    compressor: {
      threshold: number
      ratio: GoXlrCompressorRatio
      attack: GoXlrCompressorAttackTime
      release: GoXlrCompressorReleaseTime
      makeup_gain: number
    }
  }
  levels: {
    submix_supported: boolean
    output_monitor: GoXlrOutputDevice
    volumes: Record<GoXlrChannelName, number>
    submix?: {
      inputs: Record<
        'Mic' | 'LineIn' | 'Console' | 'System' | 'Game' | 'Chat' | 'Sample' | 'Music',
        {
          volume: number
          linked: boolean
          ratio: number
        }
      >
      outputs: Record<GoXlrOutputDevice, GoXlrMix>
    } | null
    bleep: number
    deess: number
  }
  router: Record<GoXlrInputDevice, Record<GoXlrOutputDevice, boolean>>
  lighting: {
    animation: {
      supported: boolean
      mode: GoXlrAnimationMode
      mod1: number
      mod2: number
      waterfall_direction: GoXlrWaterfallDirection
    }
    simple: Record<GoXlrSimpleColourTarget, { colour_one: string }>
  }
  effects?: {
    is_enabled: boolean
    active_preset: GoXlrEffectPreset
    preset_names: Record<GoXlrEffectPreset, string>
    current: {
      reverb: {
        style: GoXlrReverbStyle
        amount: number
        decay: number
        early_level: number
        tail_level: number
        pre_delay: number
        lo_colour: number
        hi_colour: number
        hi_factor: number
        diffuse: number
        mod_speed: number
        mod_depth: number
        raw_encoder: number
      }
      echo: {
        style: GoXlrEchoStyle
        amount: number
        feedback: number
        tempo: number
        delay_left: number
        delay_right: number
        feedback_left: number
        feedback_right: number
        feedback_xfb_l_to_r: number
        feedback_xfb_r_to_l: number
        raw_encoder: number
      }
      pitch: {
        style: GoXlrPitchStyle
        amount: number
        character: number
        raw_encoder: number
      }
      gender: {
        style: GoXlrGenderStyle
        amount: number
        raw_encoder: number
      }
      megaphone: {
        is_enabled: boolean
        style: GoXlrMegaphoneStyle
        amount: number
        post_gain: number
      }
      robot: {
        is_enabled: boolean
        style: GoXlrRobotStyle
        low_gain: number
        low_freq: number
        low_width: number
        mid_gain: number
        mid_freq: number
        mid_width: number
        high_gain: number
        high_freq: number
        high_width: number
        waveform: number
        pulse_width: number
        threshold: number
        dry_mix: number
      }
      hard_tune: {
        is_enabled: boolean
        style: GoXlrHardTuneStyle
        amount: number
        rate: number
        window: number
        source: GoXlrHardTuneSource
      }
    }
  } | null
  sampler?: {
    active_bank: GoXlrSampleBank
    clear_active: boolean
    record_buffer: number
    processing_state: {
      progress: number | null
      last_error: string | null
    }
    banks: Record<
      GoXlrSampleBank,
      Record<
        GoXlrSampleButton,
        {
          function: GoXlrSamplePlaybackMode
          order: GoXlrSamplePlayOrder
          samples: Array<{ name: string; start_pct: number; stop_pct: number }>
          is_playing: boolean
          is_recording: boolean
        }
      >
    >
  } | null
  settings: {
    display: {
      gate: GoXlrDisplayMode
      compressor: GoXlrDisplayMode
      equaliser: GoXlrDisplayMode
      equaliser_fine: GoXlrDisplayMode
    }
    mute_hold_duration: number
    vc_mute_also_mute_cm: boolean
    enable_monitor_with_fx: boolean
    reset_sampler_on_clear: boolean
    lock_faders: boolean
    fade_duration: number
    vod_mode: string
  }
}
