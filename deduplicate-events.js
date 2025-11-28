#!/usr/bin/env node
/**
 * Dedupliziert events.json automatisch
 *
 * Ausführen mit: node deduplicate-events.js
 *
 * Das Skript:
 * 1. Liest events.json
 * 2. Entfernt Duplikate basierend auf ID und Titel+Location+Datum
 * 3. Validiert die Daten (Pflichtfelder, Format)
 * 4. Speichert die bereinigten Events zurück
 */

const fs = require('fs');
const path = require('path');

const EVENTS_FILE = path.join(__dirname, 'events.json');

// Pflichtfelder für jedes Event
const REQUIRED_FIELDS = ['id', 'emoji', 'title', 'date', 'category', 'location'];

// Gültige Kategorien
const VALID_CATEGORIES = ['musical', 'variete', 'theater', 'comedy', 'musik', 'wellness', 'aktiv', 'handwerk', 'essen'];

function loadEvents() {
    try {
        const data = fs.readFileSync(EVENTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ Fehler beim Lesen von events.json:', error.message);
        process.exit(1);
    }
}

function validateEvent(event, index) {
    const errors = [];
    const warnings = [];

    // Pflichtfelder prüfen
    REQUIRED_FIELDS.forEach(field => {
        if (!event[field]) {
            errors.push(`Fehlendes Pflichtfeld: ${field}`);
        }
    });

    // Kategorie prüfen
    if (event.category && !VALID_CATEGORIES.includes(event.category)) {
        warnings.push(`Unbekannte Kategorie: ${event.category}`);
    }

    // Datum-Format prüfen (YYYY-MM-DD)
    if (event.date && !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
        errors.push(`Ungültiges Datumsformat: ${event.date} (erwartet: YYYY-MM-DD)`);
    }

    // Koordinaten prüfen
    if (event.coords) {
        if (!Array.isArray(event.coords) || event.coords.length !== 2) {
            warnings.push('Coords sollten ein Array mit [lat, lng] sein');
        }
    }

    // Link prüfen
    if (event.link && !event.link.startsWith('http')) {
        warnings.push(`Link sollte mit http(s) beginnen: ${event.link}`);
    }

    return { errors, warnings };
}

function deduplicateEvents(events) {
    const uniqueIds = new Set();
    const uniqueContentKeys = new Set();
    const duplicates = [];
    const uniqueEvents = [];

    events.forEach((event, index) => {
        // Prüfe ID-Duplikate
        if (uniqueIds.has(event.id)) {
            duplicates.push({ index, reason: 'Doppelte ID', id: event.id, title: event.title });
            return;
        }

        // Prüfe Inhaltsduplikate (gleicher Titel + Location + Datum)
        const contentKey = `${event.title}|${event.location}|${event.date}`.toLowerCase();
        if (uniqueContentKeys.has(contentKey)) {
            duplicates.push({ index, reason: 'Doppelter Inhalt', id: event.id, title: event.title, date: event.date });
            return;
        }

        uniqueIds.add(event.id);
        uniqueContentKeys.add(contentKey);
        uniqueEvents.push(event);
    });

    return { uniqueEvents, duplicates };
}

function saveEvents(data) {
    try {
        fs.writeFileSync(EVENTS_FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
        console.log('✅ events.json erfolgreich gespeichert!');
    } catch (error) {
        console.error('❌ Fehler beim Speichern:', error.message);
        process.exit(1);
    }
}

// Hauptfunktion
function main() {
    console.log('🔍 Lade events.json...\n');

    const data = loadEvents();
    const events = data.events || [];

    console.log(`📋 ${events.length} Events gefunden\n`);

    // Validierung
    console.log('🔎 Validiere Events...\n');
    let totalErrors = 0;
    let totalWarnings = 0;

    events.forEach((event, index) => {
        const { errors, warnings } = validateEvent(event, index);

        if (errors.length > 0 || warnings.length > 0) {
            console.log(`Event #${index + 1}: ${event.title || 'Unbekannt'} (${event.id || 'keine ID'})`);

            errors.forEach(err => {
                console.log(`   ❌ ${err}`);
                totalErrors++;
            });

            warnings.forEach(warn => {
                console.log(`   ⚠️  ${warn}`);
                totalWarnings++;
            });
        }
    });

    if (totalErrors === 0 && totalWarnings === 0) {
        console.log('✅ Alle Events sind valide!\n');
    } else {
        console.log(`\n📊 Validierung: ${totalErrors} Fehler, ${totalWarnings} Warnungen\n`);
    }

    // Deduplizierung
    console.log('🧹 Dedupliziere Events...\n');
    const { uniqueEvents, duplicates } = deduplicateEvents(events);

    if (duplicates.length > 0) {
        console.log(`🗑️  ${duplicates.length} Duplikate gefunden:\n`);
        duplicates.forEach(dup => {
            console.log(`   - ${dup.title} (${dup.id}) - ${dup.reason}`);
        });
        console.log('');

        // Speichern
        data.events = uniqueEvents;
        saveEvents(data);

        console.log(`\n📊 Ergebnis: ${events.length} → ${uniqueEvents.length} Events (${duplicates.length} entfernt)`);
    } else {
        console.log('✅ Keine Duplikate gefunden!\n');
        console.log(`📊 ${uniqueEvents.length} einzigartige Events`);
    }

    // Statistiken
    console.log('\n📈 Kategorie-Statistiken:');
    const categoryStats = {};
    uniqueEvents.forEach(e => {
        categoryStats[e.category] = (categoryStats[e.category] || 0) + 1;
    });
    Object.entries(categoryStats)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => {
            console.log(`   ${cat}: ${count} Events`);
        });
}

main();
