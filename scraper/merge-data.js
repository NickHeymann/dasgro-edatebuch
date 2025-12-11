/**
 * MERGE SCRIPT
 * Fügt gescrapte Daten in die Hauptdatenbanken ein
 *
 * Verwendung: node merge-data.js
 */

const fs = require('fs');
const path = require('path');

// Pfade
const SCRAPER_DIR = __dirname;
const PROJECT_DIR = path.join(__dirname, '..');

const FILES = {
    // Gescrapte Daten
    scrapedRestaurants: path.join(SCRAPER_DIR, 'scraped-restaurants.json'),
    scrapedBars: path.join(SCRAPER_DIR, 'scraped-bars.json'),
    scrapedWellness: path.join(SCRAPER_DIR, 'scraped-wellness.json'),
    scrapedCafes: path.join(SCRAPER_DIR, 'scraped-cafes.json'),
    scrapedActivities: path.join(SCRAPER_DIR, 'scraped-activities.json'),
    scrapedEvents: path.join(SCRAPER_DIR, 'scraped-events.json'),

    // Ziel-Datenbanken
    locationsDb: path.join(PROJECT_DIR, 'locations-database.json'),
    eventsDb: path.join(PROJECT_DIR, 'events.json')
};

// Farben für Console
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m'
};

function log(msg, color = 'reset') {
    console.log(`${colors[color]}${msg}${colors.reset}`);
}

// JSON sicher laden
function loadJSON(filepath) {
    try {
        if (!fs.existsSync(filepath)) {
            return null;
        }
        return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    } catch (e) {
        log(`  Fehler beim Laden: ${filepath}`, 'red');
        return null;
    }
}

// JSON speichern
function saveJSON(filepath, data) {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
}

// Deduplizierung nach Name (case-insensitive)
function deduplicateByName(existing, newItems) {
    const existingNames = new Set(
        existing.map(item => item.name.toLowerCase().trim())
    );

    const added = [];
    for (const item of newItems) {
        const nameLower = item.name.toLowerCase().trim();
        if (!existingNames.has(nameLower)) {
            existingNames.add(nameLower);
            added.push(item);
        }
    }

    return added;
}

// Locations mergen (Restaurants, Bars, etc.)
function mergeLocations() {
    log('\n═══════════════════════════════════════════', 'blue');
    log('📍 LOCATIONS MERGEN', 'blue');
    log('═══════════════════════════════════════════', 'blue');

    // Lade bestehende Datenbank
    let locationsDb = loadJSON(FILES.locationsDb);
    if (!locationsDb) {
        log('Erstelle neue locations-database.json', 'yellow');
        locationsDb = {
            restaurants: [],
            bars: [],
            wellness: [],
            cafes: [],
            activities: []
        };
    }

    let totalAdded = 0;

    // Restaurants
    const scrapedRestaurants = loadJSON(FILES.scrapedRestaurants);
    if (scrapedRestaurants?.restaurants_new) {
        const added = deduplicateByName(
            locationsDb.restaurants || [],
            scrapedRestaurants.restaurants_new
        );
        if (added.length > 0) {
            locationsDb.restaurants = [...(locationsDb.restaurants || []), ...added];
            log(`  ✓ +${added.length} Restaurants`, 'green');
            totalAdded += added.length;
        } else {
            log(`  • Restaurants: keine neuen`, 'yellow');
        }
    }

    // Bars
    const scrapedBars = loadJSON(FILES.scrapedBars);
    if (scrapedBars?.bars_new) {
        const added = deduplicateByName(
            locationsDb.bars || [],
            scrapedBars.bars_new
        );
        if (added.length > 0) {
            locationsDb.bars = [...(locationsDb.bars || []), ...added];
            log(`  ✓ +${added.length} Bars`, 'green');
            totalAdded += added.length;
        } else {
            log(`  • Bars: keine neuen`, 'yellow');
        }
    }

    // Wellness
    const scrapedWellness = loadJSON(FILES.scrapedWellness);
    if (scrapedWellness?.wellness_new) {
        const added = deduplicateByName(
            locationsDb.wellness || [],
            scrapedWellness.wellness_new
        );
        if (added.length > 0) {
            locationsDb.wellness = [...(locationsDb.wellness || []), ...added];
            log(`  ✓ +${added.length} Wellness`, 'green');
            totalAdded += added.length;
        } else {
            log(`  • Wellness: keine neuen`, 'yellow');
        }
    }

    // Cafés
    const scrapedCafes = loadJSON(FILES.scrapedCafes);
    if (scrapedCafes?.cafes_new) {
        const added = deduplicateByName(
            locationsDb.cafes || [],
            scrapedCafes.cafes_new
        );
        if (added.length > 0) {
            locationsDb.cafes = [...(locationsDb.cafes || []), ...added];
            log(`  ✓ +${added.length} Cafés`, 'green');
            totalAdded += added.length;
        } else {
            log(`  • Cafés: keine neuen`, 'yellow');
        }
    }

    // Aktivitäten
    const scrapedActivities = loadJSON(FILES.scrapedActivities);
    if (scrapedActivities?.activities_new) {
        const added = deduplicateByName(
            locationsDb.activities || [],
            scrapedActivities.activities_new
        );
        if (added.length > 0) {
            locationsDb.activities = [...(locationsDb.activities || []), ...added];
            log(`  ✓ +${added.length} Aktivitäten`, 'green');
            totalAdded += added.length;
        } else {
            log(`  • Aktivitäten: keine neuen`, 'yellow');
        }
    }

    // Speichern
    if (totalAdded > 0) {
        locationsDb.lastUpdated = new Date().toISOString();
        saveJSON(FILES.locationsDb, locationsDb);
        log(`\n📊 Gesamt: +${totalAdded} neue Locations hinzugefügt`, 'green');
    } else {
        log(`\n📊 Keine neuen Locations`, 'yellow');
    }

    return totalAdded;
}

// Events mergen
function mergeEvents() {
    log('\n═══════════════════════════════════════════', 'blue');
    log('📅 EVENTS MERGEN', 'blue');
    log('═══════════════════════════════════════════', 'blue');

    // Lade bestehende Events
    let eventsDb = loadJSON(FILES.eventsDb);
    if (!eventsDb) {
        log('Erstelle neue events.json', 'yellow');
        eventsDb = { events: [] };
    }

    const scrapedEvents = loadJSON(FILES.scrapedEvents);
    if (!scrapedEvents?.events_new) {
        log('  • Keine gescrapten Events gefunden', 'yellow');
        return 0;
    }

    // Existierende Event-IDs / Titel sammeln
    const existingKeys = new Set(
        eventsDb.events.map(e => `${e.date}-${e.title?.toLowerCase().substring(0, 30)}`)
    );

    // Neue Events hinzufügen
    const added = [];
    for (const event of scrapedEvents.events_new) {
        // Generiere ID falls nicht vorhanden
        if (!event.id) {
            const slug = event.title
                .toLowerCase()
                .replace(/[äöü]/g, c => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue' }[c]))
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
                .substring(0, 30);
            event.id = `${event.date}-${slug}`;
        }

        // Emoji hinzufügen falls nicht vorhanden
        if (!event.emoji) {
            const emojis = {
                'musik': '🎵', 'theater': '🎭', 'comedy': '😂', 'musical': '🎤',
                'variete': '🎪', 'wellness': '🧖', 'aktiv': '🏃', 'essen': '🍽️',
                'handwerk': '🎨', 'shows': '✨'
            };
            event.emoji = emojis[event.category] || '📅';
        }

        const key = `${event.date}-${event.title?.toLowerCase().substring(0, 30)}`;
        if (!existingKeys.has(key)) {
            existingKeys.add(key);
            added.push(event);
        }
    }

    if (added.length > 0) {
        eventsDb.events = [...eventsDb.events, ...added];

        // Nach Datum sortieren
        eventsDb.events.sort((a, b) => a.date.localeCompare(b.date));

        saveJSON(FILES.eventsDb, eventsDb);
        log(`  ✓ +${added.length} Events hinzugefügt`, 'green');
    } else {
        log(`  • Keine neuen Events`, 'yellow');
    }

    return added.length;
}

// Hauptfunktion
function main() {
    log('\n════════════════════════════════════════════════', 'blue');
    log('🔄 DATEBUCH MERGE SCRIPT', 'blue');
    log(`📅 ${new Date().toLocaleString('de-DE')}`, 'blue');
    log('════════════════════════════════════════════════', 'blue');

    const locationsAdded = mergeLocations();
    const eventsAdded = mergeEvents();

    log('\n════════════════════════════════════════════════', 'blue');
    log('✅ MERGE ABGESCHLOSSEN', 'green');
    log(`   +${locationsAdded} Locations`, 'green');
    log(`   +${eventsAdded} Events`, 'green');
    log('════════════════════════════════════════════════\n', 'blue');
}

main();
