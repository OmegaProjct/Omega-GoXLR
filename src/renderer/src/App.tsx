import { useEffect, useMemo, useState } from 'react'
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
  GoXlrVodMode,
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
const EFFECT_PRESETS: GoXlrEffectPreset[] = ['Preset1', 'Preset2', 'Preset3', 'Preset4', 'Preset5', 'Preset6']
const TABS = ['Overview', 'Faders', 'Routing', 'Mic', 'Submix', 'Profiles', 'Diagnostics'] as const

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

function App(): JSX.Element {
  const [appState, setAppState] = useState<GoXlrAppState>(FALLBACK_STATE)
  const [selectedSerial, setSelectedSerial] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<AppTab>('Overview')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mixers = appState.status?.mixers ?? {}
  const serials = Object.keys(mixers)
  const selectedMixer = selectedSerial ? mixers[selectedSerial] : undefined

  const profileFiles = appState.status?.files.profiles ?? []
  const micProfileFiles = appState.status?.files.mic_profiles ?? []
  const presetFiles = appState.status?.files.presets ?? []

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
              <span className="muted small">Route channels to the physical faders</span>
            </div>
            <div className="stack">
              {FADER_ORDER.map((fader) => (
                <label key={fader} className="formRow">
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
                </label>
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
              <span className="muted small">Type, gain and quick status</span>
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

              <div className="micCard infoCard">
                <span>Gate</span>
                <strong>{selectedMixer.mic_status.noise_gate.enabled ? 'Enabled' : 'Disabled'}</strong>
                <p className="muted small">
                  Threshold {selectedMixer.mic_status.noise_gate.threshold}, attenuation{' '}
                  {selectedMixer.mic_status.noise_gate.attenuation}
                </p>
              </div>

              <div className="micCard infoCard">
                <span>Compressor</span>
                <strong>{selectedMixer.mic_status.compressor.ratio}</strong>
                <p className="muted small">
                  Threshold {selectedMixer.mic_status.compressor.threshold}, makeup{' '}
                  {selectedMixer.mic_status.compressor.makeup_gain}
                </p>
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
      </main>
    </div>
  )
}

export default App
