# Datebuch - Projektbriefing für Claude

## Was ist das?
Eine Date-Ideen App für **Nick & Solli** - ein Pärchen aus Hamburg. Die App zeigt Date-Vorschläge mit Kalender, 3D-Globus für Reiseziele, und einen Date Builder.

## Repo & Hosting
- **GitHub**: github.com/NickHeymann/dasgro-edatebuch
- **Live**: nickheymann.github.io/dasgro-edatebuch
- **Hauptdatei**: `index.html`
- **Events**: `events.json`

## Wichtige Dateien
```
├── index.html                      # Hauptapp (HTML + CSS + JS)
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
