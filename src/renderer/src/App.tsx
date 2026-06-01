import { useEffect, useState } from 'react'
import type { GoXlrAppState, MixerStatus } from '../../main/goxlrTypes'

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

const CHANNEL_ORDER = ['Headphones', 'Mic', 'Chat', 'Music', 'Game', 'Console', 'LineIn', 'System', 'Samples']

function formatDeviceLabel(serial: string, mixer: MixerStatus): string {
  return `${mixer.hardware.device_type} - ${serial}`
}

function App(): JSX.Element {
  const [appState, setAppState] = useState<GoXlrAppState>(FALLBACK_STATE)
  const [selectedSerial, setSelectedSerial] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const mixers = appState.status?.mixers ?? {}
  const serials = Object.keys(mixers)
  const selectedMixer = selectedSerial ? mixers[selectedSerial] : undefined

  useEffect(() => {
    refresh()
  }, [])

  useEffect(() => {
    if (!selectedSerial && serials.length > 0) {
      setSelectedSerial(serials[0])
    }
    if (selectedSerial && !mixers[selectedSerial] && serials.length > 0) {
      setSelectedSerial(serials[0])
    }
  }, [selectedSerial, serials, mixers])

  async function refresh(): Promise<void> {
    const nextState = await window.goxlrApi.getAppState()
    setAppState(nextState)
  }

  async function startDaemon(): Promise<void> {
    setBusy(true)
    try {
      const nextState = await window.goxlrApi.startDaemon()
      setAppState(nextState)
    } finally {
      setBusy(false)
    }
  }

  async function changeVolume(channel: string, volume: number): Promise<void> {
    if (!selectedSerial) {
      return
    }

    setBusy(true)
    try {
      const nextState = await window.goxlrApi.setVolume(selectedSerial, channel, volume)
      setAppState(nextState)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Omega GoXLR</p>
          <h1>Desktop Prototype</h1>
          <p className="muted">
            Electron shell plus Rust GoXLR backend. This is the first bridge test, not the final UI.
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
          {appState.daemon.lastError ? <p className="error">{appState.daemon.lastError}</p> : null}
          <div className="buttonRow">
            <button onClick={startDaemon} disabled={busy}>
              {busy ? 'Working...' : 'Start daemon'}
            </button>
            <button className="ghost" onClick={refresh} disabled={busy}>
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
                className={serial === selectedSerial ? 'device active' : 'device'}
                onClick={() => setSelectedSerial(serial)}
              >
                <strong>{formatDeviceLabel(serial, mixers[serial])}</strong>
                <span>{mixers[serial].profile_name || 'No profile loaded'}</span>
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
            </>
          ) : (
            <p className="muted">Start the daemon and select a GoXLR device to inspect live status.</p>
          )}
        </section>

        <section className="panel">
          <div className="panelHeader">
            <span>Volume test</span>
            <span className="muted small">Safe proof of command flow</span>
          </div>
          {selectedMixer ? (
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
                        void changeVolume(channel, Number((event.target as HTMLInputElement).value))
                      }}
                      onTouchEnd={(event) => {
                        void changeVolume(channel, Number((event.target as HTMLInputElement).value))
                      }}
                    />
                  </label>
                )
              )}
            </div>
          ) : (
            <p className="muted">No mixer selected.</p>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
