# Datebuch - Feature Dokumentation

**Stand:** 2025-12-12
**Aktuelle Version:** Original Winter Scene (monolithic)

---

## 📱 Aktuelle Versionen

| Version | Status | Datei | Zeilen | Design |
|---------|--------|-------|--------|--------|
| ❄️ **Original** | ✅ Live | `index.html` | 6521 | Romantisch, Winter Scene, Glassmorphism |
| 🎨 Modern (color) | ⚠️ Nur Farbvariation | `modern/index.html` | 6521 | Indigo/Sky Blue/Purple |
| 🎉 Playful (color) | ⚠️ Nur Farbvariation | `playful/index.html` | 6521 | Teal/Orange/Rose |
| 🍂 Cozy (color) | ⚠️ Nur Farbvariation | `cozy/index.html` | 6521 | Amber/Red/Brown |

**Hinweis:** Die aktuellen "Varianten" (modern/playful/cozy) sind nur CSS-Farbänderungen, keine echten Design-Varianten. Siehe `DESIGN-VARIANTS-PLAN.md` für geplante echte Varianten.

---

## 🎯 Features der Original-Version

### 1. Event-Management ✅
- Events aus `events.json` laden (129 KB, ~80 Events)
- Kategoriefilter: Musical, Varieté, Theater, Comedy, Musik, Wellness, Aktiv, Handwerk, Essen, Shows
- Datumsfilter mit "Feierabend-Toggle" (17:00, 17:30, 18:00 Uhr)
- Event-Details Modal
- Like/Dislike System (localStorage)
- Vergangene Events automatisch ausblenden
- Countdown zu kommenden Events

### 2. Kalender ✅
- Monatsansicht mit Event-Dots
- Mini-Kalender Navigation
- Events pro Tag anzeigen
- "Zum aktuellen Monat springen" Button
- Dark Mode Support

### 3. Date Builder ✅
- Event auswählen aus Kalender/Liste
- Restaurant auswählen (vorher/nachher)
- Multi-Bar-Auswahl (mehrere Bars möglich)
- Budget automatisch berechnen
- WhatsApp-Share (formatierter Text)
- Kalender-Export (.ics Download)
- ÖPNV-Route von Sollis Arbeit (Google Maps Transit)
- Leaflet Map Integration (OpenStreetMap)

### 4. 3D Globus & Reisen ✅
- Interaktiver Three.js Globus
- Reiseziele markieren (visited/wishlist)
- Tagebuch pro Reiseziel (localStorage)
- Flight Paths Animation
- Polygon Triangulation (earcut.js)
- Strava Integration (Demo-Modus, kein Server)
- Komoot Integration (Demo-Modus, kein Server)

### 5. Memories/Erinnerungen ✅
- Polaroid-Galerie (15 Fotos)
- Lightbox für Fotos
- Titel bearbeiten (localStorage-persisted)
- **WICHTIG:** User-Änderungen werden gespeichert!

### 6. UI/UX Besonderheiten ✅
- **Buch-Animation:** App öffnet sich wie ein Buch
- **Winter Scene:** Schneemann ⛄, Schneeball-Wurf, Schnee-Hügel
- **Hamster-Cursor:** Solli liebt Hamster!
- **Glassmorphism:** Frosted glass effects
- **Dark Mode:** Toggle mit localStorage
- **Responsive Design:** Mobile-optimiert
- **Scroll-to-Top Button**

### 7. Smart Features ✅
- Mystery Date (Zufalls-Date Generator)
- Wetter-Widget (OpenWeatherMap API)
- Offline-Support (Service Worker)

### 8. Daten-Management ✅
- localStorage Persistenz
- Events: `events.json` (shared resource)
- Locations: `locations-database.json` (shared resource)

---

## 📊 Datenstruktur

### events.json
```json
{
  "id": "musical-frozen-2025-12-15",
  "emoji": "🎭",
  "title": "Frozen - Das Musical",
  "date": "2025-12-15",
  "category": "musical",
  "location": "Stage Theater an der Elbe",
  "address": "Norderelbstraße 6, 20457 Hamburg",
  "coords": { "lat": 53.5406, "lng": 9.9851 },
  "link": "https://stage-entertainment.de",
  "time": "19:30",
  "price": "€89",
  "restaurant": {
    "name": "Vlet",
    "type": "Norddeutsch, vegetarisch",
    "address": "Am Sandtorkai 23, 20457 Hamburg",
    "link": "https://vlet.de",
    "empfehlung": "Grünkohl-Ravioli, Rote Bete Carpaccio"
  },
  "bar": [
    {
      "name": "Le Lion Bar",
      "type": "Cocktailbar",
      "address": "Rathausstraße 3, 20095 Hamburg",
      "link": "https://lelion.net"
    }
  ]
}
```

### locations-database.json
```json
{
  "restaurants": [
    {
      "id": "vlet-hamburg",
      "name": "Vlet",
      "type": "Norddeutsch, vegetarisch",
      "address": "Am Sandtorkai 23, 20457 Hamburg",
      "coords": { "lat": 53.5406, "lng": 9.9851 },
      "link": "https://vlet.de",
      "hours": "Mo-So 12:00-23:00",
      "status": "offen"
    }
  ],
  "bars": [...],
  "activities": [...]
}
```

---

## 🏗️ Technische Architektur

### Monolithisches HTML
Die Original-Version ist eine **einzige HTML-Datei** (6521 Zeilen) mit:
- Inline CSS (im `<style>` Tag)
- Inline JavaScript (im `<script>` Tag)
- Keine externen CSS/JS-Dateien (außer CDN-Libraries)

### Externe Dependencies (CDN)
```html
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond...&display=swap">

<!-- Three.js (3D Globe) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- TopoJSON (Map Data) -->
<script src="https://cdn.jsdelivr.net/npm/topojson-client@3"></script>

<!-- Earcut (Polygon Triangulation) -->
<script src="https://cdn.jsdelivr.net/npm/earcut@2.2.4/dist/earcut.min.js"></script>

<!-- Leaflet (Maps) -->
<link href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

### Shared Resources
- `events.json` - Event-Datenbank (129 KB)
- `locations-database.json` - Location-Datenbank (42 KB)
- `memories/` - Foto-Ordner (15 JPG/PNG Dateien)
- `sw.js` - Service Worker (Offline-Support)
- `manifest.json` - PWA Manifest

### localStorage Keys
```javascript
localStorage.setItem('datebuch-theme', 'dark'); // Dark Mode
localStorage.setItem('datebuch-likes', JSON.stringify({})); // Event Likes
localStorage.setItem('datebuch-memoryTitles', JSON.stringify({})); // Memory Titles
localStorage.setItem('datebuch-travelJournal', JSON.stringify({})); // Travel Diary
```

---

## 🔐 Login/Security

### Login
- Passwort: `nicksolli2025`
- Session: 7 Tage (localStorage)
- Face ID/Touch ID: Safari Keychain (automatisch)

---

## 🌍 Deployment

### Hetzner VPS (Port 3005)
```
URL: http://91.99.177.238:3005/
Container: datebuch (Nginx Alpine)
Status: ✅ Running (19 hours uptime)
Health Check: ✅ Passing
```

### GitHub Pages
```
URL: https://nickheymann.github.io/dasgro-edatebuch/
Branch: main
Deploy: Automatisch bei Push
```

### Git Tags
- `original-winter-scene-v1.0` - Permanent backup (commit eb9aa62)
- `snapshot-before-themes-20251212` - Vor Theme-Erstellung

---

## 📝 Bekannte Einschränkungen

### Modulare Version (veraltet)
Es gibt im Repo noch Reste einer alten modularen Refactoring-Version:
- `css/` - Ordner (nicht verwendet im Original)
- `js/` - Ordner (nicht verwendet im Original)
- `tokens/` - Design Tokens (nicht verwendet)

**Diese Dateien sind NICHT Teil der deployed Version!**

### Demo-Features (kein Backend)
- **Strava Integration:** Funktioniert nur im Demo-Modus (keine echten OAuth Tokens)
- **Komoot Integration:** Funktioniert nur im Demo-Modus
- **Couple Sync:** localStorage-only (kein Real-Time Sync)

### Service Worker Caching
Bei Updates kann es zu Problemen mit dem Service Worker Cache kommen.
**Lösung:** DevTools → Application → Service Workers → "Unregister" → Hard Refresh

---

## 🚀 Geplante Erweiterungen

Siehe `DESIGN-VARIANTS-PLAN.md` für detaillierte Planung von 4 echten Design-Varianten:

1. **🃏 Swipe Mode** (Tinder-Style)
2. **📅 Timeline Mode** (TripIt-Style)
3. **📰 Feed Mode** (Eventbrite-Style)
4. **📱 Dashboard Mode** (Cupla-Style)

---

## 📚 Weitere Dokumentation

- `CLAUDE.md` - Projektbriefing für Claude (Coding-Standards, Features, Tech Stack)
- `DEPLOYMENT.md` - Deployment-Anleitung (Docker, Hetzner)
- `THEMES.md` - Theme-System Dokumentation (Farbvarianten)
- `DESIGN-VARIANTS-PLAN.md` - ULTRATHINK Plan für echte Design-Varianten
- `REFACTORING_STATUS.md` - Status der alten Refactoring-Versuche (veraltet)
