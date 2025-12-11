/**
 * CRON RUNNER für Datebuch Auto-Scraper
 *
 * Führt den Scraper in regelmäßigen Abständen aus.
 *
 * Verwendung:
 * 1. Direkt: node cron-runner.js
 * 2. Als macOS LaunchAgent (siehe unten)
 * 3. Als crontab Eintrag
 */

const { runAllScrapers, updateEventsJson } = require('./auto-scraper');
const fs = require('fs');
const path = require('path');

// Log file für Scraping-History
const LOG_FILE = path.join(__dirname, 'scraper.log');

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  console.log(message);
  fs.appendFileSync(LOG_FILE, logMessage);
}

async function runWithLogging() {
  log('═══════════════════════════════════════════');
  log('SCHEDULED SCRAPING RUN STARTED');
  log('═══════════════════════════════════════════');

  try {
    const events = await runAllScrapers();

    if (events.length > 0) {
      const addedCount = await updateEventsJson(events);
      log(`SUCCESS: Added ${addedCount} new events`);
    } else {
      log('No new events found');
    }

  } catch (error) {
    log(`ERROR: ${error.message}`);
  }

  log('SCHEDULED SCRAPING RUN COMPLETED');
  log('');
}

// Run immediately
runWithLogging();

/**
 * SETUP INSTRUCTIONS:
 *
 * ═══════════════════════════════════════════
 * OPTION 1: macOS LaunchAgent (Empfohlen)
 * ═══════════════════════════════════════════
 *
 * 1. Erstelle Datei: ~/Library/LaunchAgents/com.datebuch.scraper.plist
 *
 * <?xml version="1.0" encoding="UTF-8"?>
 * <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
 * <plist version="1.0">
 * <dict>
 *     <key>Label</key>
 *     <string>com.datebuch.scraper</string>
 *     <key>ProgramArguments</key>
 *     <array>
 *         <string>/usr/local/bin/node</string>
 *         <string>/Users/nickheymann/Desktop/Mein Business/Programmierprojekte/Solli Datebuch/scraper/cron-runner.js</string>
 *     </array>
 *     <key>StartCalendarInterval</key>
 *     <array>
 *         <dict>
 *             <key>Hour</key>
 *             <integer>8</integer>
 *             <key>Minute</key>
 *             <integer>0</integer>
 *         </dict>
 *         <dict>
 *             <key>Hour</key>
 *             <integer>20</integer>
 *             <key>Minute</key>
 *             <integer>0</integer>
 *         </dict>
 *     </array>
 *     <key>StandardOutPath</key>
 *     <string>/Users/nickheymann/Desktop/Mein Business/Programmierprojekte/Solli Datebuch/scraper/scraper.log</string>
 *     <key>StandardErrorPath</key>
 *     <string>/Users/nickheymann/Desktop/Mein Business/Programmierprojekte/Solli Datebuch/scraper/scraper-error.log</string>
 * </dict>
 * </plist>
 *
 * 2. Aktivieren:
 *    launchctl load ~/Library/LaunchAgents/com.datebuch.scraper.plist
 *
 * 3. Deaktivieren:
 *    launchctl unload ~/Library/LaunchAgents/com.datebuch.scraper.plist
 *
 * ═══════════════════════════════════════════
 * OPTION 2: Crontab (Linux/macOS)
 * ═══════════════════════════════════════════
 *
 * Öffne crontab mit: crontab -e
 * Füge hinzu (läuft täglich um 8:00 und 20:00):
 *
 * 0 8,20 * * * /usr/local/bin/node "/Users/nickheymann/Desktop/Mein Business/Programmierprojekte/Solli Datebuch/scraper/cron-runner.js"
 *
 * ═══════════════════════════════════════════
 * OPTION 3: Manuell ausführen
 * ═══════════════════════════════════════════
 *
 * cd "/Users/nickheymann/Desktop/Mein Business/Programmierprojekte/Solli Datebuch/scraper"
 * npm run scrape
 *
 */
