import { useEffect, useMemo, useState } from 'react'
import type {
  GoXlrAnimationMode,
  GoXlrAppState,
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
  GoXlrMix,
  GoXlrMegaphoneStyle,
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
  GoXlrWaterfallDirection,
  MixerStatus
} from '../../main/goxlrTypes'

const FALLBACK_STATE: GoXlrAppState = {
  daemon: {
    running: false,
    source: null,
    startedByApp: false,
    endpoint: 'http://127.0.0.1:14564',
    lastError: null
  },
  status: null
}

const CHANNEL_ORDER: GoXlrChannelName[] = [
  'Headphones',
  'Mic',
  'Chat',
  'Music',
  'Game',
  'Console',
  'LineIn',
  'System',
  'Sample'
]

const FADER_ORDER: GoXlrFaderName[] = ['A', 'B', 'C', 'D']
const FADER_CHANNEL_OPTIONS: GoXlrChannelName[] = [
  'Mic',
  'LineIn',
  'Console',
  'System',
  'Game',
  'Chat',
  'Sample',
  'Music',
  'Headphones'
]
const INPUT_OPTIONS: GoXlrInputDevice[] = [
  'Microphone',
  'Chat',
  'Music',
  'Game',
  'Console',
  'LineIn',
  'System',
  'Samples'
]
const OUTPUT_OPTIONS: GoXlrOutputDevice[] = [
  'Headphones',
  'BroadcastMix',
  'ChatMic',
  'Sampler',
  'LineOut',
  'StreamMix2'
]
const MIC_TYPES: GoXlrMicrophoneType[] = ['Dynamic', 'Condenser', 'Jack']
const PATH_OPTIONS: GoXlrPathType[] = ['Profiles', 'MicProfiles', 'Presets', 'Samples', 'Icons', 'Logs']
const SUBMIX_CHANNELS = ['Mic', 'LineIn', 'Console', 'System', 'Game', 'Chat', 'Sample', 'Music'] as const
const MIX_OPTIONS: GoXlrMix[] = ['A', 'B']
const VOD_OPTIONS: GoXlrVodMode[] = ['Routable', 'StreamNoMusic']
const GATE_TIMES: GoXlrGateTime[] = [
  'Gate10ms',
  'Gate20ms',
  'Gate30ms',
  'Gate40ms',
  'Gate50ms',
  'Gate60ms',
  'Gate70ms',
  'Gate80ms',
  'Gate90ms',
  'Gate100ms',
  'Gate110ms',
  'Gate120ms',
  'Gate130ms',
  'Gate140ms',
  'Gate150ms',
  'Gate160ms',
  'Gate170ms',
  'Gate180ms',
  'Gate190ms',
  'Gate200ms',
  'Gate250ms',
  'Gate300ms',
  'Gate350ms',
  'Gate400ms',
  'Gate450ms',
  'Gate500ms',
  'Gate550ms',
  'Gate600ms',
  'Gate650ms',
  'Gate700ms',
  'Gate750ms',
  'Gate800ms',
  'Gate850ms',
  'Gate900ms',
  'Gate950ms',
  'Gate1000ms',
  'Gate1100ms',
  'Gate1200ms',
  'Gate1300ms',
  'Gate1400ms',
  'Gate1500ms',
  'Gate1600ms',
  'Gate1700ms',
  'Gate1800ms',
  'Gate1900ms',
  'Gate2000ms'
]
const COMPRESSOR_RATIOS: GoXlrCompressorRatio[] = [
  'Ratio1_0',
  'Ratio1_1',
  'Ratio1_2',
  'Ratio1_4',
  'Ratio1_6',
  'Ratio1_8',
  'Ratio2_0',
  'Ratio2_5',
  'Ratio3_2',
  'Ratio4_0',
  'Ratio5_6',
  'Ratio8_0',
  'Ratio16_0',
  'Ratio32_0',
  'Ratio64_0'
]
const COMPRESSOR_ATTACK_TIMES: GoXlrCompressorAttackTime[] = [
  'Comp0ms',
  'Comp2ms',
  'Comp3ms',
  'Comp4ms',
  'Comp5ms',
  'Comp6ms',
  'Comp7ms',
  'Comp8ms',
  'Comp9ms',
  'Comp10ms',
  'Comp12ms',
  'Comp14ms',
  'Comp16ms',
  'Comp18ms',
  'Comp20ms',
  'Comp23ms',
  'Comp26ms',
  'Comp30ms',
  'Comp35ms',
  'Comp40ms'
]
const COMPRESSOR_RELEASE_TIMES: GoXlrCompressorReleaseTime[] = [
  'Comp0ms',
  'Comp15ms',
  'Comp25ms',
  'Comp35ms',
  'Comp45ms',
  'Comp55ms',
  'Comp65ms',
  'Comp75ms',
  'Comp85ms',
  'Comp100ms',
  'Comp115ms',
  'Comp140ms',
  'Comp170ms',
  'Comp230ms',
  'Comp340ms',
  'Comp680ms',
  'Comp1000ms',
  'Comp1500ms',
  'Comp2000ms',
  'Comp3000ms'
]
const DISPLAY_MODES: GoXlrDisplayMode[] = ['Simple', 'Advanced']
const MINI_EQ_FREQUENCIES: GoXlrMiniEqFrequency[] = [
  'Equalizer90Hz',
  'Equalizer250Hz',
  'Equalizer500Hz',
  'Equalizer1KHz',
  'Equalizer3KHz',
  'Equalizer8KHz'
]
const EQ_FREQUENCIES: GoXlrEqFrequency[] = [
  'Equalizer31Hz',
  'Equalizer63Hz',
  'Equalizer125Hz',
  'Equalizer250Hz',
  'Equalizer500Hz',
  'Equalizer1KHz',
  'Equalizer2KHz',
  'Equalizer4KHz',
  'Equalizer8KHz',
  'Equalizer16KHz'
]
const EFFECT_PRESETS: GoXlrEffectPreset[] = ['Preset1', 'Preset2', 'Preset3', 'Preset4', 'Preset5', 'Preset6']
const REVERB_STYLES: GoXlrReverbStyle[] = [
  'Library',
  'DarkBloom',
  'MusicClub',
  'RealPlate',
  'Chapel',
  'HockeyArena'
]
const ECHO_STYLES: GoXlrEchoStyle[] = [
  'Quarter',
  'Eighth',
  'Triplet',
  'PingPong',
  'ClassicSlap',
  'MultiTap'
]
const PITCH_STYLES: GoXlrPitchStyle[] = ['Narrow', 'Wide']
const GENDER_STYLES: GoXlrGenderStyle[] = ['Narrow', 'Medium', 'Wide']
const MEGAPHONE_STYLES: GoXlrMegaphoneStyle[] = [
  'Megaphone',
  'Radio',
  'OnThePhone',
  'Overdrive',
  'BuzzCutt',
  'Tweed'
]
const ROBOT_STYLES: GoXlrRobotStyle[] = ['Robot1', 'Robot2', 'Robot3']
const HARD_TUNE_STYLES: GoXlrHardTuneStyle[] = ['Natural', 'Medium', 'Hard']
const HARD_TUNE_SOURCES: GoXlrHardTuneSource[] = ['All', 'Music', 'Game', 'LineIn', 'System']
const ANIMATION_MODES: GoXlrAnimationMode[] = [
  'RetroRainbow',
  'RainbowDark',
  'RainbowBright',
  'Simple',
  'Ripple',
  'None'
]
const WATERFALL_DIRECTIONS: GoXlrWaterfallDirection[] = ['Down', 'Up', 'Off']
const SIMPLE_COLOUR_TARGETS: GoXlrSimpleColourTarget[] = [
  'Global',
  'Accent',
  'Scribble1',
  'Scribble2',
  'Scribble3',
  'Scribble4'
]
const SAMPLE_BANKS: GoXlrSampleBank[] = ['A', 'B', 'C']
const SAMPLE_BUTTONS: GoXlrSampleButton[] = ['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight']
const SAMPLE_PLAYBACK_MODES: GoXlrSamplePlaybackMode[] = [
  'PlayNext',
  'PlayStop',
  'PlayFade',
  'StopOnRelease',
  'FadeOnRelease',
  'Loop'
]
const SAMPLE_PLAY_ORDERS: GoXlrSamplePlayOrder[] = ['Sequential', 'Random']
const TABS = [
  'Overview',
  'Faders',
  'Routing',
  'Mic',
  'Effects',
  'Submix',
  'Settings',
  'Profiles',
  'Lighting',
  'Sampler',
  'Diagnostics'
] as const

type AppTab = (typeof TABS)[number]

function formatDeviceLabel(serial: string, mixer: MixerStatus): string {
  return `${mixer.hardware.device_type} - ${serial}`
}

function classNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

function renderValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'n/a'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

function formatEqLabel(value: string): string {
  return value.replace('Equalizer', '')
}

function App(): JSX.Element {
  const [appState, setAppState] = useState<GoXlrAppState>(FALLBACK_STATE)
  const [selectedSerial, setSelectedSerial] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<AppTab>('Overview')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sampleDrafts, setSampleDrafts] = useState<Record<string, string>>({})
  const [profileDraftName, setProfileDraftName] = useState('')
  const [micProfileDraftName, setMicProfileDraftName] = useState('')

  const mixers = appState.status?.mixers ?? {}
  const serials = Object.keys(mixers)
  const selectedMixer = selectedSerial ? mixers[selectedSerial] : undefined

  const profileFiles = appState.status?.files.profiles ?? []
  const micProfileFiles = appState.status?.files.mic_profiles ?? []
  const presetFiles = appState.status?.files.presets ?? []
  const sampleLibraryEntries = Object.entries(appState.status?.files.samples ?? {})
  const iconFiles = appState.status?.files.icons ?? []
  const activeSamplerBank = selectedMixer?.sampler?.active_bank ?? 'A'

  const deviceFacts = useMemo(() => {
    if (!selectedMixer) {
      return []
    }

    return [
      ['Serial', selectedMixer.hardware.serial_number],
      ['Manufacturer', selectedMixer.hardware.usb_device.manufacturer_name],
      ['Product', selectedMixer.hardware.usb_device.product_name],
      ['Firmware profile', selectedMixer.profile_name],
      ['Mic profile', selectedMixer.mic_profile_name],
      ['Built on', selectedMixer.hardware.manufactured_date]
    ]
  }, [selectedMixer])

  useEffect(() => {
    void refresh()
  }, [])

  useEffect(() => {
    if (!selectedSerial && serials.length > 0) {
      setSelectedSerial(serials[0])
    }
    if (selectedSerial && !mixers[selectedSerial] && serials.length > 0) {
      setSelectedSerial(serials[0])
    }
  }, [mixers, selectedSerial, serials])

  useEffect(() => {
    if (!appState.daemon.running) {
      return
    }

    const timer = window.setInterval(() => {
      void refresh(true)
    }, 3000)

    return () => window.clearInterval(timer)
  }, [appState.daemon.running])

  async function refresh(silent = false): Promise<void> {
    try {
      const nextState = await window.goxlrApi.getAppState()
      setAppState(nextState)
      if (!silent) {
        setError(null)
      }
    } catch (refreshError) {
      const messageText = refreshError instanceof Error ? refreshError.message : 'Refresh failed'
      setError(messageText)
    }
  }

  async function runAction(
    action: () => Promise<GoXlrAppState>,
    successMessage?: string
  ): Promise<void> {
    setBusy(true)
    setError(null)
    try {
      const nextState = await action()
      setAppState(nextState)
      if (successMessage) {
        setMessage(successMessage)
        window.setTimeout(() => setMessage(null), 2200)
      }
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Action failed')
    } finally {
      setBusy(false)
    }
  }

  async function startDaemon(): Promise<void> {
    await runAction(() => window.goxlrApi.startDaemon(), 'Daemon started')
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Omega GoXLR</p>
          <h1>Desktop MVP</h1>
          <p className="muted">
            Electron shell with a reusable GoXLR daemon backend, now expanded into a real mixer control
            prototype.
          </p>
        </div>

        <div className="panel">
          <div className="panelHeader">
            <span>Daemon</span>
            <span className={appState.daemon.running ? 'status online' : 'status offline'}>
              {appState.daemon.running ? 'Online' : 'Offline'}
            </span>
          </div>
          <p className="muted small">Source: {appState.daemon.source ?? 'not started'}</p>
          <p className="muted small">Endpoint: {appState.daemon.endpoint}</p>
          {appState.status ? (
            <p className="muted small">
              Daemon version: {appState.status.config.daemon_version} on {appState.status.config.platform}
            </p>
          ) : null}
          {appState.daemon.lastError ? <p className="error">{appState.daemon.lastError}</p> : null}
          {error ? <p className="error">{error}</p> : null}
          {message ? <p className="success">{message}</p> : null}
          <div className="buttonRow">
            <button onClick={() => void startDaemon()} disabled={busy}>
              {busy ? 'Working...' : 'Start daemon'}
            </button>
            <button className="ghost" onClick={() => void refresh()} disabled={busy}>
              Refresh
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="panelHeader">
            <span>Devices</span>
            <span className="count">{serials.length}</span>
          </div>
          <div className="deviceList">
            {serials.length === 0 ? <p className="muted small">No mixers reported yet.</p> : null}
            {serials.map((serial) => (
              <button
                key={serial}
                className={classNames('device', serial === selectedSerial && 'active')}
                onClick={() => setSelectedSerial(serial)}
              >
                <strong>{formatDeviceLabel(serial, mixers[serial])}</strong>
                <span>{mixers[serial].profile_name || 'No profile loaded'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panelHeader">
            <span>Folders</span>
            <span className="muted small">Daemon managed</span>
          </div>
          <div className="folderGrid">
            {PATH_OPTIONS.map((pathType) => (
              <button
                key={pathType}
                className="ghost tileButton"
                disabled={busy}
                onClick={() => void window.goxlrApi.openPath(pathType)}
              >
                {pathType}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="workspace">
        <section className="hero panel">
          <div className="panelHeader">
            <span>Selected mixer</span>
            <span className="count">{selectedSerial ?? 'none'}</span>
          </div>
          {selectedMixer ? (
            <>
              <h2>{selectedMixer.hardware.device_type}</h2>
              <p className="muted">
                Profile: <strong>{selectedMixer.profile_name || 'Unknown'}</strong> | Mic profile:{' '}
                <strong>{selectedMixer.mic_profile_name || 'Unknown'}</strong>
              </p>
              <div className="factGrid">
                {deviceFacts.map(([label, value]) => (
                  <div key={label} className="factCard">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <div className="factGrid compactTop">
                <div className="factCard">
                  <span>Monitor output</span>
                  <strong>{selectedMixer.levels.output_monitor}</strong>
                </div>
                <div className="factCard">
                  <span>Submix</span>
                  <strong>{selectedMixer.levels.submix_supported ? 'Supported' : 'Not supported'}</strong>
                </div>
                <div className="factCard">
                  <span>Driver</span>
                  <strong>{appState.status?.config.driver_interface?.interface ?? 'Unknown'}</strong>
                </div>
              </div>
            </>
          ) : (
            <p className="muted">Start the daemon and select a GoXLR device to inspect live status.</p>
          )}
        </section>

        <section className="tabBar">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={classNames('tabButton', selectedTab === tab && 'active')}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </section>

        {!selectedMixer ? (
          <section className="panel">
            <p className="muted">No mixer selected.</p>
          </section>
        ) : null}

        {selectedMixer && selectedTab === 'Overview' ? (
          <section className="panel">
            <div className="panelHeader">
              <span>Channel levels</span>
              <span className="muted small">Live daemon-backed control</span>
            </div>
            <div className="quickControlGrid">
              <label className="sliderCard">
                <span>Monitor output</span>
                <select
                  value={selectedMixer.levels.output_monitor}
                  disabled={busy || !selectedSerial}
                  onChange={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () =>
                        window.goxlrApi.setMonitorMix(
                          selectedSerial,
                          event.target.value as GoXlrOutputDevice
                        ),
                      'Monitor output updated'
                    )
                  }}
                >
                  {OUTPUT_OPTIONS.map((output) => (
                    <option key={output} value={output}>
                      {output}
                    </option>
                  ))}
                </select>
              </label>

              <label className="sliderCard">
                <div className="sliderHeader">
                  <span>Bleep level</span>
                  <strong>{selectedMixer.levels.bleep}</strong>
                </div>
                <input
                  type="range"
                  min={-36}
                  max={0}
                  value={selectedMixer.levels.bleep}
                  disabled={busy || !selectedSerial}
                  onMouseUp={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () => window.goxlrApi.setBleepLevel(selectedSerial, Number((event.target as HTMLInputElement).value)),
                      'Bleep level updated'
                    )
                  }}
                  onTouchEnd={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () => window.goxlrApi.setBleepLevel(selectedSerial, Number((event.target as HTMLInputElement).value)),
                      'Bleep level updated'
                    )
                  }}
                />
              </label>

              <label className="sliderCard">
                <div className="sliderHeader">
                  <span>De-esser</span>
                  <strong>{selectedMixer.levels.deess}</strong>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={selectedMixer.levels.deess}
                  disabled={busy || !selectedSerial}
                  onMouseUp={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () => window.goxlrApi.setDeEsser(selectedSerial, Number((event.target as HTMLInputElement).value)),
                      'De-esser updated'
                    )
                  }}
                  onTouchEnd={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () => window.goxlrApi.setDeEsser(selectedSerial, Number((event.target as HTMLInputElement).value)),
                      'De-esser updated'
                    )
                  }}
                />
              </label>
            </div>
            <div className="grid">
              {CHANNEL_ORDER.filter((channel) => selectedMixer.levels.volumes[channel] !== undefined).map(
                (channel) => (
                  <label className="sliderCard" key={channel}>
                    <div className="sliderHeader">
                      <span>{channel}</span>
                      <strong>{selectedMixer.levels.volumes[channel]}</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={selectedMixer.levels.volumes[channel]}
                      onChange={(event) => {
                        const nextVolume = Number(event.target.value)
                        setAppState((current) => {
                          if (!selectedSerial || !current.status?.mixers[selectedSerial]) {
                            return current
                          }

                          return {
                            ...current,
                            status: {
                              ...current.status,
                              mixers: {
                                ...current.status.mixers,
                                [selectedSerial]: {
                                  ...current.status.mixers[selectedSerial],
                                  levels: {
                                    ...current.status.mixers[selectedSerial].levels,
                                    volumes: {
                                      ...current.status.mixers[selectedSerial].levels.volumes,
                                      [channel]: nextVolume
                                    }
                                  }
                                }
                              }
                            }
                          }
                        })
                      }}
                      onMouseUp={(event) => {
                        if (!selectedSerial) {
                          return
                        }
                        void runAction(
                          () =>
                            window.goxlrApi.setVolume(
                              selectedSerial,
                              channel,
                              Number((event.target as HTMLInputElement).value)
                            ),
                          `${channel} volume updated`
                        )
                      }}
                      onTouchEnd={(event) => {
                        if (!selectedSerial) {
                          return
                        }
                        void runAction(
                          () =>
                            window.goxlrApi.setVolume(
                              selectedSerial,
                              channel,
                              Number((event.target as HTMLInputElement).value)
                            ),
                          `${channel} volume updated`
                        )
                      }}
                    />
                  </label>
                )
              )}
            </div>
          </section>
        ) : null}

        {selectedMixer && selectedTab === 'Faders' ? (
          <section className="panel">
            <div className="panelHeader">
              <span>Fader assignment</span>
              <span className="muted small">Route channels and configure scribble strips</span>
            </div>
            <div className="stack">
              {FADER_ORDER.map((fader) => (
                <div key={fader} className="profileCard">
                  <div className="formRow">
                    <div>
                      <strong>Fader {fader}</strong>
                      <p className="muted small">
                        Mute: {selectedMixer.fader_status[fader].mute_type} | State:{' '}
                        {selectedMixer.fader_status[fader].mute_state}
                      </p>
                    </div>
                    <select
                      value={selectedMixer.fader_status[fader].channel}
                      disabled={busy || !selectedSerial}
                      onChange={(event) => {
                        if (!selectedSerial) {
                          return
                        }
                        void runAction(
                          () =>
                            window.goxlrApi.setFader(
                              selectedSerial,
                              fader,
                              event.target.value as GoXlrChannelName
                            ),
                          `Fader ${fader} updated`
                        )
                      }}
                    >
                      {FADER_CHANNEL_OPTIONS.map((channel) => (
                        <option key={channel} value={channel}>
                          {channel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="scribbleGrid">
                    <label>
                      <span className="muted small">Icon</span>
                      <select
                        value={selectedMixer.fader_status[fader].scribble?.file_name ?? ''}
                        disabled={busy || !selectedSerial}
                        onChange={(event) => {
                          if (!selectedSerial) return
                          const nextValue = event.target.value || null
                          void runAction(
                            () => window.goxlrApi.setScribbleIcon(selectedSerial, fader, nextValue),
                            `Fader ${fader} icon updated`
                          )
                        }}
                      >
                        <option value="">No icon</option>
                        {iconFiles.map((iconFile) => (
                          <option key={iconFile} value={iconFile}>
                            {iconFile}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="muted small">Bottom text</span>
                      <input
                        type="text"
                        defaultValue={selectedMixer.fader_status[fader].scribble?.bottom_text ?? ''}
                        disabled={busy || !selectedSerial}
                        onBlur={(event) => {
                          if (!selectedSerial) return
                          void runAction(
                            () =>
                              window.goxlrApi.setScribbleText(
                                selectedSerial,
                                fader,
                                (event.target as HTMLInputElement).value
                              ),
                            `Fader ${fader} text updated`
                          )
                        }}
                      />
                    </label>
                    <label>
                      <span className="muted small">Left text</span>
                      <input
                        type="text"
                        defaultValue={selectedMixer.fader_status[fader].scribble?.left_text ?? ''}
                        disabled={busy || !selectedSerial}
                        onBlur={(event) => {
                          if (!selectedSerial) return
                          void runAction(
                            () =>
                              window.goxlrApi.setScribbleNumber(
                                selectedSerial,
                                fader,
                                (event.target as HTMLInputElement).value
                              ),
                            `Fader ${fader} side text updated`
                          )
                        }}
                      />
                    </label>
                    <label className="inlineToggle">
                      <span>Invert</span>
                      <input
                        type="checkbox"
                        checked={selectedMixer.fader_status[fader].scribble?.inverted ?? false}
                        disabled={busy || !selectedSerial}
                        onChange={(event) => {
                          if (!selectedSerial) return
                          void runAction(
                            () =>
                              window.goxlrApi.setScribbleInvert(
                                selectedSerial,
                                fader,
                                event.target.checked
                              ),
                            `Fader ${fader} invert updated`
                          )
                        }}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {selectedMixer && selectedTab === 'Routing' ? (
          <section className="panel">
            <div className="panelHeader">
              <span>Routing matrix</span>
              <span className="muted small">Input to output monitor map</span>
            </div>
            <div className="routingTableWrap">
              <table className="routingTable">
                <thead>
                  <tr>
                    <th>Input</th>
                    {OUTPUT_OPTIONS.map((output) => (
                      <th key={output}>{output}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {INPUT_OPTIONS.map((input) => (
                    <tr key={input}>
                      <td>{input}</td>
                      {OUTPUT_OPTIONS.map((output) => (
                        <td key={`${input}-${output}`}>
                          <input
                            type="checkbox"
                            checked={Boolean(selectedMixer.router[input]?.[output])}
                            disabled={busy || !selectedSerial}
                            onChange={(event) => {
                              if (!selectedSerial) {
                                return
                              }
                              void runAction(
                                () =>
                                  window.goxlrApi.setRouter(
                                    selectedSerial,
                                    input,
                                    output,
                                    event.target.checked
                                  ),
                                `${input} → ${output} updated`
                              )
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {selectedMixer && selectedTab === 'Mic' ? (
          <section className="panel">
            <div className="panelHeader">
              <span>Mic setup</span>
              <span className="muted small">Type, gain, gate and compressor control</span>
            </div>
            <div className="micGrid">
              <label className="micCard">
                <span>Mic type</span>
                <select
                  value={selectedMixer.mic_status.mic_type}
                  disabled={busy || !selectedSerial}
                  onChange={(event) => {
                    if (!selectedSerial) {
                      return
                    }
                    void runAction(
                      () =>
                        window.goxlrApi.setMicType(
                          selectedSerial,
                          event.target.value as GoXlrMicrophoneType
                        ),
                      'Microphone type updated'
                    )
                  }}
                >
                  {MIC_TYPES.map((micType) => (
                    <option key={micType} value={micType}>
                      {micType}
                    </option>
                  ))}
                </select>
              </label>

              {MIC_TYPES.map((micType) => (
                <label className="micCard" key={micType}>
                  <div className="sliderHeader">
                    <span>{micType} gain</span>
                    <strong>{selectedMixer.mic_status.mic_gains[micType]}</strong>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={72}
                    value={selectedMixer.mic_status.mic_gains[micType]}
                    disabled={busy || !selectedSerial}
                    onChange={(event) => {
                      const nextGain = Number(event.target.value)
                      setAppState((current) => {
                        if (!selectedSerial || !current.status?.mixers[selectedSerial]) {
                          return current
                        }

                        return {
                          ...current,
                          status: {
                            ...current.status,
                            mixers: {
                              ...current.status.mixers,
                              [selectedSerial]: {
                                ...current.status.mixers[selectedSerial],
                                mic_status: {
                                  ...current.status.mixers[selectedSerial].mic_status,
                                  mic_gains: {
                                    ...current.status.mixers[selectedSerial].mic_status.mic_gains,
                                    [micType]: nextGain
                                  }
                                }
                              }
                            }
                          }
                        }
                      })
                    }}
                    onMouseUp={(event) => {
                      if (!selectedSerial) {
                        return
                      }
                      void runAction(
                        () =>
                          window.goxlrApi.setMicGain(
                            selectedSerial,
                            micType,
                            Number((event.target as HTMLInputElement).value)
                          ),
                        `${micType} gain updated`
                      )
                    }}
                    onTouchEnd={(event) => {
                      if (!selectedSerial) {
                        return
                      }
                      void runAction(
                        () =>
                          window.goxlrApi.setMicGain(
                            selectedSerial,
                            micType,
                            Number((event.target as HTMLInputElement).value)
                          ),
                        `${micType} gain updated`
                      )
                    }}
                  />
                </label>
              ))}

              <div className="micCard">
                <div className="panelHeader">
                  <span>Gate</span>
                  <label className="inlineToggle">
                    <span>{selectedMixer.mic_status.noise_gate.enabled ? 'On' : 'Off'}</span>
                    <input
                      type="checkbox"
                      checked={selectedMixer.mic_status.noise_gate.enabled}
                      disabled={busy || !selectedSerial}
                      onChange={(event) => {
                        if (!selectedSerial) return
                        void runAction(
                          () => window.goxlrApi.setGateActive(selectedSerial, event.target.checked),
                          'Gate state updated'
                        )
                      }}
                    />
                  </label>
                </div>
                <label className="sliderCard">
                  <div className="sliderHeader">
                    <span>Threshold</span>
                    <strong>{selectedMixer.mic_status.noise_gate.threshold}</strong>
                  </div>
                  <input
                    type="range"
                    min={-59}
                    max={0}
                    value={selectedMixer.mic_status.noise_gate.threshold}
                    disabled={busy || !selectedSerial}
                    onMouseUp={(event) => {
                      if (!selectedSerial) return
                      void runAction(
                        () =>
                          window.goxlrApi.setGateThreshold(
                            selectedSerial,
                            Number((event.target as HTMLInputElement).value)
                          ),
                        'Gate threshold updated'
                      )
                    }}
                  />
                </label>
                <label className="sliderCard">
                  <div className="sliderHeader">
                    <span>Attenuation</span>
                    <strong>{selectedMixer.mic_status.noise_gate.attenuation}</strong>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={selectedMixer.mic_status.noise_gate.attenuation}
                    disabled={busy || !selectedSerial}
                    onMouseUp={(event) => {
                      if (!selectedSerial) return
                      void runAction(
                        () =>
                          window.goxlrApi.setGateAttenuation(
                            selectedSerial,
                            Number((event.target as HTMLInputElement).value)
                          ),
                        'Gate attenuation updated'
                      )
                    }}
                  />
                </label>
                <label>
                  <span className="muted small">Attack</span>
                  <select
                    value={selectedMixer.mic_status.noise_gate.attack}
                    disabled={busy || !selectedSerial}
                    onChange={(event) => {
                      if (!selectedSerial) return
                      void runAction(
                        () =>
                          window.goxlrApi.setGateAttack(
                            selectedSerial,
                            event.target.value as GoXlrGateTime
                          ),
                        'Gate attack updated'
                      )
                    }}
                  >
                    {GATE_TIMES.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="muted small">Release</span>
                  <select
                    value={selectedMixer.mic_status.noise_gate.release}
                    disabled={busy || !selectedSerial}
                    onChange={(event) => {
                      if (!selectedSerial) return
                      void runAction(
                        () =>
                          window.goxlrApi.setGateRelease(
                            selectedSerial,
                            event.target.value as GoXlrGateTime
                          ),
                        'Gate release updated'
                      )
                    }}
                  >
                    {GATE_TIMES.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="micCard">
                <div className="panelHeader">
                  <span>Compressor</span>
                  <strong>{selectedMixer.mic_status.compressor.ratio}</strong>
                </div>
                <label className="sliderCard">
                  <div className="sliderHeader">
                    <span>Threshold</span>
                    <strong>{selectedMixer.mic_status.compressor.threshold}</strong>
                  </div>
                  <input
                    type="range"
                    min={-40}
                    max={0}
                    value={selectedMixer.mic_status.compressor.threshold}
                    disabled={busy || !selectedSerial}
                    onMouseUp={(event) => {
                      if (!selectedSerial) return
                      void runAction(
                        () =>
                          window.goxlrApi.setCompressorThreshold(
                            selectedSerial,
                            Number((event.target as HTMLInputElement).value)
                          ),
                        'Compressor threshold updated'
                      )
                    }}
                  />
                </label>
                <label className="sliderCard">
                  <div className="sliderHeader">
                    <span>Makeup gain</span>
                    <strong>{selectedMixer.mic_status.compressor.makeup_gain}</strong>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    value={selectedMixer.mic_status.compressor.makeup_gain}
                    disabled={busy || !selectedSerial}
                    onMouseUp={(event) => {
                      if (!selectedSerial) return
                      void runAction(
                        () =>
                          window.goxlrApi.setCompressorMakeupGain(
                            selectedSerial,
                            Number((event.target as HTMLInputElement).value)
                          ),
                        'Compressor makeup gain updated'
                      )
                    }}
                  />
                </label>
                <label>
                  <span className="muted small">Ratio</span>
                  <select
                    value={selectedMixer.mic_status.compressor.ratio}
                    disabled={busy || !selectedSerial}
                    onChange={(event) => {
                      if (!selectedSerial) return
                      void runAction(
                        () =>
                          window.goxlrApi.setCompressorRatio(
                            selectedSerial,
                            event.target.value as GoXlrCompressorRatio
                          ),
                        'Compressor ratio updated'
                      )
                    }}
                  >
                    {COMPRESSOR_RATIOS.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="muted small">Attack</span>
                  <select
                    value={selectedMixer.mic_status.compressor.attack}
                    disabled={busy || !selectedSerial}
                    onChange={(event) => {
                      if (!selectedSerial) return
                      void runAction(
                        () =>
                          window.goxlrApi.setCompressorAttack(
                            selectedSerial,
                            event.target.value as GoXlrCompressorAttackTime
                          ),
                        'Compressor attack updated'
                      )
                    }}
                  >
                    {COMPRESSOR_ATTACK_TIMES.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="muted small">Release</span>
                  <select
                    value={selectedMixer.mic_status.compressor.release}
                    disabled={busy || !selectedSerial}
                    onChange={(event) => {
                      if (!selectedSerial) return
                      void runAction(
                        () =>
                          window.goxlrApi.setCompressorRelease(
                            selectedSerial,
                            event.target.value as GoXlrCompressorReleaseTime
                          ),
                        'Compressor release updated'
                      )
                    }}
                  >
                    {COMPRESSOR_RELEASE_TIMES.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="micCard">
                <div className="panelHeader">
                  <span>EQ mini</span>
                  <span className="muted small">Compact six-band control</span>
                </div>
                <div className="stack compact">
                  {MINI_EQ_FREQUENCIES.map((frequency) => (
                    <div key={frequency} className="sampleEditor">
                      <div className="sampleRow">
                        <strong>{formatEqLabel(frequency)}</strong>
                        <span>
                          Gain {selectedMixer.mic_status.equaliser_mini.gain[frequency]} | Freq{' '}
                          {selectedMixer.mic_status.equaliser_mini.frequency[frequency]}
                        </span>
                      </div>
                      <div className="sampleTrimGrid">
                        <label>
                          <span className="muted small">Gain</span>
                          <input
                            type="range"
                            min={-9}
                            max={9}
                            value={selectedMixer.mic_status.equaliser_mini.gain[frequency]}
                            disabled={busy || !selectedSerial}
                            onMouseUp={(event) => {
                              if (!selectedSerial) return
                              void runAction(
                                () =>
                                  window.goxlrApi.setEqMiniGain(
                                    selectedSerial,
                                    frequency,
                                    Number((event.target as HTMLInputElement).value)
                                  ),
                                `${formatEqLabel(frequency)} mini gain updated`
                              )
                            }}
                          />
                        </label>
                        <label>
                          <span className="muted small">Frequency</span>
                          <input
                            type="number"
                            step={0.1}
                            defaultValue={selectedMixer.mic_status.equaliser_mini.frequency[frequency]}
                            disabled={busy || !selectedSerial}
                            onBlur={(event) => {
                              if (!selectedSerial) return
                              void runAction(
                                () =>
                                  window.goxlrApi.setEqMiniFreq(
                                    selectedSerial,
                                    frequency,
                                    Number((event.target as HTMLInputElement).value)
                                  ),
                                `${formatEqLabel(frequency)} mini frequency updated`
                              )
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="micCard">
                <div className="panelHeader">
                  <span>EQ full</span>
                  <span className="muted small">Ten-band detailed control</span>
                </div>
                <div className="stack compact">
                  {EQ_FREQUENCIES.map((frequency) => (
                    <div key={frequency} className="sampleEditor">
                      <div className="sampleRow">
                        <strong>{formatEqLabel(frequency)}</strong>
                        <span>
                          Gain {selectedMixer.mic_status.equaliser.gain[frequency]} | Freq{' '}
                          {selectedMixer.mic_status.equaliser.frequency[frequency]}
                        </span>
                      </div>
                      <div className="sampleTrimGrid">
                        <label>
                          <span className="muted small">Gain</span>
                          <input
                            type="range"
                            min={-9}
                            max={9}
                            value={selectedMixer.mic_status.equaliser.gain[frequency]}
                            disabled={busy || !selectedSerial}
                            onMouseUp={(event) => {
                              if (!selectedSerial) return
                              void runAction(
                                () =>
                                  window.goxlrApi.setEqGain(
                                    selectedSerial,
                                    frequency,
                                    Number((event.target as HTMLInputElement).value)
                                  ),
                                `${formatEqLabel(frequency)} gain updated`
                              )
                            }}
                          />
                        </label>
                        <label>
                          <span className="muted small">Frequency</span>
                          <input
                            type="number"
                            step={0.1}
                            defaultValue={selectedMixer.mic_status.equaliser.frequency[frequency]}
                            disabled={busy || !selectedSerial}
                            onBlur={(event) => {
                              if (!selectedSerial) return
                              void runAction(
                                () =>
                                  window.goxlrApi.setEqFreq(
                                    selectedSerial,
                                    frequency,
                                    Number((event.target as HTMLInputElement).value)
                                  ),
                                `${formatEqLabel(frequency)} frequency updated`
                              )
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {selectedMixer && selectedTab === 'Profiles' ? (
          <section className="panel">
            <div className="panelHeader">
              <span>Profiles</span>
              <span className="muted small">Current files exposed by the daemon</span>
            </div>
            <div className="profileGrid">
              <div className="profileCard">
                <div className="panelHeader">
                  <span>Main profile</span>
                  <button
                    className="ghost tileButton"
                    disabled={busy || !selectedSerial}
                    onClick={() => {
                      if (!selectedSerial) {
                        return
                      }
                      void runAction(() => window.goxlrApi.saveProfile(selectedSerial), 'Profile saved')
                    }}
                  >
                    Save current
                  </button>
                </div>
                <select
                  value={selectedMixer.profile_name}
                  disabled={busy || !selectedSerial}
                  onChange={(event) => {
                    if (!selectedSerial) {
                      return
                    }
                    void runAction(
                      () => window.goxlrApi.loadProfile(selectedSerial, event.target.value),
                      'Profile loaded'
                    )
                  }}
                >
                  {profileFiles.map((profileName) => (
                    <option key={profileName} value={profileName}>
                      {profileName}
                    </option>
                  ))}
                </select>
                <div className="buttonRow tight">
                  <input
                    type="text"
                    placeholder="New profile name"
                    value={profileDraftName}
                    onChange={(event) => setProfileDraftName(event.target.value)}
                    disabled={busy || !selectedSerial}
                  />
                  <button
                    disabled={busy || !selectedSerial || !profileDraftName.trim()}
                    onClick={() => {
                      if (!selectedSerial || !profileDraftName.trim()) return
                      void runAction(
                        () => window.goxlrApi.saveProfileAs(selectedSerial, profileDraftName.trim()),
                        'Profile saved as new file'
                      ).then(() => setProfileDraftName(''))
                    }}
                  >
                    Save as
                  </button>
                </div>
                <button
                  className="ghost"
                  disabled={busy || !selectedSerial || selectedMixer.profile_name === ''}
                  onClick={() => {
                    if (!selectedSerial) return
                    void runAction(
                      () => window.goxlrApi.deleteProfile(selectedSerial, selectedMixer.profile_name),
                      'Profile deleted'
                    )
                  }}
                >
                  Delete selected
                </button>
              </div>

              <div className="profileCard">
                <div className="panelHeader">
                  <span>Mic profile</span>
                  <button
                    className="ghost tileButton"
                    disabled={busy || !selectedSerial}
                    onClick={() => {
                      if (!selectedSerial) {
                        return
                      }
                      void runAction(
                        () => window.goxlrApi.saveMicProfile(selectedSerial),
                        'Mic profile saved'
                      )
                    }}
                  >
                    Save current
                  </button>
                </div>
                <select
                  value={selectedMixer.mic_profile_name}
                  disabled={busy || !selectedSerial}
                  onChange={(event) => {
                    if (!selectedSerial) {
                      return
                    }
                    void runAction(
                      () => window.goxlrApi.loadMicProfile(selectedSerial, event.target.value),
                      'Mic profile loaded'
                    )
                  }}
                >
                  {micProfileFiles.map((profileName) => (
                    <option key={profileName} value={profileName}>
                      {profileName}
                    </option>
                  ))}
                </select>
                <div className="buttonRow tight">
                  <input
                    type="text"
                    placeholder="New mic profile name"
                    value={micProfileDraftName}
                    onChange={(event) => setMicProfileDraftName(event.target.value)}
                    disabled={busy || !selectedSerial}
                  />
                  <button
                    disabled={busy || !selectedSerial || !micProfileDraftName.trim()}
                    onClick={() => {
                      if (!selectedSerial || !micProfileDraftName.trim()) return
                      void runAction(
                        () =>
                          window.goxlrApi.saveMicProfileAs(
                            selectedSerial,
                            micProfileDraftName.trim()
                          ),
                        'Mic profile saved as new file'
                      ).then(() => setMicProfileDraftName(''))
                    }}
                  >
                    Save as
                  </button>
                </div>
                <button
                  className="ghost"
                  disabled={busy || !selectedSerial || selectedMixer.mic_profile_name === ''}
                  onClick={() => {
                    if (!selectedSerial) return
                    void runAction(
                      () => window.goxlrApi.deleteMicProfile(selectedSerial, selectedMixer.mic_profile_name),
                      'Mic profile deleted'
                    )
                  }}
                >
                  Delete selected
                </button>
              </div>

              <div className="profileCard">
                <span>Directories</span>
                <div className="stack compact">
                  <button className="ghost tileButton" onClick={() => void window.goxlrApi.openPath('Profiles')}>
                    Open profiles folder
                  </button>
                  <button
                    className="ghost tileButton"
                    onClick={() => void window.goxlrApi.openPath('MicProfiles')}
                  >
                    Open mic profiles folder
                  </button>
                  <button className="ghost tileButton" onClick={() => void window.goxlrApi.openPath('Logs')}>
                    Open logs folder
                  </button>
                </div>
              </div>

              <div className="profileCard">
                <div className="panelHeader">
                  <span>Effect preset</span>
                  <button
                    className="ghost tileButton"
                    disabled={busy || !selectedSerial}
                    onClick={() => {
                      if (!selectedSerial) return
                      void runAction(() => window.goxlrApi.saveEffectPreset(selectedSerial), 'Effect preset saved')
                    }}
                  >
                    Save active
                  </button>
                </div>
                <select
                  defaultValue={EFFECT_PRESETS[0]}
                  disabled={busy || !selectedSerial}
                  onChange={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () =>
                        window.goxlrApi.setEffectPreset(
                          selectedSerial,
                          event.target.value as GoXlrEffectPreset
                        ),
                      'Effect preset switched'
                    )
                  }}
                >
                  {EFFECT_PRESETS.map((preset) => (
                    <option key={preset} value={preset}>
                      {preset}
                    </option>
                  ))}
                </select>
                <p className="muted small">Preset files available: {presetFiles.length}</p>
              </div>
            </div>
          </section>
        ) : null}

        {selectedMixer && selectedTab === 'Effects' ? (
          <section className="panel">
            <div className="panelHeader">
              <span>Effects</span>
              <span className="muted small">Realtime voice processing and character controls</span>
            </div>

            {selectedMixer.effects ? (
              <>
                <div className="submixHeader">
                  <label className="toggleCard">
                    <span>FX enabled</span>
                    <input
                      type="checkbox"
                      checked={selectedMixer.effects.is_enabled}
                      disabled={busy || !selectedSerial}
                      onChange={(event) => {
                        if (!selectedSerial) return
                        void runAction(
                          () => window.goxlrApi.setFxEnabled(selectedSerial, event.target.checked),
                          'FX engine updated'
                        )
                      }}
                    />
                  </label>
                  <label className="toggleCard">
                    <span>Megaphone</span>
                    <input
                      type="checkbox"
                      checked={selectedMixer.effects.current.megaphone.is_enabled}
                      disabled={busy || !selectedSerial}
                      onChange={(event) => {
                        if (!selectedSerial) return
                        void runAction(
                          () => window.goxlrApi.setMegaphoneEnabled(selectedSerial, event.target.checked),
                          'Megaphone updated'
                        )
                      }}
                    />
                  </label>
                  <label className="toggleCard">
                    <span>Robot</span>
                    <input
                      type="checkbox"
                      checked={selectedMixer.effects.current.robot.is_enabled}
                      disabled={busy || !selectedSerial}
                      onChange={(event) => {
                        if (!selectedSerial) return
                        void runAction(
                          () => window.goxlrApi.setRobotEnabled(selectedSerial, event.target.checked),
                          'Robot updated'
                        )
                      }}
                    />
                  </label>
                  <label className="toggleCard">
                    <span>Hard tune</span>
                    <input
                      type="checkbox"
                      checked={selectedMixer.effects.current.hard_tune.is_enabled}
                      disabled={busy || !selectedSerial}
                      onChange={(event) => {
                        if (!selectedSerial) return
                        void runAction(
                          () => window.goxlrApi.setHardTuneEnabled(selectedSerial, event.target.checked),
                          'Hard tune updated'
                        )
                      }}
                    />
                  </label>
                </div>

                <div className="profileGrid">
                  <div className="profileCard">
                    <div className="panelHeader">
                      <span>Reverb</span>
                      <span className="muted small">Raw {selectedMixer.effects.current.reverb.raw_encoder}</span>
                    </div>
                    <div className="stack compact">
                      <select
                        value={selectedMixer.effects.current.reverb.style}
                        disabled={busy || !selectedSerial}
                        onChange={(event) => {
                          if (!selectedSerial) return
                          void runAction(
                            () =>
                              window.goxlrApi.setReverbStyle(
                                selectedSerial,
                                event.target.value as GoXlrReverbStyle
                              ),
                            'Reverb style updated'
                          )
                        }}
                      >
                        {REVERB_STYLES.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                      <label className="sliderCard">
                        <div className="sliderHeader">
                          <span>Amount</span>
                          <strong>{selectedMixer.effects.current.reverb.amount}</strong>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={selectedMixer.effects.current.reverb.amount}
                          disabled={busy || !selectedSerial}
                          onMouseUp={(event) => {
                            if (!selectedSerial) return
                            void runAction(
                              () =>
                                window.goxlrApi.setReverbAmount(
                                  selectedSerial,
                                  Number((event.target as HTMLInputElement).value)
                                ),
                              'Reverb amount updated'
                            )
                          }}
                        />
                      </label>
                      <p className="muted small">
                        Decay {selectedMixer.effects.current.reverb.decay} | Pre-delay{' '}
                        {selectedMixer.effects.current.reverb.pre_delay}
                      </p>
                    </div>
                  </div>

                  <div className="profileCard">
                    <div className="panelHeader">
                      <span>Echo</span>
                      <span className="muted small">Raw {selectedMixer.effects.current.echo.raw_encoder}</span>
                    </div>
                    <div className="stack compact">
                      <select
                        value={selectedMixer.effects.current.echo.style}
                        disabled={busy || !selectedSerial}
                        onChange={(event) => {
                          if (!selectedSerial) return
                          void runAction(
                            () =>
                              window.goxlrApi.setEchoStyle(
                                selectedSerial,
                                event.target.value as GoXlrEchoStyle
                              ),
                            'Echo style updated'
                          )
                        }}
                      >
                        {ECHO_STYLES.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                      <label className="sliderCard">
                        <div className="sliderHeader">
                          <span>Amount</span>
                          <strong>{selectedMixer.effects.current.echo.amount}</strong>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={selectedMixer.effects.current.echo.amount}
                          disabled={busy || !selectedSerial}
                          onMouseUp={(event) => {
                            if (!selectedSerial) return
                            void runAction(
                              () =>
                                window.goxlrApi.setEchoAmount(
                                  selectedSerial,
                                  Number((event.target as HTMLInputElement).value)
                                ),
                              'Echo amount updated'
                            )
                          }}
                        />
                      </label>
                      <p className="muted small">
                        Tempo {selectedMixer.effects.current.echo.tempo} | Feedback{' '}
                        {selectedMixer.effects.current.echo.feedback}
                      </p>
                    </div>
                  </div>

                  <div className="profileCard">
                    <div className="panelHeader">
                      <span>Pitch</span>
                      <span className="muted small">Raw {selectedMixer.effects.current.pitch.raw_encoder}</span>
                    </div>
                    <div className="stack compact">
                      <select
                        value={selectedMixer.effects.current.pitch.style}
                        disabled={busy || !selectedSerial}
                        onChange={(event) => {
                          if (!selectedSerial) return
                          void runAction(
                            () =>
                              window.goxlrApi.setPitchStyle(
                                selectedSerial,
                                event.target.value as GoXlrPitchStyle
                              ),
                            'Pitch style updated'
                          )
                        }}
                      >
                        {PITCH_STYLES.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                      <label className="sliderCard">
                        <div className="sliderHeader">
                          <span>Amount</span>
                          <strong>{selectedMixer.effects.current.pitch.amount}</strong>
                        </div>
                        <input
                          type="range"
                          min={-24}
                          max={24}
                          value={selectedMixer.effects.current.pitch.amount}
                          disabled={busy || !selectedSerial}
                          onMouseUp={(event) => {
                            if (!selectedSerial) return
                            void runAction(
                              () =>
                                window.goxlrApi.setPitchAmount(
                                  selectedSerial,
                                  Number((event.target as HTMLInputElement).value)
                                ),
                              'Pitch amount updated'
                            )
                          }}
                        />
                      </label>
                      <p className="muted small">
                        Character {selectedMixer.effects.current.pitch.character}
                      </p>
                    </div>
                  </div>

                  <div className="profileCard">
                    <div className="panelHeader">
                      <span>Gender</span>
                      <span className="muted small">Raw {selectedMixer.effects.current.gender.raw_encoder}</span>
                    </div>
                    <div className="stack compact">
                      <select
                        value={selectedMixer.effects.current.gender.style}
                        disabled={busy || !selectedSerial}
                        onChange={(event) => {
                          if (!selectedSerial) return
                          void runAction(
                            () =>
                              window.goxlrApi.setGenderStyle(
                                selectedSerial,
                                event.target.value as GoXlrGenderStyle
                              ),
                            'Gender style updated'
                          )
                        }}
                      >
                        {GENDER_STYLES.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                      <label className="sliderCard">
                        <div className="sliderHeader">
                          <span>Amount</span>
                          <strong>{selectedMixer.effects.current.gender.amount}</strong>
                        </div>
                        <input
                          type="range"
                          min={-50}
                          max={50}
                          value={selectedMixer.effects.current.gender.amount}
                          disabled={busy || !selectedSerial}
                          onMouseUp={(event) => {
                            if (!selectedSerial) return
                            void runAction(
                              () =>
                                window.goxlrApi.setGenderAmount(
                                  selectedSerial,
                                  Number((event.target as HTMLInputElement).value)
                                ),
                              'Gender amount updated'
                            )
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="profileCard">
                    <div className="panelHeader">
                      <span>Megaphone</span>
                      <span className="muted small">Post gain {selectedMixer.effects.current.megaphone.post_gain}</span>
                    </div>
                    <div className="stack compact">
                      <select
                        value={selectedMixer.effects.current.megaphone.style}
                        disabled={busy || !selectedSerial}
                        onChange={(event) => {
                          if (!selectedSerial) return
                          void runAction(
                            () =>
                              window.goxlrApi.setMegaphoneStyle(
                                selectedSerial,
                                event.target.value as GoXlrMegaphoneStyle
                              ),
                            'Megaphone style updated'
                          )
                        }}
                      >
                        {MEGAPHONE_STYLES.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                      <label className="sliderCard">
                        <div className="sliderHeader">
                          <span>Amount</span>
                          <strong>{selectedMixer.effects.current.megaphone.amount}</strong>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={selectedMixer.effects.current.megaphone.amount}
                          disabled={busy || !selectedSerial}
                          onMouseUp={(event) => {
                            if (!selectedSerial) return
                            void runAction(
                              () =>
                                window.goxlrApi.setMegaphoneAmount(
                                  selectedSerial,
                                  Number((event.target as HTMLInputElement).value)
                                ),
                              'Megaphone amount updated'
                            )
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="profileCard">
                    <div className="panelHeader">
                      <span>Robot</span>
                      <span className="muted small">Dry mix {selectedMixer.effects.current.robot.dry_mix}</span>
                    </div>
                    <div className="stack compact">
                      <select
                        value={selectedMixer.effects.current.robot.style}
                        disabled={busy || !selectedSerial}
                        onChange={(event) => {
                          if (!selectedSerial) return
                          void runAction(
                            () =>
                              window.goxlrApi.setRobotStyle(
                                selectedSerial,
                                event.target.value as GoXlrRobotStyle
                              ),
                            'Robot style updated'
                          )
                        }}
                      >
                        {ROBOT_STYLES.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                      <p className="muted small">
                        Low {selectedMixer.effects.current.robot.low_gain}/{selectedMixer.effects.current.robot.low_freq}
                        {' '}| Mid {selectedMixer.effects.current.robot.mid_gain}/
                        {selectedMixer.effects.current.robot.mid_freq} | High{' '}
                        {selectedMixer.effects.current.robot.high_gain}/
                        {selectedMixer.effects.current.robot.high_freq}
                      </p>
                    </div>
                  </div>

                  <div className="profileCard">
                    <div className="panelHeader">
                      <span>Hard tune</span>
                      <span className="muted small">Rate {selectedMixer.effects.current.hard_tune.rate}</span>
                    </div>
                    <div className="stack compact">
                      <select
                        value={selectedMixer.effects.current.hard_tune.style}
                        disabled={busy || !selectedSerial}
                        onChange={(event) => {
                          if (!selectedSerial) return
                          void runAction(
                            () =>
                              window.goxlrApi.setHardTuneStyle(
                                selectedSerial,
                                event.target.value as GoXlrHardTuneStyle
                              ),
                            'Hard tune style updated'
                          )
                        }}
                      >
                        {HARD_TUNE_STYLES.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedMixer.effects.current.hard_tune.source}
                        disabled={busy || !selectedSerial}
                        onChange={(event) => {
                          if (!selectedSerial) return
                          void runAction(
                            () =>
                              window.goxlrApi.setHardTuneSource(
                                selectedSerial,
                                event.target.value as GoXlrHardTuneSource
                              ),
                            'Hard tune source updated'
                          )
                        }}
                      >
                        {HARD_TUNE_SOURCES.map((source) => (
                          <option key={source} value={source}>
                            {source}
                          </option>
                        ))}
                      </select>
                      <label className="sliderCard">
                        <div className="sliderHeader">
                          <span>Amount</span>
                          <strong>{selectedMixer.effects.current.hard_tune.amount}</strong>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={selectedMixer.effects.current.hard_tune.amount}
                          disabled={busy || !selectedSerial}
                          onMouseUp={(event) => {
                            if (!selectedSerial) return
                            void runAction(
                              () =>
                                window.goxlrApi.setHardTuneAmount(
                                  selectedSerial,
                                  Number((event.target as HTMLInputElement).value)
                                ),
                              'Hard tune amount updated'
                            )
                          }}
                        />
                      </label>
                      <p className="muted small">
                        Window {selectedMixer.effects.current.hard_tune.window}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="muted">No effect block exposed for this mixer.</p>
            )}
          </section>
        ) : null}

        {selectedMixer && selectedTab === 'Submix' ? (
          <section className="panel">
            <div className="panelHeader">
              <span>Submix and monitor</span>
              <span className="muted small">Advanced bus behavior</span>
            </div>
            <div className="submixHeader">
              <label className="toggleCard">
                <span>Monitor with FX</span>
                <input
                  type="checkbox"
                  checked={selectedMixer.settings.enable_monitor_with_fx}
                  disabled={busy || !selectedSerial}
                  onChange={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () => window.goxlrApi.setMonitorWithFx(selectedSerial, event.target.checked),
                      'Monitor FX updated'
                    )
                  }}
                />
              </label>
              <label className="toggleCard">
                <span>Lock faders</span>
                <input
                  type="checkbox"
                  checked={selectedMixer.settings.lock_faders}
                  disabled={busy || !selectedSerial}
                  onChange={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () => window.goxlrApi.setLockFaders(selectedSerial, event.target.checked),
                      'Fader lock updated'
                    )
                  }}
                />
              </label>
              <label className="toggleCard wideCard">
                <span>VOD mode</span>
                <select
                  value={selectedMixer.settings.vod_mode as GoXlrVodMode}
                  disabled={busy || !selectedSerial}
                  onChange={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () => window.goxlrApi.setVodMode(selectedSerial, event.target.value as GoXlrVodMode),
                      'VOD mode updated'
                    )
                  }}
                >
                  {VOD_OPTIONS.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {selectedMixer.levels.submix ? (
              <>
                <div className="routingTableWrap">
                  <table className="routingTable">
                    <thead>
                      <tr>
                        <th>Channel</th>
                        <th>Volume</th>
                        <th>Linked</th>
                        <th>Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SUBMIX_CHANNELS.map((channel) => (
                        <tr key={channel}>
                          <td>{channel}</td>
                          <td>
                            <input
                              type="range"
                              min={0}
                              max={255}
                              value={selectedMixer.levels.submix?.inputs[channel].volume ?? 0}
                              disabled={busy || !selectedSerial}
                              onMouseUp={(event) => {
                                if (!selectedSerial) return
                                void runAction(
                                  () =>
                                    window.goxlrApi.setSubmixVolume(
                                      selectedSerial,
                                      channel,
                                      Number((event.target as HTMLInputElement).value)
                                    ),
                                  `${channel} submix volume updated`
                                )
                              }}
                              onTouchEnd={(event) => {
                                if (!selectedSerial) return
                                void runAction(
                                  () =>
                                    window.goxlrApi.setSubmixVolume(
                                      selectedSerial,
                                      channel,
                                      Number((event.target as HTMLInputElement).value)
                                    ),
                                  `${channel} submix volume updated`
                                )
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              checked={Boolean(selectedMixer.levels.submix?.inputs[channel].linked)}
                              disabled={busy || !selectedSerial}
                              onChange={(event) => {
                                if (!selectedSerial) return
                                void runAction(
                                  () =>
                                    window.goxlrApi.setSubmixLinked(
                                      selectedSerial,
                                      channel,
                                      event.target.checked
                                    ),
                                  `${channel} submix link updated`
                                )
                              }}
                            />
                          </td>
                          <td>{selectedMixer.levels.submix?.inputs[channel].ratio ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="outputMixGrid">
                  {OUTPUT_OPTIONS.map((output) => (
                    <label key={output} className="micCard">
                      <span>{output} mix bus</span>
                      <select
                        value={selectedMixer.levels.submix?.outputs[output] ?? 'A'}
                        disabled={busy || !selectedSerial}
                        onChange={(event) => {
                          if (!selectedSerial) return
                          void runAction(
                            () =>
                              window.goxlrApi.setSubmixOutputMix(
                                selectedSerial,
                                output,
                                event.target.value as GoXlrMix
                              ),
                            `${output} submix bus updated`
                          )
                        }}
                      >
                        {MIX_OPTIONS.map((mix) => (
                          <option key={mix} value={mix}>
                            Mix {mix}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </>
            ) : (
              <p className="muted">This mixer does not currently expose submix data.</p>
            )}
          </section>
        ) : null}

        {selectedMixer && selectedTab === 'Settings' ? (
          <section className="panel">
            <div className="panelHeader">
              <span>Settings</span>
              <span className="muted small">Device behavior, sampler behavior, and display modes</span>
            </div>
            <div className="profileGrid">
              <label className="sliderCard">
                <div className="sliderHeader">
                  <span>Mute hold duration</span>
                  <strong>{selectedMixer.settings.mute_hold_duration} ms</strong>
                </div>
                <input
                  type="range"
                  min={0}
                  max={3000}
                  step={50}
                  value={selectedMixer.settings.mute_hold_duration}
                  disabled={busy || !selectedSerial}
                  onMouseUp={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () =>
                        window.goxlrApi.setMuteHoldDuration(
                          selectedSerial,
                          Number((event.target as HTMLInputElement).value)
                        ),
                      'Mute hold duration updated'
                    )
                  }}
                />
              </label>

              <label className="sliderCard">
                <div className="sliderHeader">
                  <span>Sampler fade duration</span>
                  <strong>{selectedMixer.settings.fade_duration} ms</strong>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20000}
                  step={100}
                  value={selectedMixer.settings.fade_duration}
                  disabled={busy || !selectedSerial}
                  onMouseUp={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () =>
                        window.goxlrApi.setSamplerFadeDuration(
                          selectedSerial,
                          Number((event.target as HTMLInputElement).value)
                        ),
                      'Sampler fade duration updated'
                    )
                  }}
                />
              </label>

              <label className="toggleCard">
                <span>VC mute also mute chat mic</span>
                <input
                  type="checkbox"
                  checked={selectedMixer.settings.vc_mute_also_mute_cm}
                  disabled={busy || !selectedSerial}
                  onChange={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () => window.goxlrApi.setVcMuteAlsoMuteCm(selectedSerial, event.target.checked),
                      'VC mute routing updated'
                    )
                  }}
                />
              </label>

              <label className="toggleCard">
                <span>Reset sampler on clear</span>
                <input
                  type="checkbox"
                  checked={selectedMixer.settings.reset_sampler_on_clear}
                  disabled={busy || !selectedSerial}
                  onChange={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () => window.goxlrApi.setSamplerResetOnClear(selectedSerial, event.target.checked),
                      'Sampler clear behavior updated'
                    )
                  }}
                />
              </label>

              <div className="profileCard">
                <span>Display modes</span>
                <div className="stack compact">
                  <label>
                    <span className="muted small">Gate display</span>
                    <select
                      value={selectedMixer.settings.display.gate}
                      disabled={busy || !selectedSerial}
                      onChange={(event) => {
                        if (!selectedSerial) return
                        void runAction(
                          () =>
                            window.goxlrApi.setDisplayMode(
                              selectedSerial,
                              'NoiseGate',
                              event.target.value as GoXlrDisplayMode
                            ),
                          'Gate display mode updated'
                        )
                      }}
                    >
                      {DISPLAY_MODES.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="muted small">Compressor display</span>
                    <select
                      value={selectedMixer.settings.display.compressor}
                      disabled={busy || !selectedSerial}
                      onChange={(event) => {
                        if (!selectedSerial) return
                        void runAction(
                          () =>
                            window.goxlrApi.setDisplayMode(
                              selectedSerial,
                              'Compressor',
                              event.target.value as GoXlrDisplayMode
                            ),
                          'Compressor display mode updated'
                        )
                      }}
                    >
                      {DISPLAY_MODES.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="muted small">Equaliser display</span>
                    <select
                      value={selectedMixer.settings.display.equaliser}
                      disabled={busy || !selectedSerial}
                      onChange={(event) => {
                        if (!selectedSerial) return
                        void runAction(
                          () =>
                            window.goxlrApi.setDisplayMode(
                              selectedSerial,
                              'Equaliser',
                              event.target.value as GoXlrDisplayMode
                            ),
                          'Equaliser display mode updated'
                        )
                      }}
                    >
                      {DISPLAY_MODES.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="muted small">Equaliser fine display</span>
                    <select
                      value={selectedMixer.settings.display.equaliser_fine}
                      disabled={busy || !selectedSerial}
                      onChange={(event) => {
                        if (!selectedSerial) return
                        void runAction(
                          () =>
                            window.goxlrApi.setDisplayMode(
                              selectedSerial,
                              'EqFineTune',
                              event.target.value as GoXlrDisplayMode
                            ),
                          'Equaliser fine display mode updated'
                        )
                      }}
                    >
                      {DISPLAY_MODES.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {selectedMixer && selectedTab === 'Diagnostics' ? (
          <section className="panel">
            <div className="panelHeader">
              <span>Diagnostics</span>
              <span className="muted small">Current daemon-backed state snapshot</span>
            </div>
            <div className="diagnosticGrid">
              <div className="profileCard">
                <span>App + daemon</span>
                <div className="stack compact">
                  <p className="muted small">Daemon version: {appState.status?.config.daemon_version}</p>
                  <p className="muted small">Platform: {appState.status?.config.platform}</p>
                  <p className="muted small">
                    Driver: {appState.status?.config.driver_interface?.interface ?? 'Unknown'}
                  </p>
                  <p className="muted small">HTTP bind: {appState.status?.config.http_settings.bind_address}</p>
                </div>
              </div>

              <div className="profileCard">
                <span>Settings flags</span>
                <div className="stack compact">
                  {Object.entries(selectedMixer.settings).map(([key, value]) => (
                    <p className="muted small" key={key}>
                      {key}: {renderValue(value)}
                    </p>
                  ))}
                </div>
              </div>

              <div className="profileCard">
                <span>Paths</span>
                <div className="stack compact">
                  {Object.entries(appState.status?.paths ?? {}).map(([key, value]) => (
                    <p className="muted small" key={key}>
                      {key}: {renderValue(value)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {selectedMixer && selectedTab === 'Lighting' ? (
          <section className="panel">
            <div className="panelHeader">
              <span>Lighting</span>
              <span className="muted small">Animation and primary color control</span>
            </div>
            <div className="lightingGrid">
              <label className="micCard">
                <span>Animation mode</span>
                <select
                  value={selectedMixer.lighting.animation.mode}
                  disabled={busy || !selectedSerial}
                  onChange={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () =>
                        window.goxlrApi.setAnimationMode(
                          selectedSerial,
                          event.target.value as GoXlrAnimationMode
                        ),
                      'Animation mode updated'
                    )
                  }}
                >
                  {ANIMATION_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </label>

              <label className="micCard">
                <span>Waterfall</span>
                <select
                  value={selectedMixer.lighting.animation.waterfall_direction}
                  disabled={busy || !selectedSerial}
                  onChange={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () =>
                        window.goxlrApi.setAnimationWaterfall(
                          selectedSerial,
                          event.target.value as GoXlrWaterfallDirection
                        ),
                      'Waterfall direction updated'
                    )
                  }}
                >
                  {WATERFALL_DIRECTIONS.map((direction) => (
                    <option key={direction} value={direction}>
                      {direction}
                    </option>
                  ))}
                </select>
              </label>

              <label className="sliderCard">
                <div className="sliderHeader">
                  <span>Animation mod 1</span>
                  <strong>{selectedMixer.lighting.animation.mod1}</strong>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={selectedMixer.lighting.animation.mod1}
                  disabled={busy || !selectedSerial}
                  onMouseUp={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () => window.goxlrApi.setAnimationMod1(selectedSerial, Number((event.target as HTMLInputElement).value)),
                      'Animation mod 1 updated'
                    )
                  }}
                />
              </label>

              <label className="sliderCard">
                <div className="sliderHeader">
                  <span>Animation mod 2</span>
                  <strong>{selectedMixer.lighting.animation.mod2}</strong>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={selectedMixer.lighting.animation.mod2}
                  disabled={busy || !selectedSerial}
                  onMouseUp={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () => window.goxlrApi.setAnimationMod2(selectedSerial, Number((event.target as HTMLInputElement).value)),
                      'Animation mod 2 updated'
                    )
                  }}
                />
              </label>
            </div>

            <div className="colorGrid">
              {SIMPLE_COLOUR_TARGETS.map((target) => (
                <label key={target} className="colorCard">
                  <span>{target}</span>
                  <input
                    type="color"
                    value={selectedMixer.lighting.simple[target]?.colour_one ?? '#ffffff'}
                    disabled={busy || !selectedSerial}
                    onChange={(event) => {
                      if (!selectedSerial) return
                      void runAction(
                        () => window.goxlrApi.setSimpleColour(selectedSerial, target, event.target.value),
                        `${target} color updated`
                      )
                    }}
                  />
                  <code>{selectedMixer.lighting.simple[target]?.colour_one ?? '#ffffff'}</code>
                </label>
              ))}
            </div>
          </section>
        ) : null}

        {selectedMixer && selectedTab === 'Sampler' ? (
          <section className="panel">
            <div className="panelHeader">
              <span>Sampler</span>
              <span className="muted small">Bank control and sample triggering</span>
            </div>

            <div className="samplerHeader">
              <label className="micCard">
                <span>Active bank</span>
                <select
                  value={activeSamplerBank}
                  disabled={busy || !selectedSerial || !selectedMixer.sampler}
                  onChange={(event) => {
                    if (!selectedSerial) return
                    void runAction(
                      () => window.goxlrApi.setSamplerBank(selectedSerial, event.target.value as GoXlrSampleBank),
                      'Sampler bank updated'
                    )
                  }}
                >
                  {SAMPLE_BANKS.map((bank) => (
                    <option key={bank} value={bank}>
                      Bank {bank}
                    </option>
                  ))}
                </select>
              </label>

              <div className="profileCard">
                <span>Processing state</span>
                <p className="muted small">
                  Progress: {renderValue(selectedMixer.sampler?.processing_state.progress)}
                </p>
                <p className="muted small">
                  Last error: {renderValue(selectedMixer.sampler?.processing_state.last_error)}
                </p>
                <p className="muted small">
                  Record buffer: {renderValue(selectedMixer.sampler?.record_buffer)}
                </p>
              </div>

              <div className="profileCard">
                <span>Sample library</span>
                <p className="muted small">Available files: {sampleLibraryEntries.length}</p>
                <p className="muted small">
                  Sample folder: {renderValue(appState.status?.paths.samples_directory)}
                </p>
                <button
                  className="ghost tileButton"
                  onClick={() => void window.goxlrApi.openPath('Samples')}
                >
                  Open sample folder
                </button>
              </div>
            </div>

            {selectedMixer.sampler ? (
              <div className="samplerGrid">
                {SAMPLE_BUTTONS.map((button) => {
                  const buttonData = selectedMixer.sampler?.banks[activeSamplerBank]?.[button]
                  const draftKey = `${activeSamplerBank}:${button}`
                  return (
                    <div key={button} className="profileCard">
                      <div className="panelHeader">
                        <span>{button}</span>
                        <span className="muted small">{buttonData?.samples.length ?? 0} samples</span>
                      </div>
                      <div className="stack compact">
                        <label>
                          <span className="muted small">Mode</span>
                          <select
                            value={buttonData?.function ?? 'PlayNext'}
                            disabled={busy || !selectedSerial}
                            onChange={(event) => {
                              if (!selectedSerial) return
                              void runAction(
                                () =>
                                  window.goxlrApi.setSamplerFunction(
                                    selectedSerial,
                                    activeSamplerBank,
                                    button,
                                    event.target.value as GoXlrSamplePlaybackMode
                                  ),
                                `${button} mode updated`
                              )
                            }}
                          >
                            {SAMPLE_PLAYBACK_MODES.map((mode) => (
                              <option key={mode} value={mode}>
                                {mode}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          <span className="muted small">Order</span>
                          <select
                            value={buttonData?.order ?? 'Sequential'}
                            disabled={busy || !selectedSerial}
                            onChange={(event) => {
                              if (!selectedSerial) return
                              void runAction(
                                () =>
                                  window.goxlrApi.setSamplerOrder(
                                    selectedSerial,
                                    activeSamplerBank,
                                    button,
                                    event.target.value as GoXlrSamplePlayOrder
                                  ),
                                `${button} order updated`
                              )
                            }}
                          >
                            {SAMPLE_PLAY_ORDERS.map((order) => (
                              <option key={order} value={order}>
                                {order}
                              </option>
                            ))}
                          </select>
                        </label>
                        <p className="muted small">
                          Playing: {buttonData?.is_playing ? 'yes' : 'no'} | Recording:{' '}
                          {buttonData?.is_recording ? 'yes' : 'no'}
                        </p>
                        <label>
                          <span className="muted small">Add sample from library</span>
                          <select
                            value={sampleDrafts[draftKey] ?? ''}
                            disabled={busy || !selectedSerial || sampleLibraryEntries.length === 0}
                            onChange={(event) => {
                              const nextValue = event.target.value
                              setSampleDrafts((current) => ({
                                ...current,
                                [draftKey]: nextValue
                              }))

                              if (!selectedSerial || !nextValue) return

                              void runAction(
                                () =>
                                  window.goxlrApi.addSample(
                                    selectedSerial,
                                    activeSamplerBank,
                                    button,
                                    nextValue
                                  ),
                                `${nextValue} added to ${button}`
                              ).then(() => {
                                setSampleDrafts((current) => ({
                                  ...current,
                                  [draftKey]: ''
                                }))
                              })
                            }}
                          >
                            <option value="">Choose a sample file</option>
                            {sampleLibraryEntries.map(([fileKey, sampleFile]) => (
                              <option key={fileKey} value={sampleFile.name}>
                                {sampleFile.name} ({sampleFile.gain_pct}%)
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className="buttonRow tight">
                        <button
                          disabled={busy || !selectedSerial}
                          onClick={() => {
                            if (!selectedSerial) return
                            void runAction(
                              () => window.goxlrApi.playNextSample(selectedSerial, activeSamplerBank, button),
                              `${button} triggered`
                            )
                          }}
                        >
                          Play next
                        </button>
                        <button
                          className="ghost"
                          disabled={busy || !selectedSerial}
                          onClick={() => {
                            if (!selectedSerial) return
                            void runAction(
                              () => window.goxlrApi.stopSample(selectedSerial, activeSamplerBank, button),
                              `${button} stopped`
                            )
                          }}
                        >
                          Stop
                        </button>
                      </div>
                      <div className="sampleList">
                        {(buttonData?.samples ?? []).map((sample, index) => (
                          <div key={`${button}-${index}`} className="sampleEditor">
                            <div className="sampleRow">
                              <strong>{sample.name}</strong>
                              <button
                                className="ghost"
                                disabled={busy || !selectedSerial}
                                onClick={() => {
                                  if (!selectedSerial) return
                                  void runAction(
                                    () =>
                                      window.goxlrApi.removeSample(
                                        selectedSerial,
                                        activeSamplerBank,
                                        button,
                                        index
                                      ),
                                    `${sample.name} removed`
                                  )
                                }}
                              >
                                Remove
                              </button>
                            </div>
                            <div className="sampleTrimGrid">
                              <label>
                                <span className="muted small">Start %</span>
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  step={0.1}
                                  defaultValue={sample.start_pct}
                                  disabled={busy || !selectedSerial}
                                  onBlur={(event) => {
                                    if (!selectedSerial) return
                                    void runAction(
                                      () =>
                                        window.goxlrApi.setSampleStart(
                                          selectedSerial,
                                          activeSamplerBank,
                                          button,
                                          index,
                                          Number((event.target as HTMLInputElement).value)
                                        ),
                                      `${sample.name} start updated`
                                    )
                                  }}
                                />
                              </label>
                              <label>
                                <span className="muted small">Stop %</span>
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  step={0.1}
                                  defaultValue={sample.stop_pct}
                                  disabled={busy || !selectedSerial}
                                  onBlur={(event) => {
                                    if (!selectedSerial) return
                                    void runAction(
                                      () =>
                                        window.goxlrApi.setSampleStop(
                                          selectedSerial,
                                          activeSamplerBank,
                                          button,
                                          index,
                                          Number((event.target as HTMLInputElement).value)
                                        ),
                                      `${sample.name} stop updated`
                                    )
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="muted">No sampler data available for this mixer.</p>
            )}
          </section>
        ) : null}
      </main>
    </div>
  )
}

export default App
