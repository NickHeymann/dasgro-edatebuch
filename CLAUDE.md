# Datebuch - Projektbriefing für Claude

## Was ist das?
Eine Date-Ideen App für **Nick & Solli** - ein Pärchen aus Hamburg. Die App zeigt Date-Vorschläge mit Kalender, 3D-Globus für Reiseziele, und einen Date Builder.

## Repo & Hosting
- **GitHub**: github.com/NickHeymann/dasgro-edatebuch
- **Live**: nickheymann.github.io/dasgro-edatebuch
- **Hauptdatei**: `das-grosse-datebuch-v10.html`
- **Events**: `events.json`

## Wichtige Dateien
```
├── das-grosse-datebuch-v10.html   # Hauptapp (HTML + CSS + JS)
├── events.json                     # Alle Events mit Details
├── locations-database.json         # Restaurant/Bar/Aktivitäten-Datenbank mit Öffnungszeiten
├── deduplicate-events.js           # Node-Script für Deduplizierung
├── memories/                       # Fotos für Erinnerungen-Sektion
└── CLAUDE.md                       # Diese Datei
```

## Event-Struktur
Jedes Event hat:
- `id`, `emoji`, `title`, `date`, `category`
- `location`, `address`, `coords` (für Karte)
- `link` (Ticketshop), `time`, `price`
- `restaurant` (Name, Type, Address, Link)
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

## Regelmäßige Aufgaben

### Events updaten
Wenn Nick sagt "Update die Events":
1. Nach neuen Events in Hamburg recherchieren (Konzerte, Theater, Comedy, Wellness, etc.)
2. Neue Events zu `events.json` hinzufügen (mit Restaurant + Bar!)
3. `node deduplicate-events.js` ausführen
4. Committen und pushen

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

Stattdessen bevorzugen sie:
- Vegetarische/vegane Restaurants
- Indoor-Aktivitäten
- Wellness & Spa
- Musicals, Theater, Comedy
- Elektronische Musik, Indie, Rock

## Event-Quellen für Recherche
- hamburg.de/kultur
- elbphilharmonie.de
- st-pauli-theater.de
- hamburger-kammerspiele.de
- stage-entertainment.de (Musicals)
- quatsch-comedy-club.de
- eventim.de
- Wellness: wellnest.me, heavenlyspahamburg.de
- Partys: ohschonhell.de, heuteinhamburg.de

## Stil der App
- Romantisch, pastellfarben
- Rose (#e8b4b8), Sage (#a8c5a0), Blush (#f5e6e8)
- Deutsche Sprache
- Emojis willkommen
- Hamster-Cursor überall (größer bei klickbaren Elementen)

## Kontakt
Nick Heymann - der Entwickler und Nutzer der App zusammen mit Solli.
