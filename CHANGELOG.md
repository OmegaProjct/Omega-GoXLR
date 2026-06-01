# Changelog

The format is based on Keep a Changelog. Dieses Projekt nutzt das klassische Semantic Versioning (`X.Y.Z`).

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
