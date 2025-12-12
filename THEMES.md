# Das große Datebuch - Design Themes

## Übersicht

Das große Datebuch verfügt über **4 verschiedene Design-Varianten**, die alle die gleiche Funktionalität bieten, aber unterschiedliche Farbschemata verwenden.

## Verfügbare Themes

### 1. ❄️ Original (Winter Scene)
**URL:** `http://91.99.177.238:3005/`

Das **Originaldesign** mit Winterszene (Schneemann ⛄, Schneeballwurf, Buch-Animation).

**Farbschema:**
- Hauptfarben: Rose (#e8b4b8), Sage (#8fbc8f), Gold (#d4a574)
- Hintergrund: Ice Blue → Cream Gradient
- Stil: Romantisch, warm, verspielt

### 2. 🎨 Modern Theme
**URL:** `http://91.99.177.238:3005/modern/`

Minimalistisches, cleanes Design mit modernen Farben.

**Farbschema:**
- Hauptfarben: Indigo (#6366f1), Sky Blue (#0ea5e9), Purple (#8b5cf6)
- Hintergrund: Light Blue → Grey Gradient
- Stil: Modern, minimalistisch, clean

### 3. 🎉 Playful Theme
**URL:** `http://91.99.177.238:3005/playful/`

Buntes, verspieltes Design mit kräftigen Farben.

**Farbschema:**
- Hauptfarben: Teal (#14b8a6), Orange (#f97316), Rose (#f43f5e)
- Hintergrund: Warm Yellow → Orange Gradient
- Stil: Bunt, energiegeladen, verspielt

### 4. 🍂 Cozy Theme
**URL:** `http://91.99.177.238:3005/cozy/`

Warmes, gemütliches Design mit Herbstfarben.

**Farbschema:**
- Hauptfarben: Amber (#d97706), Red (#dc2626), Brown (#92400e)
- Hintergrund: Warm Yellow → Golden Gradient
- Stil: Warm, gemütlich, herbstlich

## Technische Details

### Architektur
Alle Themes basieren auf dem **monolithischen Original** (eb9aa62):
- Jedes Theme ist eine vollständige Kopie der originalen `index.html` (6521 Zeilen)
- Alle CSS und JavaScript sind inline (keine externen Dateien)
- Jedes Theme hat eigene Kopien von `events.json`, `locations-database.json` und `memories/`

### CSS-Variablen
Die Themes unterscheiden sich nur in den CSS Custom Properties im `:root`:
```css
:root {
    --cream: ...
    --sage: ...
    --rose: ...
    --gold: ...
    /* etc. */
}
```

### Deployment
Die Themes werden über Nginx als statische Dateien bereitgestellt:
```
/usr/share/nginx/html/
├── index.html              # Original
├── events.json
├── locations-database.json
├── memories/
├── modern/
│   ├── index.html
│   ├── events.json
│   ├── locations-database.json
│   └── memories/
├── playful/
│   └── ...
└── cozy/
    └── ...
```

## Neues Theme erstellen

1. Kopiere das Original oder ein bestehendes Theme:
```bash
cp -r index.html newtheme/index.html
cp events.json newtheme/
cp locations-database.json newtheme/
cp -r memories/ newtheme/
```

2. Bearbeite `newtheme/index.html` und passe die CSS-Variablen an:
```css
:root {
    /* 🎨 New Theme - Beschreibung */
    --cream: #...;
    --sage: #...;
    --rose: #...;
    --gold: #...;
    /* ... weitere Farben ... */
}
```

3. Aktualisiere Titel und Meta-Tags:
```html
<title>Das große Datebuch ❄️ - New Theme</title>
<meta name="theme-color" content="#...">
```

4. Füge das Theme zum Dockerfile hinzu:
```dockerfile
COPY newtheme/ /usr/share/nginx/html/newtheme/
```

5. Committe und deploye:
```bash
git add newtheme/
git commit -m "feat: Add new theme"
ssh root@91.99.177.238 "cd /opt/apps/datebuch && ./deploy.sh"
```

## Wichtig: Original bewahren

⚠️ **Das Original NIEMALS überschreiben!**

- Das Original liegt unter `/` (root) und ist **geschützt**
- Permanenter Git-Tag: `original-winter-scene-v1.0`
- Permanenter Branch: `original-design-preserve`
- Bei Problemen: `git checkout original-winter-scene-v1.0`

## GitHub Pages

Die Themes werden auch über GitHub Pages bereitgestellt:
- Original: `https://nickheymann.github.io/dasgro-edatebuch/`
- Modern: `https://nickheymann.github.io/dasgro-edatebuch/modern/`
- Playful: `https://nickheymann.github.io/dasgro-edatebuch/playful/`
- Cozy: `https://nickheymann.github.io/dasgro-edatebuch/cozy/`

## Service Worker Cache

Bei Theme-Wechseln kann es zu Problemen mit dem Service Worker Cache kommen. **Lösung:**

1. DevTools öffnen (F12)
2. Application → Service Workers → "Unregister"
3. Application → Cache Storage → Alle Caches löschen
4. Hard Refresh (Cmd+Shift+R / Ctrl+Shift+R)

Oder: Incognito-Modus verwenden für sauberen Test.

## Fragen?

Siehe auch:
- `CLAUDE.md` - Projektdokumentation
- `DEPLOYMENT.md` - Deployment-Anleitung
- `README.md` - Allgemeine Infos
