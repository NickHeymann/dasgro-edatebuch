# Datebuch - Projektbriefing für Claude

> Globale Coding-Regeln, Prompt-Optimierung & Self-Review siehe: `~/CLAUDE.md`

## WICHTIG: Aktuelles Datum
**Heute ist der 08.12.2025** (Dezember 2025)
- Alle Event-Recherchen müssen ab diesem Datum sein
- Vergangene Events ignorieren
- Bei Recherche immer das aktuelle Datum beachten
- Das Datum kann auch über `new Date().toISOString()` geprüft werden

## Login-Schutz
- **Passwort**: `nicksolli2025`
- Face ID / Touch ID über Safari Keychain
- Session hält 7 Tage

## Was ist das?
Eine Date-Ideen App für **Nick & Solli** - ein Pärchen aus Hamburg. Die App zeigt Date-Vorschläge mit Kalender, 3D-Globus für Reiseziele, und einen Date Builder.

## Repo & Hosting
- **GitHub**: github.com/NickHeymann/dasgro-edatebuch
- **Live**: nickheymann.github.io/dasgro-edatebuch
- **Hauptdatei**: `index.html`
- **Events**: `events.json`

## Projektstruktur (Modular)
```
├── index.html                      # Slim HTML (~400 Zeilen)
├── events.json                     # Alle Events mit Details
├── locations-database.json         # Restaurant/Bar/Aktivitäten-Datenbank
│
├── css/                            # CSS Module (via @import)
│   ├── variables.css               # CSS Custom Properties
│   ├── base.css                    # Reset, Cursor, Basis-Styles
│   ├── animations.css              # @keyframes Animationen
│   ├── layout.css                  # → importiert layout/*.css
│   │   └── layout/
│   │       ├── book.css            # Buch-Animation
│   │       ├── nav.css             # Navigation, Tabs
│   │       └── utilities.css       # Search, Grids, Containers
│   ├── components.css              # → importiert components/*.css
│   │   └── components/
│   │       ├── buttons.css         # Buttons, Badges
│   │       ├── cards.css           # → importiert cards/*.css
│   │       │   └── cards/
│   │       │       ├── event-cards.css    # date-card, combo-parts
│   │       │       ├── travel-cards.css   # travel-card, strava, komoot
│   │       │       └── content-cards.css  # recipe-card, recommendation
│   │       └── forms.css           # Inputs, Modals, Thumbs
│   └── pages.css                   # → importiert pages/*.css
│       └── pages/
│           ├── memories.css        # Book Intro, Polaroid-Galerie
│           ├── globe.css           # 3D-Globus, Travel Stats
│           ├── profile.css         # → importiert profile/*.css
│           │   └── profile/
│           │       ├── counter.css      # Partner-Counter
│           │       ├── milestones.css   # Meilensteine
│           │       ├── cards.css        # Profile Cards, Wishlists
│           │       └── questions.css    # Daily Questions, Love Languages
│           ├── avatar.css          # Avatar Creator
│           ├── builder.css         # Date Builder, Travel Diary
│           ├── features.css        # Kochen, Calendar, Achievements
│           ├── widgets.css         # Lightbox, Wetter, AI Insights
│           ├── overlays.css        # Special Modals
│           └── recipes.css         # Rezept-Modals
│
├── js/                             # ES6 JavaScript Module
│   ├── app.js                      # Entry Point
│   ├── config.js                   # Konstanten, Settings
│   ├── utils.js                    # Hilfsfunktionen
│   ├── storage.js                  # localStorage Wrapper
│   ├── auth.js                     # Login/Session
│   ├── navigation.js               # Tabs, Routing
│   ├── events.js                   # Event-Daten & Filter
│   ├── events-render.js            # Event-Card Rendering
│   ├── calendar.js                 # Kalender
│   ├── date-builder.js             # Date Builder Core
│   ├── date-builder-map.js         # Date Builder Karte
│   ├── date-builder-export.js      # WhatsApp/Calendar Export
│   ├── roulette.js                 # Zufalls-Date
│   ├── globe.js                    # 3D-Globus
│   ├── globe-controls.js           # Globus Mouse/Touch
│   ├── memories.js                 # Polaroid-Galerie
│   ├── weather.js                  # Wetter-Widget
│   ├── strava.js                   # Strava OAuth + Aktivitäten
│   ├── komoot.js                   # Komoot OAuth + Touren
│   ├── logger.js                   # Zentrales Logging (Debug-Levels)
│   ├── error-handler.js            # Globale Fehlerbehandlung
│   └── types.d.ts                  # TypeScript Typ-Definitionen
│
├── jsconfig.json                   # JS/TS IDE-Integration
├── sw.js                           # Service Worker (Offline-Support)
│
├── memories/                       # Fotos
├── scraper/                        # Event-Scraper
├── tokens/                         # Design Tokens (JSON)
│   ├── base.json                   # Spacing, Radius, Typography
│   ├── theme-romantic.json         # Romantic Theme (Default)
│   ├── theme-modern.json           # Modern Theme
│   └── theme-playful.json          # Playful Theme
├── scripts/
│   └── build-tokens.js             # Token → CSS Transformer
├── package.json                    # NPM Scripts
└── CLAUDE.md                       # Diese Datei
```

## Design System (NEU!)

### Schnell Themes wechseln
- **Keyboard**: `⌘+Shift+K` (Mac) / `Ctrl+Shift+K` (Windows) öffnet Theme Preview Panel
- **Console**: `window.setDesignTheme('modern')` oder `window.cycleDesignTheme()`
- **Verfügbare Themes**: `romantic`, `modern`, `playful`

### Neues Theme erstellen
1. Erstelle `tokens/theme-[name].json` (kopiere `theme-romantic.json` als Vorlage)
2. Passe Farben an
3. Führe `npm run build:tokens` aus
4. Theme ist verfügbar!

### Token-Struktur
```json
{
  "color": {
    "primary": { "base": "#f472b6", "dark": "#ec4899", "light": "#fce7f3" },
    "secondary": { ... },
    "background": { "base": "#fafafa", "gradient": "linear-gradient(...)" },
    "text": { "primary": "#1f2937", "secondary": "#6b7280" }
  },
  "effect": { "blur": "blur(20px)", "buttonGlow": "0 0 20px rgba(...)" }
}
```

### NPM Scripts
```bash
npm run build:tokens  # Generiert CSS aus JSON Tokens
npm run serve         # Startet lokalen Server auf Port 8080
npm run validate      # Prüft JS-Syntax aller Module
```

## Architektur-Prinzipien
- **Modularer Code**: Jede Datei < 300 Zeilen (LLM-freundlich)
- **ES6 Module**: `import/export` statt globaler Variablen
- **Single Entry Point**: `js/app.js` importiert alle Module
- **CSS Custom Properties**: Farben/Spacing in `variables.css`
- **JSDoc + TypeScript**: Typ-Definitionen in `types.d.ts` für IDE-Autocompletion
- **Service Worker**: Offline-First mit Cache-Strategien
- **Zentrales Logging**: Debug-Levels über `logger.js`

## Modul-Abhängigkeiten (Dependency Graph)

```
app.js (Entry Point)
├── logger.js           (keine deps) ← Wird von allen Modulen importiert
├── error-handler.js    → logger.js
├── storage.js          → logger.js
├── utils.js            (keine deps)
├── auth.js             → storage.js
├── events.js           → storage.js, utils.js, logger.js
├── navigation.js       → events.js
├── calendar.js         → events.js, utils.js
├── weather.js          → logger.js
├── globe.js            → logger.js (Three.js extern)
├── memories.js         → storage.js
├── roulette.js         → events.js
├── strava.js           → logger.js, storage.js, utils.js
├── komoot.js           → logger.js, utils.js
└── date-builder.js     → events.js, storage.js, utils.js
```

### Initialisierungsreihenfolge (WICHTIG!)
1. `errorHandler.init()` - Globale Fehlerbehandlung aktivieren
2. `auth.checkSession()` - Login prüfen
3. `events.init()` - Events laden (andere Module brauchen diese Daten!)
4. `navigation.init(allEvents)` - Navigation + Events übergeben
5. `calendar.init(allEvents)` - Kalender mit Events
6. `weather.init()`, `memories.init()`, `dateBuilder.init()` - unabhängig
7. `strava.init()`, `komoot.init()` - Fitness-Integrationen (Demo-Modus ohne Server)

### Globale Window-Objekte
```javascript
window.debugApp = { storage, utils, events, navigation, calendar, globe, memories }
window.enterApp()        // App von Intro aus öffnen
window.scrollToTop()     // Nach oben scrollen
window.closeModal(id)    // Modal schließen
window.toggleTheme()     // Dark/Light Mode

// Logger
window.logger            // Logger-Instanz
window.setDebugLevel(n)  // Debug-Level setzen (0-4)
window.getErrorLog()     // Fehler-Log abrufen

// Fitness-Integrationen
window.connectStrava()   // Strava OAuth starten
window.disconnectStrava()
window.connectKomoot()   // Komoot OAuth starten
window.disconnectKomoot()
```

## Arbeiten mit der modularen Struktur

### Neue Funktion hinzufügen
1. Passendes Modul finden (z.B. `js/calendar.js` für Kalender-Features)
2. Funktion im Modul implementieren
3. Falls nötig: Export in `app.js` hinzufügen

### CSS ändern
1. Richtige CSS-Datei wählen:
   - Farben/Spacing → `css/variables.css`
   - Neue Komponente → `css/components.css`
   - Seitenspezifisch → `css/pages.css`
   - Animation → `css/animations.css`

### Debugging
- Browser DevTools: Network-Tab zeigt welche Module geladen werden
- Console-Fehler zeigen Modul-Pfad an
- `window.debugApp` enthält alle Module (für Console-Debugging)
- Beispiel: `window.debugApp.events.getAll()` zeigt alle Events

### Logger System
Zentrales Logging mit Debug-Levels (0-4):
```javascript
// In Browser Console:
window.setDebugLevel(4);  // 0=off, 1=errors, 2=warnings, 3=info, 4=debug

// Oder via localStorage:
localStorage.setItem('debugLevel', '4');

// Verwendung in Modulen:
import logger from './logger.js';
logger.error('ModulName', 'Fehler!', errorObject);
logger.warn('ModulName', 'Warnung');
logger.info('ModulName', 'Info-Nachricht');
logger.debug('ModulName', 'Debug-Details', data);
logger.success('ModulName', 'Erfolgreich!');
```

### Error Handler
Globale Fehlerbehandlung mit Fallback-UI:
```javascript
import { safeInit, withErrorBoundary } from './error-handler.js';

// Sichere Modul-Initialisierung:
await safeInit('ModulName', () => modul.init());

// Async-Funktionen mit Fehlergrenze:
const safeFetch = withErrorBoundary(fetchData, fallbackValue);
```

### Service Worker
Offline-Support mit drei Cache-Strategien:
- **Cache-First**: Statische Assets (HTML, CSS, JS)
- **Network-First**: API-Calls (Wetter, Strava, Komoot)
- **Stale-While-Revalidate**: JSON-Daten (events.json)

Manuell aktualisieren:
```javascript
// Cache leeren:
navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });

// Cache-Größe abfragen:
const { size } = await new Promise(resolve => {
    const channel = new MessageChannel();
    channel.port1.onmessage = e => resolve(e.data);
    navigator.serviceWorker.controller.postMessage(
        { type: 'GET_CACHE_SIZE' },
        [channel.port2]
    );
});
```

## Validierungs-Checkliste (nach Code-Änderungen)

### 1. JS Syntax prüfen
```bash
for f in js/*.js; do node --check "$f"; done
```

### 2. HTML onclick-Handler prüfen
```bash
# Liste alle onclick-Handler in HTML:
grep -oh 'onclick="[^"]*"' index.html | sed 's/onclick="//;s/"$//' | grep -oE '^[a-zA-Z_][a-zA-Z0-9_]*' | sort | uniq

# Prüfe ob alle als window.* exportiert sind:
grep -oh "window\.[a-zA-Z]*" js/*.js | sort | uniq
```

### 3. Import/Export Konsistenz
```bash
# Alle imports:
grep -h "^import" js/*.js | sort | uniq

# Alle exports:
grep -h "^export" js/*.js | sort | uniq
```

### 4. Lokaler Test
```bash
python3 -m http.server 8080
# Dann http://localhost:8080 im Browser öffnen
```

## Bekannte technische Schulden
- `css/pages/recipes.css` (320 Zeilen) leicht über 300-Zeilen-Limit
- Alle JS-Module sind unter 280 Zeilen (größte: navigation.js 274, app.js 278)
- Strava/Komoot benötigen Server-Backend für echte OAuth Token-Exchange (derzeit Demo-Modus)
- Stand: 08.12.2025 - Code-Audit durchgeführt: utils.js 308→77, strava.js 300→61, komoot.js 289→61, error-handler.js 265→78, sw.js 361→111

## Event-Struktur
Jedes Event hat:
- `id`, `emoji`, `title`, `date`, `category`
- `location`, `address`, `coords` (für Karte)
- `link` (Ticketshop), `time`, `price`
- `restaurant` (Name, Type, Address, Link, empfehlung) - empfehlung enthält konkrete Gerichte von der Karte!
- `bar` (Name, Type, Address, Link) - kann auch Array mit mehreren Bars sein!
- Optional: `endDate` (für Dauerevents), `treatment` (für Wellness)

## Kategorien
- musical, variete, theater, comedy
- musik, wellness, aktiv, handwerk, essen, shows

## Features
1. **Kalender** - Events nach Datum anzeigen
2. **Date Builder** - Aktivität + Essen + Drinks planen mit WhatsApp/Kalender-Export
3. **3D Globus** - Reiseziele mit Tagebuch-Funktion (Three.js + earcut für Polygon-Triangulation)
4. **Karte** - Events auf OpenStreetMap anzeigen
5. **Hamster-Cursor** - Solli liebt Hamster! Der Cursor ist ein süßer Hamster.
6. **Buch-Animation** - Die App öffnet sich wie ein Buch beim Laden
7. **Feierabend-Toggle** - "Solli hat frei ab:" Dropdown für Zeitfilterung (nur bei handwerk, aktiv, wellness, comedy, essen, shows)
8. **Multi-Bar Auswahl** - Im Date Builder können mehrere Bars ausgewählt werden
9. **Memories/Erinnerungen** - Polaroid-Galerie mit bearbeitbaren Titeln (werden in localStorage gespeichert)
10. **ÖPNV-Route** - Button "🚇 Route ab Arbeit" öffnet Google Maps mit ÖPNV-Modus von Sollis Arbeit zum Date

## Sollis Arbeitsweg (WICHTIG!)
- **Sollis Arbeit**: Stadtdeich 5, 20097 Hamburg
- **Frühester Feierabend**: 17:00 Uhr (variiert: 17:00, 17:30, 18:00)
- **Transport**: Öffis (HVV) im Winter, Fahrrad/Emmy nur bei >10°C und <30 Min Fahrt
- Der "🚇 Route ab Arbeit" Button im Date Builder öffnet Google Maps ÖPNV-Route mit:
  - Start: Stadtdeich 5, Hamburg
  - Ziel: Erstes Ziel des Dates (Restaurant wenn vorher, sonst Aktivität)
- **Hinweis**: HVV Geofox URLs funktionieren nicht zuverlässig (Parameter werden nicht übernommen), daher Google Maps

## Technische Details

### Globe (3D Weltkarte)
- Verwendet Three.js für 3D-Rendering
- Länder werden mit earcut-Library trianguliert
- **WICHTIG**: `earcut(flatCoords, null, 2)` - der dritte Parameter `2` ist für 2D-Koordinaten nötig!
- Fallback auf Fan-Triangulation wenn earcut fehlschlägt

### Memories/Erinnerungen
- `memoriesData` im Code enthält Default-Titel
- **WICHTIG**: User kann Titel bearbeiten - diese werden in localStorage gespeichert
- **NIEMALS** die memoriesData-Titel im Code überschreiben - User-Anpassungen gehen sonst verloren!

### Feierabend-Toggle
- Zeigt nur Events an, die nach der gewählten Zeit starten
- Nur sichtbar bei bestimmten Kategorien: `['handwerk', 'aktiv', 'wellness', 'comedy', 'essen', 'shows']`
- Bei Travel, Memories etc. versteckt

### ÖPNV-Routenplanung (Google Maps)
- Funktion `openTransitConnection()` öffnet Google Maps mit ÖPNV-Modus
- URL-Format: `https://www.google.com/maps/dir/[Start]/[Ziel]/?travelmode=transit`
- Start: Sollis Arbeit (Stadtdeich 5, 20097 Hamburg)
- Ziel: Erstes Ziel des Dates (Restaurant wenn vorher, sonst Aktivität)
- **Hinweis**: HVV Geofox URL-Parameter funktionieren nicht zuverlässig, daher Google Maps

## Regelmäßige Aufgaben

### Events updaten
Wenn Nick sagt "Update die Events":
1. Nach neuen Events in Hamburg recherchieren (Konzerte, Theater, Comedy, Wellness, etc.)
2. Neue Events zu `events.json` hinzufügen (mit Restaurant + Bar!)
3. **Restaurant-Empfehlungen**: Konkrete vegetarische Gerichte von der aktuellen Karte recherchieren!
4. `node deduplicate-events.js` ausführen
5. Committen und pushen

### Locations-Datenbank prüfen
Die `locations-database.json` enthält alle Restaurants, Bars und Aktivitäten mit Öffnungszeiten. Bei jedem größeren Update:
1. Prüfe ob die Locations noch existieren (Google Maps/Website)
2. Aktualisiere Öffnungszeiten wenn nötig
3. Bei dauerhaft geschlossenen Orten: `"status": "geschlossen"` hinzufügen
4. Zeige dem User eine Warnung wenn ein Ort geschlossen ist

## Content-Filter (WICHTIG!)
Nick & Solli möchten KEINE:
- **Rap-Konzerte** (kein SSIO, kein HipHop)
- **Jazz-Events**
- **Fleisch-Restaurants** (keine Steakhäuser wie Block House)
- **Outdoor-Events im Winter** (es ist kalt!)
- **Weihnachtsmärkte**
- **Ketten-Restaurants** (kein Vapiano, Starbucks, Balzac Coffee etc.)
- **Cafés als Restaurant-Empfehlung** (Cafés sind keine Restaurants!)

Stattdessen bevorzugen sie:
- Vegetarische/vegane Restaurants (Einzelläden!)
- Indoor-Aktivitäten
- Wellness & Spa
- Musicals, Theater, Comedy
- Elektronische Musik, Indie, Rock
- **Aktive Dates**: Bouldern, Klettern, Laufkurse (Solli trainiert für Marathon 2026!)

## Aktive Date-Ideen (Sollis Marathon-Training)
Solli trainiert für einen Marathon! Passende Dates:
- **Laufwerk Hamburg**: Marathontraining (So 10h), Tempotraining (Mi 19h), Lauf-ABC
- **HHSC Laufgruppe**: Anfängerkurs Mo 19:15 im Stadtpark
- **Nordwandhalle**: Schnupperklettern, Einsteigerkurs (Wilhelmsburg - nah an Sollis Arbeit!)
- **FLASHH**: Spontan Bouldern ohne Anmeldung (Bahrenfeld)

## Event-Quellen für Recherche
- hamburg.de/kultur
- elbphilharmonie.de
- st-pauli-theater.de
- hamburger-kammerspiele.de
- stage-entertainment.de (Musicals)
- quatsch-comedy-club.de
- eventim.de
- Wellness: wellnest.me, heavenlyspahamburg.de, das-hamam.de
- Partys: ohschonhell.de, heuteinhamburg.de
- Aktiv: nordwandhalle.de, flashh.de, laufwerk-hamburg.de, hhsc.de
- Handwerk: goldschmiedekurs-hamburg.de, coopgold.de, studioamun.com

## Stil der App
- Romantisch, pastellfarben
- Rose (#e8b4b8), Sage (#a8c5a0), Blush (#f5e6e8)
- Deutsche Sprache
- Emojis willkommen
- Hamster-Cursor überall (größer bei klickbaren Elementen)

## Kontakt
Nick Heymann - der Entwickler und Nutzer der App zusammen mit Solli.

## Safety-Regeln für Git-Operationen durch LLM

- Arbeite NIEMALS direkt auf dem Branch `main`, sondern immer auf Feature-/Fix-Branches (z.B. `feature/...`, `fix/...`, `refactor/...`).
- Führe KEIN `git reset --hard`, KEIN `git push --force` und KEIN Löschen von Branches oder Tags aus, außer es wird explizit und eindeutig vom Nutzer angeordnet.
- Vor größeren Refactorings oder riskanten Änderungen:
  - Erstelle einen neuen Branch (z.B. `refactor/<kurze-beschreibung>`).
  - Setze einen Snapshot-Tag (z.B. `snapshot-YYYYMMDD-HHMM`) auf den letzten stabilen Commit.
  - Pushe den aktuellen Stand des Branches auf `origin`.
- Beschreibe im Commit-Text klar, was geändert wurde (z.B. „refactor: split monolithic file into modules"), damit der Verlauf nachvollziehbar bleibt.
