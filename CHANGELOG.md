# Changelog

The format is based on Keep a Changelog. Dieses Projekt nutzt das klassische Semantic Versioning (`X.Y.Z`).

## [0.1.3] - 2026-06-01

### English

#### Added
- **Lighting workspace**: Added a dedicated Lighting tab with animation mode, waterfall direction, animation modifiers, and core color-target editing.
- **Sampler workspace**: Added a Sampler tab with active bank switching, per-pad sample listing, play-next triggering, stop actions, and processing-state visibility.

#### Changed
- **Bridge expansion for media and lighting control**: Added daemon bridge support for animation settings, simple colour targets, sampler bank switching, and sample trigger/stop actions.
- **Richer device model again**: Mixer typing now includes lighting, effects, and sampler state blocks, allowing broader UI coverage without falling back to untyped payload access.

### Deutsch

#### Hinzugefuegt
- **Lighting-Arbeitsbereich**: Neuer Lighting-Tab mit Animationsmodus, Waterfall-Richtung, Animationsmodifikatoren und zentraler Farbbearbeitung.
- **Sampler-Arbeitsbereich**: Neuer Sampler-Tab mit Bankwechsel, Sample-Listen pro Pad, Play-Next-Ausloesung, Stop-Aktionen und Sichtbarkeit des Processing-Status.

#### Geaendert
- **Bridge-Ausbau fuer Medien- und Lighting-Steuerung**: Die Daemon-Bridge unterstuetzt jetzt Animationseinstellungen, einfache Farbtargets, Sampler-Bankwechsel sowie Sample-Trigger- und Stop-Aktionen.
- **Noch reicheres Geraetemodell**: Das typisierte Mixer-Modell deckt jetzt Lighting-, Effects- und Sampler-Bloecke ab, sodass die UI groessere Teile des Geraets ohne untypisierte Direktzugriffe abbilden kann.

## [0.1.2] - 2026-06-01

### English

#### Added
- **Submix workspace**: Added a dedicated Submix tab with submix channel volume controls, linked-state toggles, and output bus assignment.
- **Diagnostics workspace**: Added a Diagnostics tab showing daemon version, driver interface, path data, and current mixer settings flags.
- **Advanced quick controls**: Added monitor output switching, bleep level control, de-esser control, VOD mode switching, fader lock, and monitor-with-effects toggles.
- **Effect preset actions**: Added active effect preset switching and save actions to the Profiles section.

#### Changed
- **Bridge expansion for advanced controls**: The Electron bridge now supports monitor mix, submix, de-esser, bleep level, effect preset, VOD mode, and lock-fader commands.
- **Typed mixer model growth**: Added submix, mix bus, effect preset, and VOD-related typing to the shared GoXLR state model.

### Deutsch

#### Hinzugefuegt
- **Submix-Arbeitsbereich**: Eigener Submix-Tab mit Lautstaerke-Reglern pro Submix-Kanal, Link-Toggles und Ausgangs-Bus-Zuweisung.
- **Diagnose-Arbeitsbereich**: Neuer Diagnostics-Tab mit Daemon-Version, Treiber-Interface, Pfaddaten und aktuellen Mixer-Settings-Flags.
- **Erweiterte Schnellsteuerung**: Monitor-Ausgang, Bleep-Level, De-Esser, VOD-Modus, Fader-Lock und Monitor-mit-Effekten koennen jetzt direkt gesteuert werden.
- **Effect-Preset-Aktionen**: Aktives Effekt-Preset umschalten und speichern nun direkt im Profiles-Bereich moeglich.

#### Geaendert
- **Bridge-Ausbau fuer Advanced Controls**: Die Electron-Bridge unterstuetzt jetzt Monitor-Mix, Submix, De-Esser, Bleep-Level, Effekt-Presets, VOD-Modus und Fader-Lock.
- **Groesseres typisiertes Mixer-Modell**: Das gemeinsame GoXLR-Zustandsmodell deckt nun Submix, Mix-Busse, Effekt-Presets und VOD-bezogene Daten mit ab.

## [0.1.1] - 2026-06-01

### English

#### Added
- **Expanded desktop MVP**: Added a multi-section control surface with Overview, Faders, Routing, Mic, and Profiles tabs.
- **Live polling refresh**: The app now refreshes daemon-backed mixer state automatically while the daemon is online.
- **Profile and folder actions**: Added profile loading/saving, mic profile loading/saving, and daemon path opening shortcuts.

#### Changed
- **Bridge coverage**: Extended the Electron main/preload bridge to support fader assignment, routing changes, microphone type/gain control, and profile actions.
- **Richer daemon typing**: Replaced the narrow prototype status model with a broader typed GoXLR state model covering mixers, files, paths, faders, routing, and mic state.

### Deutsch

#### Hinzugefuegt
- **Erweitertes Desktop-MVP**: Mehrteilige Mixer-Oberflaeche mit den Bereichen Overview, Faders, Routing, Mic und Profiles.
- **Live-Polling fuer Statusupdates**: Der daemon-basierte Mixer-Status wird nun automatisch aktualisiert, solange der Daemon online ist.
- **Profil- und Ordneraktionen**: Laden/Speichern von Profilen und Mic-Profilen sowie Schnellzugriffe auf daemon-verwaltete Ordner hinzugefuegt.

#### Geaendert
- **Erweiterte Bridge-Abdeckung**: Die Electron Main-/Preload-Bridge unterstuetzt jetzt Fader-Zuweisung, Routing-Aenderungen, Mikrofontyp/Mikrofon-Gain und Profilaktionen.
- **Reicheres Daemon-Typmodell**: Das enge Prototyp-Statusmodell wurde durch ein breiteres typisiertes GoXLR-Zustandsmodell fuer Mixer, Dateien, Pfade, Fader, Routing und Mic-Status ersetzt.

## [0.1.0] - 2026-06-01

### English

#### Added
- **Initial public project scaffold**: Created the first Electron + React + TypeScript project structure for Omega GoXLR.
- **GoXLR daemon bridge prototype**: Added a desktop-side bridge that can query the local GoXLR daemon and attempt to launch it when available.
- **Minimal desktop dashboard**: Added a first device overview with daemon state, mixer listing, and a safe channel volume proof-of-concept control.
- **Release hygiene baseline**: Added README, changelog, contribution guide, release-note extraction script, MIT license, and GitHub Actions release workflow.

### Deutsch

#### Hinzugefuegt
- **Erstes oeffentliches Projektgeruest**: Aufbau der ersten Electron + React + TypeScript Projektstruktur fuer Omega GoXLR.
- **GoXLR-Daemon-Bridge Prototyp**: Eine Desktop-seitige Bridge kann den lokalen GoXLR-Daemon abfragen und bei Verfuegbarkeit zu starten versuchen.
- **Minimales Desktop-Dashboard**: Erste Geraeteuebersicht mit Daemon-Status, Mixer-Liste und einer sicheren Lautstaerke-Proof-of-Concept-Steuerung.
- **Release-Hygiene als Basis**: README, Changelog, Contribution-Guide, Release-Notes-Extraktion, MIT-Lizenz und GitHub-Actions-Release-Workflow hinzugefuegt.
