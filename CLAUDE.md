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
├── deduplicate-events.js           # Node-Script für Deduplizierung
└── CLAUDE.md                       # Diese Datei
```

## Event-Struktur
Jedes Event hat:
- `id`, `emoji`, `title`, `date`, `category`
- `location`, `address`, `coords` (für Karte)
- `link` (Ticketshop), `time`, `price`
- `restaurant` (Name, Type, Address, Link)
- `bar` (Name, Type, Address, Link)
- Optional: `endDate` (für Dauerevents), `treatment` (für Wellness)

## Kategorien
- musical, variete, theater, comedy
- musik, wellness, aktiv, handwerk

## Features
1. **Kalender** - Events nach Datum anzeigen
2. **Date Builder** - Aktivität + Essen + Drinks planen mit WhatsApp/Kalender-Export
3. **3D Globus** - Reiseziele mit Tagebuch-Funktion
4. **Karte** - Events auf OpenStreetMap anzeigen

## Regelmäßige Aufgaben
Wenn Nick sagt "Update die Events":
1. Nach neuen Events in Hamburg recherchieren (Konzerte, Theater, Comedy, Wellness, etc.)
2. Neue Events zu `events.json` hinzufügen (mit Restaurant + Bar!)
3. `node deduplicate-events.js` ausführen
4. Committen und pushen

## Event-Quellen für Recherche
- hamburg.de/kultur
- elbphilharmonie.de
- st-pauli-theater.de
- hamburger-kammerspiele.de
- stage-entertainment.de (Musicals)
- quatsch-comedy-club.de
- eventim.de
- Wellness: wellnest.me, heavenlyspahamburg.de

## Stil der App
- Romantisch, pastellfarben
- Rose (#e8b4b8), Sage (#a8c5a0), Blush (#f5e6e8)
- Deutsche Sprache
- Emojis willkommen

## Kontakt
Nick Heymann - der Entwickler und Nutzer der App zusammen mit Solli.
