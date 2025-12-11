# JavaScript Refactoring Guide

## Overview
The original `index.html` contains over 7000 lines of inline JavaScript that needs to be split into ES6 modules.

## Current Progress
✅ config.js - COMPLETE (constants, data, venue database)
✅ storage.js - COMPLETE (localStorage abstraction)
✅ utils.js - COMPLETE (helper functions)

## Remaining Modules to Create

### auth.js
**Functions to extract from index.html:**
- Login/logout functionality
- Password hashing (simple hash)
- Session management
- Face ID / Touch ID integration (if applicable)

**Key functions:**
- `login(password)`
- `logout()`
- `checkAuth()`
- `hashPassword(password)`

---

### events.js
**Functions to extract:**
- Load events from events.json
- Filter events by category, date, feierabend time
- Render event cards
- Handle ratings (thumbs up/down)
- Favorites and exclusions
- Event roulette
- Past event detection

**Key functions:**
- `loadEvents()` - Fetch from events.json
- `renderEvents(category, filters)`
- `filterByFeierabend(events, time)`
- `renderEventCard(event)`
- `rateEvent(eventId, rating)`
- `getRandomEvent(category)`
- `isPastEvent(event)`

---

### navigation.js
**Functions to extract:**
- Category switching
- Tab management
- Search functionality
- Feierabend toggle
- More menu (dropdown)
- Sticky navigation
- Back to top button

**Key functions:**
- `showCategory(categoryName)`
- `setupNavigation()`
- `handleSearch(query)`
- `toggleFeierabend(time)`
- `setupStickyNav()`

---

### calendar.js
**Functions to extract:**
- Mini calendar rendering
- Month navigation
- Date selection
- Event indicators on calendar
- Today highlighting

**Key functions:**
- `renderMiniCalendar(month, year)`
- `navigateMonth(direction)`
- `selectDate(date)`
- `getEventsForDate(date)`
- `highlightToday()`

---

### weather.js
**Functions to extract:**
- Weather widget
- Weather API integration (if any)
- Weather details panel
- Weather-based suggestions

**Key functions:**
- `fetchWeather(location)`
- `renderWeatherWidget(data)`
- `showWeatherDetails()`
- `getWeatherSuggestion(weatherData)`

---

### globe.js
**Functions to extract:**
- 3D globe with Three.js
- Country/city markers
- Visited vs wishlist locations
- Globe interactions (zoom, rotate)
- Marker clicking
- Street map fallback
- Triangulation with earcut

**Key functions:**
- `initGlobe()`
- `addMarkers(destinations)`
- `renderGlobe()`
- `handleGlobeClick(location)`
- `zoomToLocation(lat, lon)`
- `triangulateCountry(coordinates)` - Uses earcut
- `switchToStreetMap(location)`

---

### memories.js
**Functions to extract:**
- Photo gallery rendering
- Lightbox functionality
- Caption editing (stored in localStorage)
- Photo navigation
- Add new memories

**Key functions:**
- `renderMemories()`
- `openLightbox(memoryId)`
- `navigateLightbox(direction)`
- `editCaption(memoryId, newCaption)`
- `addMemory(image, caption)`

---

### strava.js
**Functions to extract:**
- Strava OAuth flow
- Strava API integration
- Activity fetching
- Activity display
- Disconnect Strava

**Key functions:**
- `connectStrava()`
- `handleStravaCallback(code)`
- `fetchStravaActivities()`
- `renderStravaActivities(activities)`
- `disconnectStrava()`

---

### komoot.js
**Functions to extract:**
- Komoot OAuth flow
- Komoot API integration
- Tour fetching
- Tour display
- Disconnect Komoot

**Key functions:**
- `connectKomoot()`
- `handleKomootCallback(code)`
- `fetchKomootTours()`
- `renderKomootTours(tours)`
- `disconnectKomoot()`

---

### app.js (Entry Point)
**Main initialization:**
- Import all modules
- DOMContentLoaded handler
- Initialize all features
- Setup event listeners
- Check authentication
- Show/hide book intro

**Structure:**
```javascript
import * as config from './config.js';
import * as storage from './storage.js';
import * as utils from './utils.js';
import * as auth from './auth.js';
import * as events from './events.js';
import * as navigation from './navigation.js';
import * as calendar from './calendar.js';
import * as weather from './weather.js';
import * as globe from './globe.js';
import * as memories from './memories.js';
import * as strava from './strava.js';
import * as komoot from './komoot.js';

document.addEventListener('DOMContentLoaded', () => {
    // Check auth
    if (!auth.checkAuth()) {
        auth.showLoginModal();
        return;
    }

    // Initialize all modules
    navigation.init();
    events.init();
    calendar.init();
    weather.init();
    globe.init();
    memories.init();
    strava.init();
    komoot.init();

    // Check book intro
    if (!storage.hasSeenIntro()) {
        showBookIntro();
    }
});
```

---

## Additional Modules (If Needed)

### dateBuilder.js
Date planning flow with activity + restaurant + bar selection

### planned.js
Planned dates management

### partner.js
Partner profile features

### achievements.js
Achievement system

### recipes.js
Recipe management and OCR scanning

---

## How to Complete the Refactoring

### Step 1: Extract Function Blocks
Use this command to extract specific function blocks:
```bash
awk '/^        function functionName/,/^        }/' index.html
```

### Step 2: Identify Global Variables
Look for `let` and `const` declarations that need to be module-scoped

### Step 3: Find Event Listeners
Search for:
- `addEventListener`
- `onclick=`
- `document.getElementById`

### Step 4: Export Functions
Make functions `export function` for public API
Keep internal helpers private (no export)

### Step 5: Update index.html
Replace `<script>` with:
```html
<script type="module" src="js/app.js"></script>
```

---

## Important Notes

⚠️ **NEVER modify memoriesData captions in code** - user edits are stored in localStorage

⚠️ **Preserve all existing functionality** - this is a refactor, not a rewrite

⚠️ **Use ES6 modules** with import/export

⚠️ **Keep dependencies clear** - each module should import what it needs

⚠️ **Three.js and earcut** are external libraries loaded via CDN - import them properly

---

## Testing Checklist

After refactoring, test:
- [ ] Book opening animation
- [ ] Login/logout
- [ ] Event loading and filtering
- [ ] Date builder flow
- [ ] 3D globe interactions
- [ ] Memory lightbox
- [ ] Strava/Komoot OAuth
- [ ] Calendar navigation
- [ ] Search functionality
- [ ] Favorites/ratings/exclusions
- [ ] Weather widget
- [ ] Mobile responsiveness
- [ ] Hamster cursor works everywhere

---

## File Structure
```
Solli Datebuch/
├── index.html (updated with <script type="module">)
├── events.json
├── locations-database.json
├── memories/
└── js/
    ├── config.js ✅
    ├── storage.js ✅
    ├── utils.js ✅
    ├── auth.js
    ├── events.js
    ├── navigation.js
    ├── calendar.js
    ├── weather.js
    ├── globe.js
    ├── memories.js
    ├── strava.js
    ├── komoot.js
    └── app.js
```
