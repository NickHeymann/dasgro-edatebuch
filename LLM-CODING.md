# LLM Coding Best Practices

Best Practices um Code LLM-freundlich zu strukturieren, damit Claude (oder andere LLMs) effizient arbeiten kann.

---

## 1. Dateigrößen-Limits

| Dateityp | Max. Zeilen | Grund |
|----------|-------------|-------|
| JavaScript/TypeScript | 200-300 | Vollständig im Context lesbar |
| CSS | 300-400 | Sections klar trennbar |
| HTML | 150-200 | Nur Struktur, keine Logik |
| Config/JSON | 100 | Schnell scannbar |

**Regel:** Wenn eine Datei > 300 Zeilen hat, aufteilen!

---

## 2. Modul-Struktur

```
/projekt
├── CLAUDE.md              # Projekt-Briefing (PFLICHT!)
├── LLM-CODING.md          # Diese Datei
├── index.html             # Nur HTML-Struktur
├── css/
│   ├── variables.css      # CSS Custom Properties
│   ├── base.css           # Reset, Typography
│   ├── components.css     # UI Komponenten
│   ├── layout.css         # Grid, Container
│   ├── pages.css          # Seiten-spezifisch
│   └── animations.css     # @keyframes
├── js/
│   ├── config.js          # Konstanten, API Keys
│   ├── storage.js         # localStorage
│   ├── utils.js           # Hilfsfunktionen
│   ├── [feature].js       # Ein Modul pro Feature
│   └── app.js             # Entry Point
└── api/                   # Backend (falls vorhanden)
    └── CLAUDE.md          # Eigenes Briefing
```

---

## 3. CLAUDE.md Struktur

Jedes Projekt/Modul braucht eine `CLAUDE.md`:

```markdown
# Projektname

## Was ist das?
[1-2 Sätze]

## Wichtige Dateien
[Liste mit Beschreibung]

## Architektur
[Wie hängen die Teile zusammen?]

## Konventionen
[Naming, Patterns, etc.]

## Häufige Tasks
[Was wird oft geändert?]

## Nicht anfassen!
[Was ist kritisch/fragil?]
```

---

## 4. Code-Konventionen für LLM

### Klare Naming Conventions
```javascript
// GUT: Selbsterklärend
function loadUserEvents() { ... }
const MAX_RETRY_COUNT = 3;

// SCHLECHT: Unklar
function doStuff() { ... }
const x = 3;
```

### Explizite Imports/Exports
```javascript
// GUT: Klar was importiert wird
import { formatDate, showToast } from './utils.js';
export { loadEvents, renderEvents };

// SCHLECHT: Wildcard
import * as utils from './utils.js';
```

### Kommentar-Header pro Datei
```javascript
/**
 * EVENTS MODULE
 *
 * Zuständig für:
 * - Event-Daten laden (events.json)
 * - Events rendern
 * - Rating-System
 *
 * Abhängigkeiten: config.js, storage.js, utils.js
 */
```

### Section-Kommentare
```javascript
// ═══════════════════════════════════════════
// EVENTS LADEN
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
// EVENTS RENDERN
// ═══════════════════════════════════════════
```

---

## 5. Vermeiden

### Mega-Dateien
```
❌ index.html (12.000 Zeilen)
✅ index.html + 6 CSS + 10 JS Dateien
```

### Inline-Styles und Scripts
```html
❌ <div style="color: red" onclick="doThing()">
✅ <div class="error-text" data-action="thing">
```

### Magic Strings/Numbers
```javascript
❌ localStorage.getItem('datebuch_v12')
✅ localStorage.getItem(Config.STORAGE_KEY)
```

### Zirkuläre Abhängigkeiten
```javascript
❌ A imports B, B imports A
✅ A imports B, B imports C, C is standalone
```

---

## 6. LLM-freundliche Patterns

### Config Object Pattern
```javascript
// config.js
export const Config = {
    STORAGE_KEY: 'datebuch_v12',
    API_URL: 'https://api.example.com',
    MAX_EVENTS: 100,
    CATEGORIES: ['wellness', 'aktiv', 'essen']
};
```

### Module Object Pattern
```javascript
// events.js
export const Events = {
    all: [],

    async load() { ... },
    getActive() { ... },
    render() { ... }
};
```

### Factory Functions
```javascript
// Statt Klassen mit viel State
export function createEventCard(event) {
    return `<div class="card">...</div>`;
}
```

---

## 7. Git Commits für LLM-Projekte

```bash
# Beschreibend, nicht zu kurz
✅ "Refactor: Split index.html into modular CSS/JS files"
✅ "Fix: Strava OAuth callback not saving token"

# Zu vage
❌ "Update code"
❌ "Fix bug"
```

---

## 8. Wann aufteilen?

**Sofort aufteilen wenn:**
- Datei > 300 Zeilen
- Mehr als 3 unabhängige Features in einer Datei
- Du öfter als 2x scrollen musst um zusammenhängenden Code zu sehen

**Zusammen lassen wenn:**
- Starke Kopplung (würde viele Cross-Imports erzeugen)
- < 100 Zeilen
- Nur von einer Stelle genutzt

---

## 9. Checkliste vor Commit

- [ ] Keine Datei > 300 Zeilen
- [ ] CLAUDE.md aktuell
- [ ] Alle Imports explizit
- [ ] Keine Magic Strings
- [ ] Kommentar-Header in neuen Dateien
- [ ] Config-Werte in config.js

---

*Erstellt: 08.12.2025*
