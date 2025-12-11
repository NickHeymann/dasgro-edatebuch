# JavaScript Modules - Datebuch App

## Overview

The JavaScript code has been extracted from `index.html` and split into 13 ES6 modules for better organization and maintainability.

## Module Structure

### ✅ Complete Modules

1. **config.js** - All configuration, constants, and static data
   - Storage keys
   - Memories data
   - Travel destinations
   - Venue database (restaurants, bars, cafes)
   - Default events
   - Solli's work location for ÖPNV routing

2. **storage.js** - localStorage abstraction
   - Load/save app data
   - Ratings, favorites, exclusions
   - Memory captions (user-editable)
   - OSM venue caching
   - Session management

3. **utils.js** - Utility functions
   - Date formatting
   - Distance calculations (Haversine)
   - Toast notifications
   - Opening hours parsing
   - Venue status checking (open/closed)
   - Debounce, ID generation

### 🚧 Skeleton Modules (Need Implementation)

These modules have the correct structure and function signatures but need the full implementation extracted from `index.html`:

4. **auth.js** - Authentication
5. **events.js** - Event management (partially complete)
6. **navigation.js** - Navigation and tabs
7. **calendar.js** - Mini calendar
8. **weather.js** - Weather widget
9. **globe.js** - 3D globe with Three.js
10. **memories.js** - Photo gallery (partially complete)
11. **strava.js** - Strava OAuth and API
12. **komoot.js** - Komoot OAuth and API
13. **app.js** - Main entry point (structure complete)

## How to Complete the Refactoring

### Step 1: Extract Remaining Functions

The original `index.html` contains over 7000 lines of JavaScript. Use the extraction script:

```bash
cd "/Users/nickheymann/Desktop/Mein Business/Programmierprojekte/Solli Datebuch"

# Extract JavaScript to temp file (already done)
awk '/<script>$/,/<\/script>/' index.html > /tmp/extracted_js.txt

# Find specific functions
grep -n "function functionName" /tmp/extracted_js.txt
```

### Step 2: Fill in TODO Markers

Each skeleton module has `// TODO:` comments indicating what needs to be extracted. Search for these:

```bash
grep -r "TODO:" js/
```

### Step 3: Test Each Module

After implementing each module:

1. Check imports/exports are correct
2. Test functionality in browser console
3. Verify no global variables leaked
4. Ensure backward compatibility

### Step 4: Update index.html

Replace the `<script>` block in `index.html` with:

```html
<script type="module" src="js/app.js"></script>
```

Remove all inline JavaScript between `<script>` and `</script>`.

## Important Notes

### ⚠️ Preserved Functionality

- **Memory Captions**: User edits are stored in localStorage, NOT in code
- **Hamster Cursor**: CSS-based, no JS changes needed
- **Winter Scene**: Interactive elements on book cover
- **3D Globe**: Uses Three.js and earcut for polygon triangulation
- **OAuth Flows**: Strava and Komoot authentication

### 🔍 Global Exports

Some functions are temporarily exported to `window` for backward compatibility:

```javascript
window.rateEvent = rateEvent;
window.toggleEventFavorite = toggleEventFavorite;
window.openLightbox = openLightbox;
```

These should be removed once all onclick handlers are migrated to event delegation.

### 📦 Dependencies

External libraries loaded via CDN (keep in index.html):
- Three.js (r128) - 3D globe
- topojson-client - Country data
- earcut - Polygon triangulation
- Leaflet - Street maps
- Tesseract.js - OCR (if used)

## Testing Checklist

Before deploying:

- [ ] Book opening animation works
- [ ] Login/logout functions
- [ ] Events load from events.json
- [ ] Category switching works
- [ ] Search functionality
- [ ] Feierabend time filter
- [ ] Date builder flow
- [ ] 3D globe renders and rotates
- [ ] Globe markers clickable
- [ ] Memory lightbox opens/closes
- [ ] Memory caption editing saves
- [ ] Calendar navigation
- [ ] Weather widget displays
- [ ] Strava OAuth flow (if configured)
- [ ] Komoot OAuth flow (if configured)
- [ ] Ratings save and persist
- [ ] Favorites toggle
- [ ] "Nope" exclusions work
- [ ] Dark mode toggle
- [ ] Mobile responsive
- [ ] Hamster cursor visible

## File Sizes

```
config.js    ~10 KB  (complete)
storage.js   ~5 KB   (complete)
utils.js     ~6 KB   (complete)
auth.js      ~2 KB   (skeleton)
events.js    ~8 KB   (partial)
navigation.js ~2 KB  (skeleton)
calendar.js  ~2 KB   (skeleton)
weather.js   ~2 KB   (skeleton)
globe.js     ~3 KB   (skeleton)
memories.js  ~3 KB   (partial)
strava.js    ~2 KB   (skeleton)
komoot.js    ~2 KB   (skeleton)
app.js       ~6 KB   (complete)
```

Total: ~50 KB (will be ~150 KB when fully implemented)

## Next Steps

1. **Priority 1**: Complete `events.js` - most critical functionality
2. **Priority 2**: Complete `globe.js` - complex Three.js code
3. **Priority 3**: Complete `navigation.js` and `calendar.js`
4. **Priority 4**: Fill in remaining modules
5. **Priority 5**: Remove global window exports
6. **Priority 6**: Migrate inline onclick handlers to event delegation

## Development Tips

### Debugging

Access modules in browser console:

```javascript
window.debugApp.storage.loadData()
window.debugApp.events.allEvents
window.debugApp.config.VENUE_DATABASE
```

### Hot Reload

Use a local dev server with hot reload:

```bash
npx http-server . -p 8080 -c-1
```

### Module Testing

Test individual modules:

```javascript
import * as events from './js/events.js';
console.log(events.filterEvents(events.allEvents));
```

## Questions?

See `REFACTORING_GUIDE.md` for detailed extraction instructions.
