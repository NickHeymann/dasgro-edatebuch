# Datebuch - Master Feature Liste

Diese Datei dokumentiert alle Features, die in beiden Versionen der App verfügbar sein sollen.
Beide Versionen haben ihr eigenes Design/UX, aber die gleiche Funktionalität.

## Versionen

| Version | Datei | Design | Status |
|---------|-------|--------|--------|
| Classic | `index.html` | Hell, romantisch, Glasmorphism, Buch-Animation | ✅ Komplett |
| Modern | `datebuch-modern.html` | Dunkel, minimalistisch, Inter Font | 🔄 In Arbeit |

---

## Core Features (Beide Versionen)

### 1. Event-Management
- [x] Events aus `events.json` laden
- [x] Events nach Kategorie filtern
- [x] Events nach Datum filtern (Feierabend-Toggle)
- [x] Event-Details anzeigen
- [x] Events liken/disliken
- [x] Vergangene Events ausblenden
- [x] Countdown zu Events anzeigen

### 2. Kategorien
- [x] Shows (Musical, Varieté, Theater, Musik)
- [x] Comedy
- [x] Wellness
- [x] Aktiv (Sport, Klettern, Laufen)
- [x] Handwerk (Workshops, DIY)
- [x] Essen (Restaurant-Tipps)

### 3. Kalender
- [x] Monatsansicht
- [x] Mini-Kalender Navigation
- [x] Events pro Tag anzeigen
- [x] Zum aktuellen Monat springen

### 4. Date Builder
- [x] Event auswählen
- [x] Restaurant auswählen (vorher/nachher)
- [x] Bar(s) auswählen (Multi-Select)
- [x] Budget berechnen
- [x] WhatsApp teilen
- [x] Kalender-Export (.ics)
- [x] ÖPNV-Route von Sollis Arbeit

### 5. 3D Globus & Reisen
- [x] Interaktiver Three.js Globus
- [x] Reiseziele markieren
- [x] Tagebuch pro Reiseziel
- [x] Visited/Wishlist Status
- [x] Strava Integration (Demo)
- [x] Komoot Integration (Demo)
- [x] Aktivitäts-Routen auf Globus
- [x] Flight Paths Animation

### 6. Memories/Erinnerungen
- [x] Polaroid-Galerie
- [x] Lightbox für Fotos
- [x] Titel bearbeiten (localStorage)
- [x] User-Fotos hochladen

### 7. Budget Tracker
- [x] Monatsbudget setzen
- [x] Ausgaben hinzufügen
- [x] Fortschrittsbalken
- [x] Kategorien für Ausgaben

### 8. Bucket List
- [x] Items hinzufügen
- [x] Items abhaken
- [x] Items löschen
- [x] Fortschritt anzeigen

### 9. Smart Features (NEU)
- [x] Smart Recommendations (KI-basiert)
- [x] Mystery Date (Zufalls-Date)
- [x] Post-Date Rating (1-5 Herzen)
- [x] Achievements System
- [x] Love Letters
- [x] Couple Sync (Demo)

### 10. PWA & Offline
- [x] Service Worker
- [x] Offline-Modus
- [x] Install Banner
- [x] Offline-Indikator

### 11. UI/UX
- [x] Dark Mode Toggle
- [x] Bottom Navigation (Mobile)
- [x] Back-to-Top Button
- [x] Toast Notifications
- [x] Hamster Cursor (Classic only)
- [x] Buch-Animation (Classic only)
- [x] Schneeflocken/Eiszapfen (Classic only)

### 12. Wetter & AI
- [x] Wetter-Anzeige
- [x] Wetter-basierte Vorschläge
- [x] AI Insights (OpenAI-ready)

### 13. Jahresrückblick
- [x] Date-Statistiken
- [x] Top-Kategorien
- [x] Lieblings-Locations

### 14. Suche
- [x] Event-Suche
- [x] Autocomplete
- [x] Schnellnavigation

### 15. Daten-Management
- [x] Export (JSON)
- [x] Import (JSON)
- [x] localStorage Persistenz

---

## Feature-Status pro Version

| Feature | Classic (index.html) | Modern (datebuch-modern.html) |
|---------|---------------------|------------------------------|
| Event-Management | ✅ | ✅ |
| Kategorien | ✅ | ✅ |
| Kalender | ✅ | ✅ |
| Date Builder | ✅ | ❌ |
| 3D Globus | ✅ | ❌ |
| Memories | ✅ | ❌ |
| Budget Tracker | ✅ | ❌ |
| Bucket List | ✅ | ❌ |
| Smart Features | ✅ | 🔄 (teilweise) |
| PWA | ✅ | ❌ |
| Dark Mode | ✅ | ✅ (default dark) |
| Bottom Nav | ✅ | ❌ |
| Wetter | ✅ | ❌ |
| Jahresrückblick | ✅ | ❌ |
| Suche | ✅ | ❌ |
| Export/Import | ✅ | ✅ |

---

## Design-Unterschiede

### Classic Version (`index.html`)
- **Farbschema**: Rose, Sage, Blush, Pastelltöne
- **Font**: Cormorant Garamond + Quicksand
- **Stil**: Romantisch, verspielt, Glasmorphism
- **Besonderheiten**:
  - Buch-Animation beim Öffnen
  - Hamster-Cursor
  - Schneeflocken & Eiszapfen
  - Nick & Solli Schneeball-Animation

### Modern Version (`datebuch-modern.html`)
- **Farbschema**: Slate, Rose Accent, Dark Mode First
- **Font**: Inter
- **Stil**: Minimalistisch, clean, card-based
- **Besonderheiten**:
  - Kompakte Cards
  - Quick-Actions
  - Stats Dashboard
  - Schnelle Navigation

---

## Sync-Strategie

Wenn Features hinzugefügt werden:
1. Feature in `index.html` implementieren
2. Feature in `datebuch-modern.html` mit eigenem Design adaptieren
3. Diese Datei aktualisieren
4. Beide Versionen testen

## Shared Resources

Beide Versionen nutzen:
- `events.json` - Event-Daten
- `locations-database.json` - Restaurant/Bar-Daten
- `manifest.json` - PWA Manifest
- `sw.js` - Service Worker
- `memories/` - Foto-Ordner
