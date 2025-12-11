/**
 * DATEBUCH AUTO-SCRAPER
 * Automatisches Scraping von Event-Seiten für das Datebuch
 *
 * Features:
 * - Anti-Detection (Random User-Agents, Delays, Proxy-Support)
 * - Mehrere Quellen: ohschonhell.de, heuteinhamburg.de, meetup.com
 * - Automatische Deduplizierung
 * - Cron-Job Support für regelmäßiges Scraping
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ============================================
// ANTI-DETECTION CONFIGURATION
// ============================================

const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'
];

const REFERERS = [
  'https://www.google.com/',
  'https://www.google.de/',
  'https://duckduckgo.com/',
  'https://www.bing.com/',
  'https://www.ecosia.org/',
  'https://www.hamburg.de/',
  ''
];

// Random delay between requests (2-8 seconds)
const getRandomDelay = () => Math.floor(Math.random() * 6000) + 2000;

// Random User-Agent
const getRandomUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

// Random Referer
const getRandomReferer = () => REFERERS[Math.floor(Math.random() * REFERERS.length)];

// Sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// HTTP CLIENT WITH ANTI-DETECTION
// ============================================

async function fetchWithAntiDetection(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const headers = {
      'User-Agent': getRandomUserAgent(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
      ...options.headers
    };

    const referer = getRandomReferer();
    if (referer) {
      headers['Referer'] = referer;
    }

    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers,
      timeout: 30000
    };

    const req = protocol.request(requestOptions, (res) => {
      let data = '';

      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).href;
        console.log(`  ↳ Redirect to: ${redirectUrl}`);
        return fetchWithAntiDetection(redirectUrl, options).then(resolve).catch(reject);
      }

      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        status: res.statusCode,
        data,
        headers: res.headers
      }));
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// ============================================
// SCRAPERS FOR DIFFERENT SOURCES
// ============================================

/**
 * Scrape ohschonhell.de - Hamburger Party & Club Events
 */
async function scrapeOhSchonHell() {
  console.log('\n🎉 Scraping ohschonhell.de...');
  const events = [];

  try {
    const response = await fetchWithAntiDetection('https://www.ohschonhell.de/hamburg');

    if (response.status !== 200) {
      console.log(`  ⚠️ Status: ${response.status}`);
      return events;
    }

    const html = response.data;

    // Extract events using regex patterns (no DOM parser needed)
    // Look for event blocks with date, title, location
    const eventPattern = /<article[^>]*class="[^"]*event[^"]*"[^>]*>([\s\S]*?)<\/article>/gi;
    const matches = html.matchAll(eventPattern);

    for (const match of matches) {
      const block = match[1];

      // Extract title
      const titleMatch = block.match(/<h[23][^>]*>(.*?)<\/h[23]>/i);
      const title = titleMatch ? cleanText(titleMatch[1]) : null;

      // Extract date
      const dateMatch = block.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
      let date = null;
      if (dateMatch) {
        date = `${dateMatch[3]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[1].padStart(2, '0')}`;
      }

      // Extract location
      const locationMatch = block.match(/location[^>]*>([^<]+)/i) ||
                           block.match(/<span[^>]*class="[^"]*venue[^"]*"[^>]*>([^<]+)/i);
      const location = locationMatch ? cleanText(locationMatch[1]) : null;

      // Extract link
      const linkMatch = block.match(/href="([^"]*ohschonhell[^"]*)"/i);
      const link = linkMatch ? linkMatch[1] : null;

      if (title && date && !isExcludedEvent(title)) {
        events.push({
          id: generateEventId(date, title),
          emoji: getCategoryEmoji('musik'),
          title: title,
          date: date,
          category: 'musik',
          description: `Party/Club Event in Hamburg`,
          location: location || 'Hamburg',
          address: 'Hamburg',
          coords: [53.5511, 9.9937],
          link: link || 'https://www.ohschonhell.de/hamburg',
          time: '23:00',
          price: 'tba',
          source: 'ohschonhell'
        });
      }
    }

    console.log(`  ✓ Found ${events.length} events`);
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}`);
  }

  return events;
}

/**
 * Scrape heuteinhamburg.de - Daily Hamburg Events
 */
async function scrapeHeuteInHamburg() {
  console.log('\n📅 Scraping heuteinhamburg.de...');
  const events = [];

  try {
    const response = await fetchWithAntiDetection('https://www.heuteinhamburg.de/');

    if (response.status !== 200) {
      console.log(`  ⚠️ Status: ${response.status}`);
      return events;
    }

    const html = response.data;

    // Extract event cards
    const eventPattern = /<div[^>]*class="[^"]*event-card[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
    const matches = html.matchAll(eventPattern);

    for (const match of matches) {
      const block = match[1];

      const titleMatch = block.match(/<h[234][^>]*>(.*?)<\/h[234]>/i);
      const title = titleMatch ? cleanText(titleMatch[1]) : null;

      const dateMatch = block.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
      let date = null;
      if (dateMatch) {
        date = `${dateMatch[3]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[1].padStart(2, '0')}`;
      }

      const categoryMatch = block.match(/category[^>]*>([^<]+)/i);
      const categoryText = categoryMatch ? categoryMatch[1].toLowerCase() : '';
      const category = mapCategory(categoryText);

      if (title && date && !isExcludedEvent(title)) {
        events.push({
          id: generateEventId(date, title),
          emoji: getCategoryEmoji(category),
          title: title,
          date: date,
          category: category,
          description: `Event in Hamburg`,
          location: 'Hamburg',
          address: 'Hamburg',
          coords: [53.5511, 9.9937],
          link: 'https://www.heuteinhamburg.de/',
          time: '19:00',
          price: 'tba',
          source: 'heuteinhamburg'
        });
      }
    }

    console.log(`  ✓ Found ${events.length} events`);
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}`);
  }

  return events;
}

/**
 * Scrape Meetup.com - Hamburg Events
 */
async function scrapeMeetup() {
  console.log('\n👥 Scraping meetup.com/cities/de/hamburg...');
  const events = [];

  try {
    // Meetup has strong bot protection, we need to be careful
    await sleep(getRandomDelay());

    const response = await fetchWithAntiDetection('https://www.meetup.com/cities/de/hamburg/', {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cookie': '' // Don't send cookies
      }
    });

    if (response.status !== 200) {
      console.log(`  ⚠️ Status: ${response.status} - Meetup may be blocking`);
      return events;
    }

    const html = response.data;

    // Meetup uses React, so we look for JSON data in script tags
    const jsonMatch = html.match(/__NEXT_DATA__[^>]*>(.*?)<\/script>/i);
    if (jsonMatch) {
      try {
        const jsonData = JSON.parse(jsonMatch[1]);
        // Navigate through Meetup's data structure
        const eventsData = jsonData?.props?.pageProps?.events || [];

        for (const event of eventsData) {
          if (!isExcludedEvent(event.title || event.name)) {
            events.push({
              id: generateEventId(event.dateTime || event.date, event.title || event.name),
              emoji: '👥',
              title: event.title || event.name,
              date: formatMeetupDate(event.dateTime || event.date),
              category: 'aktiv',
              description: truncate(event.description || 'Meetup Event in Hamburg', 100),
              location: event.venue?.name || 'Hamburg',
              address: event.venue?.address || 'Hamburg',
              coords: [
                event.venue?.lat || 53.5511,
                event.venue?.lon || 9.9937
              ],
              link: event.eventUrl || 'https://www.meetup.com/cities/de/hamburg/',
              time: formatMeetupTime(event.dateTime),
              price: event.feeSettings ? `${event.feeSettings.amount}€` : 'Kostenlos',
              source: 'meetup'
            });
          }
        }
      } catch (e) {
        console.log(`  ⚠️ Could not parse Meetup JSON`);
      }
    }

    console.log(`  ✓ Found ${events.length} events`);
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}`);
  }

  return events;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function cleanText(text) {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateEventId(date, title) {
  const slug = title
    .toLowerCase()
    .replace(/[äöü]/g, c => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue' }[c]))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30);
  return `${date}-${slug}`;
}

function isExcludedEvent(title) {
  const lowerTitle = title.toLowerCase();
  const exclusions = [
    'hip hop', 'hiphop', 'hip-hop', 'rap ',
    'jazz', 'swing',
    'weihnachtsmarkt', 'weihnachts-',
    'ssio', 'kollegah', 'bushido', 'capital bra'
  ];
  return exclusions.some(ex => lowerTitle.includes(ex));
}

function mapCategory(text) {
  const lower = text.toLowerCase();
  if (lower.includes('musik') || lower.includes('konzert') || lower.includes('party') || lower.includes('club')) return 'musik';
  if (lower.includes('theater') || lower.includes('schauspiel')) return 'theater';
  if (lower.includes('comedy') || lower.includes('kabarett')) return 'comedy';
  if (lower.includes('musical')) return 'musical';
  if (lower.includes('varieté') || lower.includes('variete')) return 'variete';
  if (lower.includes('wellness') || lower.includes('spa')) return 'wellness';
  if (lower.includes('sport') || lower.includes('lauf') || lower.includes('yoga')) return 'aktiv';
  if (lower.includes('essen') || lower.includes('food') || lower.includes('koch')) return 'essen';
  if (lower.includes('kunst') || lower.includes('workshop') || lower.includes('kurs')) return 'handwerk';
  return 'shows';
}

function getCategoryEmoji(category) {
  const emojis = {
    'musik': '🎵',
    'theater': '🎭',
    'comedy': '😂',
    'musical': '🎤',
    'variete': '🎪',
    'wellness': '🧖',
    'aktiv': '🏃',
    'essen': '🍽️',
    'handwerk': '🎨',
    'shows': '✨'
  };
  return emojis[category] || '📅';
}

function formatMeetupDate(dateTime) {
  if (!dateTime) return new Date().toISOString().split('T')[0];
  const date = new Date(dateTime);
  return date.toISOString().split('T')[0];
}

function formatMeetupTime(dateTime) {
  if (!dateTime) return '19:00';
  const date = new Date(dateTime);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// ============================================
// MAIN SCRAPER FUNCTION
// ============================================

async function runAllScrapers() {
  console.log('═══════════════════════════════════════════');
  console.log('🔍 DATEBUCH AUTO-SCRAPER');
  console.log(`📅 ${new Date().toLocaleString('de-DE')}`);
  console.log('═══════════════════════════════════════════');

  const allEvents = [];

  // Run scrapers with delays between each
  const scrapers = [
    { name: 'ohschonhell', fn: scrapeOhSchonHell },
    { name: 'heuteinhamburg', fn: scrapeHeuteInHamburg },
    { name: 'meetup', fn: scrapeMeetup }
  ];

  for (const scraper of scrapers) {
    try {
      const events = await scraper.fn();
      allEvents.push(...events);

      // Random delay between scrapers (3-10 seconds)
      const delay = Math.floor(Math.random() * 7000) + 3000;
      console.log(`  ⏳ Waiting ${(delay/1000).toFixed(1)}s before next source...`);
      await sleep(delay);
    } catch (error) {
      console.log(`  ✗ ${scraper.name} failed: ${error.message}`);
    }
  }

  // Deduplicate events
  const uniqueEvents = deduplicateEvents(allEvents);

  console.log('\n═══════════════════════════════════════════');
  console.log(`📊 RESULTS: ${uniqueEvents.length} unique events found`);
  console.log('═══════════════════════════════════════════');

  return uniqueEvents;
}

function deduplicateEvents(events) {
  const seen = new Map();

  for (const event of events) {
    const key = `${event.date}-${event.title.toLowerCase().substring(0, 20)}`;
    if (!seen.has(key)) {
      seen.set(key, event);
    }
  }

  return Array.from(seen.values());
}

// ============================================
// FILE OPERATIONS
// ============================================

async function updateEventsJson(newEvents) {
  const eventsPath = path.join(__dirname, '..', 'events.json');

  try {
    // Read existing events
    const existingData = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
    const existingEvents = existingData.events || [];

    // Get existing IDs
    const existingIds = new Set(existingEvents.map(e => e.id));

    // Filter new events
    const actuallyNewEvents = newEvents.filter(e => !existingIds.has(e.id));

    if (actuallyNewEvents.length === 0) {
      console.log('\n✓ No new events to add');
      return 0;
    }

    // Merge events
    const mergedEvents = [...existingEvents, ...actuallyNewEvents];

    // Sort by date
    mergedEvents.sort((a, b) => a.date.localeCompare(b.date));

    // Write back
    fs.writeFileSync(eventsPath, JSON.stringify({ events: mergedEvents }, null, 2), 'utf8');

    console.log(`\n✓ Added ${actuallyNewEvents.length} new events to events.json`);
    return actuallyNewEvents.length;
  } catch (error) {
    console.log(`\n✗ Error updating events.json: ${error.message}`);
    return 0;
  }
}

// ============================================
// ENTRY POINT
// ============================================

async function main() {
  const events = await runAllScrapers();

  if (events.length > 0) {
    // Save raw scraped data for inspection
    const outputPath = path.join(__dirname, 'scraped-events.json');
    fs.writeFileSync(outputPath, JSON.stringify(events, null, 2), 'utf8');
    console.log(`\n📁 Raw data saved to: scraped-events.json`);

    // Optionally update main events.json
    // await updateEventsJson(events);
  }

  console.log('\n✅ Scraping completed!');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runAllScrapers, updateEventsJson };
