# Changelog

The format is based on Keep a Changelog. Dieses Projekt nutzt das klassische Semantic Versioning (`X.Y.Z`).

## [0.1.8] - 2026-06-01

### English

#### Added
- **Profile authoring workflow**: Added `Save As` and delete actions for main profiles and mic profiles directly in the Profiles workspace.
- **Scribble strip editing**: Added per-fader scribble controls for icon selection, bottom text, side text, and invert mode in the Faders workspace.

#### Changed
- **Bridge expansion for profile and scribble editing**: The Electron bridge now supports profile save-as/delete flows, mic-profile save-as/delete flows, and the four scribble update commands.
- **Fader model growth**: Shared fader typing now includes scribble payload data so the renderer can work with current icon/text/invert state without untyped access.

### Deutsch

#### Hinzugefuegt
- **Profil-Authoring-Workflow**: `Save As`- und Delete-Aktionen fuer Hauptprofile und Mic-Profile direkt im Profiles-Arbeitsbereich.
- **Scribble-Strip-Bearbeitung**: Pro-Fader-Steuerung fuer Icon-Auswahl, Bottom-Text, Seitentext und Invertierung im Faders-Arbeitsbereich.

#### Geaendert
- **Bridge-Ausbau fuer Profil- und Scribble-Bearbeitung**: Die Electron-Bridge unterstuetzt jetzt Profil-Save-As/Delete, Mic-Profil-Save-As/Delete sowie alle vier Scribble-Befehle.
- **Groesseres Fader-Modell**: Das gemeinsame Fader-Typmodell enthaelt jetzt Scribble-Payload-Daten, damit der Renderer den aktuellen Icon-/Text-/Invert-State ohne untypisierte Zugriffe nutzen kann.

## [0.1.7] - 2026-06-01

### English

#### Added
- **Equalizer control workflow**: Added editable mini and full EQ sections in the Mic workspace with per-band gain and center-frequency control.
- **Typed EQ support**: Added typed full-size and mini EQ frequency models so the renderer can safely address the daemon's mic-profile EQ structures.

#### Changed
- **Bridge expansion for mic EQ editing**: The Electron bridge now supports full EQ gain/frequency changes and mini EQ gain/frequency changes.
- **Mic workspace coverage growth**: The Mic workspace now covers mic type, gain, gate, compressor, and EQ adjustment in one place instead of splitting read-only and editable areas.

### Deutsch

#### Hinzugefuegt
- **Equalizer-Workflow**: Bearbeitbare Mini- und Full-EQ-Bereiche im Mic-Arbeitsbereich mit Gain- und Center-Frequency-Steuerung pro Band.
- **Typisierte EQ-Unterstuetzung**: Typisierte Modelle fuer Full- und Mini-EQ-Frequenzen, damit der Renderer sicher gegen die EQ-Strukturen des Daemons arbeiten kann.

#### Geaendert
- **Bridge-Ausbau fuer Mic-EQ-Bearbeitung**: Die Electron-Bridge unterstuetzt jetzt Full-EQ-Gain/Frequency-Aenderungen sowie Mini-EQ-Gain/Frequency-Aenderungen.
- **Groessere Mic-Arbeitsbereich-Abdeckung**: Der Mic-Arbeitsbereich deckt jetzt Mikrofontyp, Gain, Gate, Compressor und EQ-Anpassung an einer Stelle ab, statt editierbare und reine Anzeige-Bereiche zu trennen.

## [0.1.6] - 2026-06-01

### English

#### Added
- **Mic dynamics control workflow**: Added live controls for gate enable state, threshold, attenuation, attack, and release, plus compressor threshold, ratio, attack, release, and makeup gain.
- **Display mode editing**: Added editable display modes for gate, compressor, equaliser, and fine equaliser handling inside the Settings workspace.

#### Changed
- **Bridge expansion for microphone processing**: The Electron bridge now supports deeper microphone processing commands covering gate, compressor, and display-mode updates.
- **Typed mic model growth**: Shared TypeScript models now capture gate timing, compressor timing/ratio values, and display-mode enums so the renderer can safely work against daemon state.

### Deutsch

#### Hinzugefuegt
- **Mic-Dynamics-Workflow**: Live-Steuerung fuer Gate-Aktivierung, Threshold, Attenuation, Attack und Release sowie fuer Compressor-Threshold, Ratio, Attack, Release und Makeup-Gain.
- **Bearbeitbare Display-Modi**: Die Display-Modi fuer Gate, Compressor, Equaliser und Fine-Equaliser lassen sich jetzt direkt im Settings-Arbeitsbereich umstellen.

#### Geaendert
- **Bridge-Ausbau fuer Mikrofon-Processing**: Die Electron-Bridge unterstuetzt jetzt tiefere Mikrofonbefehle fuer Gate, Compressor und Display-Mode-Aenderungen.
- **Groesseres typisiertes Mic-Modell**: Die gemeinsamen TypeScript-Modelle decken jetzt Gate-Timings, Compressor-Timings/Ratio-Werte und Display-Mode-Enums ab, damit der Renderer sicher gegen den Daemon-Zustand arbeiten kann.

## [0.1.5] - 2026-06-01

### English

#### Added
- **Sampler management workflow**: Added sampler pad editing for playback mode, play order, library assignment, per-sample removal, and start/stop trim adjustment.
- **Sample library visibility**: The Sampler workspace now shows the daemon-exposed sample library and provides direct access to the samples folder.

#### Changed
- **Bridge expansion for sampler editing**: The Electron bridge now supports sampler function changes, order changes, sample assignment, sample removal, and trim updates.
- **Typed file model growth**: Shared TypeScript models now include daemon sample-library metadata and typed sampler mode/order values.

### Deutsch

#### Hinzugefuegt
- **Sampler-Management-Workflow**: Der Sampler unterstuetzt jetzt Pad-Bearbeitung fuer Playback-Modus, Abspielreihenfolge, Bibliotheks-Zuweisung, Entfernen einzelner Samples sowie Start-/Stop-Trim.
- **Sichtbare Sample-Bibliothek**: Der Sampler-Arbeitsbereich zeigt jetzt die vom Daemon bekannte Sample-Bibliothek und bietet einen direkten Zugriff auf den Samples-Ordner.

#### Geaendert
- **Bridge-Ausbau fuer Sampler-Bearbeitung**: Die Electron-Bridge deckt jetzt Sampler-Funktionswechsel, Reihenfolge, Sample-Zuweisung, Entfernen und Trim-Updates ab.
- **Groesseres typisiertes Dateimodell**: Die gemeinsamen TypeScript-Modelle enthalten jetzt Sample-Bibliotheksdaten des Daemons sowie typisierte Sampler-Modi und Reihenfolgen.

## [0.1.4] - 2026-06-01

### English

#### Added
- **Effects workspace**: Added a dedicated Effects tab with toggles for the FX engine, Megaphone, Robot, and Hard Tune, plus live controls for reverb, echo, pitch, gender, and key effect styles.
- **Settings workspace**: Added a dedicated Settings tab for mute-hold timing, sampler fade duration, reset-on-clear behavior, VC mute routing, and read-only display mode visibility.

#### Changed
- **Bridge expansion for effect and settings control**: The Electron bridge now supports deeper daemon commands for FX state, reverb/echo/pitch/gender updates, character effect toggles, and device settings behavior.
- **Typed mixer model growth**: Shared TypeScript models now cover deep effect payloads and display settings so the renderer can work with current daemon state without fallback parsing.

### Deutsch

#### Hinzugefuegt
- **Effects-Arbeitsbereich**: Neuer Effects-Tab mit Schaltern fuer FX-Engine, Megaphone, Robot und Hard Tune sowie Live-Steuerung fuer Reverb, Echo, Pitch, Gender und zentrale Effektstile.
- **Settings-Arbeitsbereich**: Neuer Settings-Tab fuer Mute-Hold-Dauer, Sampler-Fade-Dauer, Reset-beim-Leeren, VC-Mute-Routing und sichtbare Display-Modi.

#### Geaendert
- **Bridge-Ausbau fuer Effekt- und Settings-Steuerung**: Die Electron-Bridge deckt jetzt tiefere Daemon-Befehle fuer FX-Status, Reverb-/Echo-/Pitch-/Gender-Aenderungen, Charaktereffekte und Geraeteverhalten ab.
- **Groesseres typisiertes Mixer-Modell**: Die gemeinsamen TypeScript-Modelle enthalten jetzt tiefe Effekt-Payloads und Display-Settings, damit der Renderer den aktuellen Daemon-Zustand ohne Fallback-Parsing nutzen kann.

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
