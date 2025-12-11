/**
 * Configuration Module
 * Contains all constants, configuration values, API keys, and static data
 * - Storage keys
 * - Memories data
 * - Travel destinations
 * - Venue database (restaurants, bars, cafes)
 * - Default events
 */

// Storage configuration
export const STORAGE_KEY = 'datebuch_nick_solli_v9';
export const OSM_CACHE_KEY = 'datebuch_osm_venues';
export const OSM_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Memories data (captions can be overridden by user in localStorage)
export const MEMORIES_DATA = [
    { id: 'mem1', caption: 'Mit Teddy 🧸', image: 'memories/IMG_9423.jpg' },
    { id: 'mem2', caption: 'Porto 🇵🇹', image: 'memories/IMG_0276.jpg' },
    { id: 'mem3', caption: 'Radtour 🚴', image: 'memories/IMG_0508.JPG' },
    { id: 'mem4', caption: 'Waschbär-Vibes 🦝', image: 'memories/IMG_8518.jpg' },
    { id: 'mem5', caption: 'Sommer ☀️', image: 'memories/IMG_6589.jpg' },
    { id: 'mem6', caption: 'Heidelberg 🏰', image: 'memories/IMG_7378.jpg' },
    { id: 'mem7', caption: 'Natur 🌿', image: 'memories/IMG_6446.jpg' },
    { id: 'mem8', caption: 'Chillen 🤗', image: 'memories/IMG_4443.JPG' }
];

// Travel destinations for globe
export const DESTINATIONS = {
    visited: [
        { name: 'Portugal', emoji: '🇵🇹', lat: 39.4, lon: -8.2 },
        { name: 'Dänemark', emoji: '🇩🇰', lat: 56.3, lon: 9.5 },
        { name: 'Spanien', emoji: '🇪🇸', lat: 40.4, lon: -3.7 },
        { name: 'Frankreich', emoji: '🇫🇷', lat: 46.2, lon: 2.2 },
        { name: 'Deutschland', emoji: '🇩🇪', lat: 51.2, lon: 10.5 }
    ],
    visitedCities: [
        // Portugal
        { name: 'Lissabon', emoji: '🏛️', lat: 38.72, lon: -9.14, country: 'Portugal' },
        { name: 'Porto', emoji: '🍷', lat: 41.16, lon: -8.63, country: 'Portugal' },
        { name: 'Sintra', emoji: '🏰', lat: 38.80, lon: -9.39, country: 'Portugal' },
        // Dänemark
        { name: 'Kopenhagen', emoji: '🧜‍♀️', lat: 55.68, lon: 12.57, country: 'Dänemark' },
        // Spanien
        { name: 'Barcelona', emoji: '🎭', lat: 41.39, lon: 2.17, country: 'Spanien' },
        { name: 'Madrid', emoji: '🏟️', lat: 40.42, lon: -3.70, country: 'Spanien' },
        // Frankreich
        { name: 'Paris', emoji: '🗼', lat: 48.86, lon: 2.35, country: 'Frankreich' },
        { name: 'Lyon', emoji: '🍽️', lat: 45.76, lon: 4.83, country: 'Frankreich' },
        // Deutschland
        { name: 'Hamburg', emoji: '⚓', lat: 53.55, lon: 10.00, country: 'Deutschland' },
        { name: 'Berlin', emoji: '🐻', lat: 52.52, lon: 13.40, country: 'Deutschland' },
        { name: 'München', emoji: '🥨', lat: 48.14, lon: 11.58, country: 'Deutschland' }
    ],
    wishlist: [
        { name: 'Ecuador', emoji: '🇪🇨', lat: -1.8, lon: -78.2, reasons: ['🐢 Galapagos-Inseln', '🌴 Amazonas-Dschungel', '🏔️ Cotopaxi Vulkan'] },
        { name: 'Mexiko', emoji: '🇲🇽', lat: 23.6, lon: -102.5, reasons: ['🏊 Cenoten schwimmen', '🏛️ Chichén Itzá', '🌮 Street Food'] },
        { name: 'Thailand', emoji: '🇹🇭', lat: 15.9, lon: 100.9, reasons: ['🍜 Pad Thai everywhere', '🏝️ Koh Lipe', '🛕 Tempel'] },
        { name: 'Marokko', emoji: '🇲🇦', lat: 31.8, lon: -7.1, reasons: ['🏜️ Sahara-Nacht', '🕌 Medina Fes', '🫖 Minztee'] },
        { name: 'Istanbul', emoji: '🇹🇷', lat: 41.0, lon: 29.0, reasons: ['🕌 Hagia Sophia', '🛒 Großer Basar', '🌉 Bosporus'] }
    ]
};

// Venue database with opening hours (vegetarian-friendly only!)
export const VENUE_DATABASE = {
    restaurants: [
        // Innenstadt / Rathausmarkt
        { name: 'Café Paris', type: 'Französisch', address: 'Rathausstraße 4', coords: [53.5503, 9.9933], link: 'https://www.cafeparis.net/', veggie: true, hours: 'Mo-So 9-24h' },
        { name: 'Café Leonar', type: 'Jüdische Küche', address: 'Grindelhof 59', coords: [53.5678, 9.9833], link: 'https://www.cafe-leonar.de/', veggie: true, hours: 'Di-So 10-22h, Mo geschlossen' },
        { name: 'Wandrahm', type: 'Modern Europäisch', address: 'Am Sandtorkai 77', coords: [53.5433, 9.9892], link: '', veggie: true, hours: 'Di-Sa 12-22h' },
        // St. Pauli / Schanze
        { name: 'Tazzi Pizza', type: 'Beste Pizza St. Pauli', address: 'Reeperbahn 61', coords: [53.5494, 9.9611], link: 'https://www.tazzi-pizza.de/', veggie: true, hours: 'Mo-So 12-2h' },
        { name: 'Kleine Pause', type: 'Burger & Bowls', address: 'Friedrichstraße 25', coords: [53.5503, 9.9658], link: 'https://www.instagram.com/kleinepause_hamburg/', veggie: true, hours: 'Mo-Fr 12-22h, Sa-So 11-22h' },
        { name: 'Die Kombüse', type: 'Mexikanisch', address: 'Wohlwillstraße 20', coords: [53.5517, 9.9600], link: 'https://www.diekombuesehamburg.de/', veggie: true, hours: 'Mo-So 17-23h' },
        { name: 'Altes Mädchen', type: 'Craft Beer & vegetarisch', address: 'Lagerstraße 28b', coords: [53.5636, 9.9628], link: 'https://www.altes-maedchen.com/', veggie: true, hours: 'Mo-Sa 12-24h, So 10-23h' },
        { name: 'Vincent Vegan', type: '100% Vegan Burger', address: 'Schulterblatt 31', coords: [53.5622, 9.9583], link: 'https://vincent-vegan.com/', veggie: true, hours: 'Mo-So 11-22h' },
        { name: 'Leaf', type: '100% Vegan', address: 'Beim Grünen Jäger 14', coords: [53.5578, 9.9592], link: '', veggie: true, hours: 'Di-Sa 12-21h' },
        { name: 'Bidges & Sons', type: 'Veganer Brunch', address: 'Schulterblatt 1', coords: [53.5617, 9.9611], link: '', veggie: true, hours: 'Mo-Fr 9-18h, Sa-So 10-18h' },
        // Altona / Ottensen
        { name: 'Maquis', type: '100% Vegetarisch', address: 'Thedestraße 2', coords: [53.5519, 9.9347], link: 'https://www.maquis.de/', veggie: true, hours: 'Di-Sa 18-22h, So-Mo geschlossen' },
        { name: 'Froindlichst', type: '100% Vegan', address: 'Bahrenfelder Str. 131', coords: [53.5556, 9.9375], link: 'https://froindlichst.de/', veggie: true, hours: 'Mo-Sa 11-22h' },
        // Eppendorf / Winterhude
        { name: 'Mirou', type: 'Israelische Mezze', address: 'Mühlenkamp 43', coords: [53.5889, 10.0083], link: 'https://www.mirou-hamburg.de/', veggie: true, hours: 'Di-Sa 18-23h, So geschlossen' },
        { name: 'Tassajara', type: 'Vegan seit 1976', address: 'Eppendorfer Weg 47', coords: [53.5700, 9.9600], link: 'https://www.tassajara.de/', veggie: true, hours: 'Mo-So 11:30-22h' },
        { name: 'Happenpappen', type: 'Bio & Vegetarisch', address: 'Eppendorfer Weg 63', coords: [53.5711, 9.9583], link: '', veggie: true, hours: 'Mo-Fr 12-21h, Sa 10-21h' },
        // Karoviertel / Sternschanze
        { name: 'Cai Kitchen', type: '100% Vegan Sichuan', address: 'Glashüttenstr. 85a', coords: [53.5617, 9.9636], link: 'https://www.cai-kitchen.de/', veggie: true, hours: 'Mo-So 12-22h' },
        { name: 'Hatari', type: 'Srilankisches Curry', address: 'Schanzenstraße 2', coords: [53.5633, 9.9611], link: '', veggie: true, hours: 'Mo-So 12-23h' },
        { name: 'Nil', type: 'Sudanesisch Vegetarisch', address: 'Neuer Pferdemarkt 5', coords: [53.5569, 9.9619], link: '', veggie: true, hours: 'Di-So 12-22h' },
        // Grindel / Uni
        { name: 'Abaton Bistro', type: 'Kino-Restaurant', address: 'Allende-Platz 3', coords: [53.5669, 9.9850], link: '', veggie: true, hours: 'Mo-So 11-23h' },
        { name: 'Shalimar', type: 'Indisch-Pakistanisch', address: 'Grindelallee 19', coords: [53.5669, 9.9811], link: '', veggie: true, hours: 'Mo-So 12-23h' },
        { name: 'Asia Hung', type: 'Vietnamesisch', address: 'Grindelhof 77', coords: [53.5681, 9.9850], link: '', veggie: true, hours: 'Mo-So 11:30-22:30h' },
        // HafenCity / Speicherstadt
        { name: 'Hobenköök', type: 'Regionale Küche', address: 'Stockmeyerstraße 43', coords: [53.5350, 10.0050], link: 'https://www.hobenkoeok.de/', veggie: true, hours: 'Di-Sa 12-22h, So-Mo geschlossen' },
        // Barmbek / Uhlenhorst
        { name: 'Momo Ramen', type: 'Vegane Ramen-Option', address: 'Mühlenkamp 59', coords: [53.5883, 10.0075], link: '', veggie: true, hours: 'Mo-So 12-22h' },
        { name: 'Sattgrün', type: 'Veganes Buffet', address: 'Mühlenkamp 39', coords: [53.5856, 10.0039], link: '', veggie: true, hours: 'Mo-So 11:30-22h' },
    ],
    bars: [
        // Innenstadt
        { name: 'Le Lion', type: 'Beste Cocktailbar', address: 'Rathausstraße 3', coords: [53.5503, 9.9930], link: 'https://www.lelion.net/', hours: 'Di-Sa 18-2h' },
        { name: 'Parlament', type: 'Weinbar', address: 'Rathausmarkt 1', coords: [53.5500, 9.9920], link: 'https://www.parlament-hamburg.de/', hours: 'Mo-Sa 17-24h' },
        { name: 'Boilerman Bar', type: 'Highballs', address: 'Eppendorfer Weg 211', coords: [53.5722, 9.9583], link: 'https://www.theboilerman.de/', hours: 'Di-Sa 19-2h' },
        // St. Pauli / Reeperbahn
        { name: 'Zum Silbersack', type: 'Kiez-Legende seit 1949', address: 'Silbersackstraße 9', coords: [53.5497, 9.9578], link: 'https://www.silbersack.de/', hours: 'Mo-So 20-5h' },
        { name: 'Clouds', type: 'Rooftop Bar', address: 'Reeperbahn 1', coords: [53.5494, 9.9606], link: 'https://clouds-hamburg.de/', hours: 'Mo-So 17-1h' },
        { name: 'Ritze', type: 'Boxkneipe', address: 'Reeperbahn 140', coords: [53.5489, 9.9539], link: 'https://www.ritze.de/', hours: 'Mo-So 21-5h' },
        { name: 'Astra Stube', type: 'Kultkneipe', address: 'Max-Brauer-Allee 200', coords: [53.5550, 9.9528], link: 'https://www.astrastube.de/', hours: 'Mo-So 19-3h' },
        { name: 'Komet', type: 'Indie-Bar', address: 'Erichstraße 11', coords: [53.5506, 9.9622], link: '', hours: 'Di-Sa 20-3h' },
        { name: 'Molotow', type: 'Club & Bar', address: 'Nobistor 14', coords: [53.5489, 9.9536], link: 'https://molotowclub.com/', hours: 'Mi-Sa 21-4h' },
        // Schanze / Karoviertel
        { name: 'Familieneck', type: 'Kultkneipe Schanze', address: 'Friedensallee 9', coords: [53.5611, 9.9600], link: '', hours: 'Mo-So 18-2h' },
        { name: 'Katze', type: 'Bar & Späti', address: 'Schulterblatt 63', coords: [53.5633, 9.9569], link: '', hours: 'Mo-So 17-3h' },
        { name: 'Goldfischglas', type: 'Gemütliche Kneipe', address: 'Bartelsstraße 30', coords: [53.5636, 9.9594], link: '', hours: 'Di-So 19-2h' },
        { name: 'Zwick', type: 'Rock-Kneipe', address: 'Sternstraße 28', coords: [53.5628, 9.9558], link: '', hours: 'Mo-So 20-4h' },
        { name: 'Reh Bar', type: 'Kleine Cocktailbar', address: 'Juliusstraße 22', coords: [53.5617, 9.9564], link: '', hours: 'Di-Sa 19-1h' },
        // Eppendorf / Winterhude / Grindel
        { name: 'Julep', type: 'Whiskey & Cocktails', address: 'Eppendorfer Weg 139', coords: [53.5700, 9.9650], link: 'https://www.instagram.com/julep_bar/', hours: 'Di-Sa 19-2h' },
        { name: 'Hadleys', type: 'Speakeasy', address: 'Beim Schlump 84a', coords: [53.5683, 9.9775], link: 'https://hadleys.de/', hours: 'Di-Sa 18-1h' },
        { name: 'Pony Bar', type: 'Gemütliche Uni-Bar', address: 'Allende-Platz 1', coords: [53.5669, 9.9850], link: '', hours: 'Mo-So 17-1h' },
        { name: 'Die Schöne', type: 'Bar & Café', address: 'Barmbeker Str. 159', coords: [53.5800, 10.0050], link: '', hours: 'Mo-So 10-24h' },
        { name: 'Cascadas', type: 'Cocktails Eppendorf', address: 'Eppendorfer Landstr. 80', coords: [53.5856, 9.9958], link: '', hours: 'Mo-Sa 18-1h' },
        // Altona / Ottensen
        { name: 'Nachtasyl', type: 'Thalia Theater Bar', address: 'Alstertor 1', coords: [53.5522, 9.9986], link: '', hours: 'Di-Sa 17-24h' },
        { name: 'Elbschlosskeller', type: 'Legendäre Kneipe', address: 'Elbberg 1', coords: [53.5469, 9.9328], link: '', hours: 'Mo-So 19-6h' },
        { name: 'Strandperle', type: 'Beach Bar', address: 'Övelgönne 60', coords: [53.5439, 9.9089], link: '', hours: 'Mo-So 10-22h (Sommer)' },
    ],
    cafes: [
        // Grindel / Uni
        { name: 'Campus Suite', type: 'Café & Bistro', address: 'Grindelallee 43', coords: [53.5672, 9.9842], link: '', veggie: true, hours: 'Mo-Fr 8-18h' },
        // Schanze / Karoviertel
        { name: 'Mehl, Butter, Zucker', type: 'Café & Kuchen', address: 'Bartelsstraße 26', coords: [53.5639, 9.9597], link: '', veggie: true, hours: 'Mi-So 10-18h' },
        { name: 'Elbgold', type: 'Specialty Coffee', address: 'Lagerstraße 34c', coords: [53.5636, 9.9628], link: 'https://elbgold.com/', veggie: true, hours: 'Mo-Fr 8-18h, Sa-So 9-18h' },
        // Altona / Ottensen
        { name: 'Café May', type: 'Frühstück & Kuchen', address: 'Beim Grünen Jäger 66', coords: [53.5572, 9.9544], link: '', veggie: true, hours: 'Mo-So 9-18h' },
        { name: 'Von der Motte', type: 'Brunch Café', address: 'Eulenstraße 43', coords: [53.5508, 9.9381], link: '', veggie: true, hours: 'Mo-Fr 8-18h, Sa-So 9-18h' },
        // HafenCity / Speicherstadt
        { name: 'Fleetschlösschen', type: 'Café Speicherstadt', address: 'Brooktorkai 17', coords: [53.5433, 10.0017], link: '', veggie: true, hours: 'Mo-So 10-18h' },
        // Winterhude / Eppendorf
        { name: 'Feldstern', type: 'Bio-Café', address: 'Sternstraße 2', coords: [53.5856, 10.0039], link: '', veggie: true, hours: 'Mo-Fr 8-18h, Sa 9-16h' },
        { name: 'Café Johanna', type: 'Frühstück & Brunch', address: 'Mühlenkamp 1', coords: [53.5883, 10.0075], link: '', veggie: true, hours: 'Mo-So 9-18h' },
        // St. Georg
        { name: 'Café Gnosa', type: 'LGBTQ+ Café', address: 'Lange Reihe 93', coords: [53.5556, 10.0094], link: '', veggie: true, hours: 'Mo-So 10-1h' },
    ]
};

// Default events (fallback if no external data)
export const DEFAULT_EVENTS = [
    // Exhibitions
    { id: 'e1', emoji: '🖼️', title: 'Anders Zorn - Hamburger Kunsthalle', date: '2025-09-26', endDate: '2026-01-25', category: 'ausstellung', description: 'Erste große Werkschau des schwedischen Impressionisten. Über 150 Exponate!', location: 'Glockengießerwall', part1Title: 'Kunsthalle', part1Desc: 'Di-So 10-18h, Do bis 21h', part2Title: 'Danach: Café Paris', part2Desc: 'Croques Madame, französisches Flair' },
    { id: 'e2', emoji: '🎬', title: 'Ho Tzu Nyen - Time & the Tiger', date: '2025-11-21', endDate: '2026-04-12', category: 'ausstellung', description: 'Immersive Multimedia-Installationen in der Galerie der Gegenwart', location: 'Hamburger Kunsthalle', part1Title: 'Galerie der Gegenwart', part1Desc: 'Mythische Erzählungen, Video, Musik', part2Title: 'Danach: Maquis', part2Desc: '100% vegetarisch, Bio-Produkte' },

    // Music
    { id: 'dez03-selig', emoji: '🎸', title: 'Selig - 30 Jahre Jubiläum', date: '2025-12-03', endDate: '', category: 'musik', description: 'Hamburger Kultband feiert 30 Jahre! "Ohne Dich", "Bruderlos" - Gänsehaut garantiert!', location: 'Fabrik, Barnerstr. 36', part1Title: 'Fabrik Hamburg', part1Desc: 'Einlass 19h, Beginn 20h - ca. 50€', part2Title: 'Vorher: Maquis', part2Desc: 'Vegetarisch in Altona, 5 Min entfernt' },

    // Active
    { id: 'e12', emoji: '🧗‍♀️', title: 'Bouldern lernen', date: '2025-12-01', endDate: '2026-12-31', category: 'aktiv', description: 'Anfängerkurs zusammen machen! Klettern ohne Seil', location: 'Nordwandhalle / Flash', part1Title: 'Nordwandhalle', part1Desc: 'Anfängerkurs 2h, Schuhe inklusive', part2Title: 'Danach: Hatari', part2Desc: 'Srilankisches Curry' },

    // Wellness
    { id: 'e14', emoji: '💆‍♀️', title: 'Wellnest Spa', date: '2025-12-01', endDate: '2026-12-31', category: 'wellness', description: 'Private Spa-Suite nur für uns! Whirlpool, Sauna', location: 'verschiedene Standorte', part1Title: 'Wellnest Spa', part1Desc: 'Private Suite für 2', part2Title: 'Danach: Tassajara', part2Desc: 'Vegetarisch seit 1976' },

    // Food
    { id: 'e15', emoji: '🌿', title: 'Maquis Restaurant', date: '2025-12-01', endDate: '2026-12-31', category: 'essen', description: '100% vegetarisch! Wöchentlich wechselnde Karte, Bio', location: 'Thedestraße 2, Altona', part1Title: 'Maquis', part1Desc: '3-Gang-Menü, hausgemachtes Eis', part2Title: '', part2Desc: '' },

    // Handwerk
    { id: 'hw1', emoji: '🧶', title: 'Strickkurs für Anfänger', date: '2025-12-01', endDate: '2026-12-31', category: 'handwerk', description: 'Stricken lernen! Maschen anschlagen, rechte & linke Maschen, erstes Projekt (Schal/Stirnband)', location: 'Seemannsgarn, Eimsbüttel', part1Title: 'Seemannsgarn', part1Desc: '45€, 3h Workshop, Wolle inkl.', part2Title: 'Danach: Café May', part2Desc: 'Kuchen im Eimsbüttel' },
];

// Solli's work location for ÖPNV routing
export const WORK_ADDRESS = 'Stadtdeich 5, 20097 Hamburg';
export const SOLLI_WORK_ADDRESS = WORK_ADDRESS; // Alias
export const SOLLI_WORK_COORDS = [53.5453, 10.0269];

// Hamburg coordinates
export const HAMBURG_COORDS = { lat: 53.55, lon: 10.0 };

// Categories
export const CATEGORIES = ['wellness', 'aktiv', 'handwerk', 'comedy', 'essen', 'musik', 'shows'];

// Categories that show Feierabend toggle
export const FEIERABEND_CATEGORIES = ['handwerk', 'aktiv', 'wellness', 'comedy', 'essen', 'shows', 'all'];

// Search settings
export const SEARCH_MIN_LENGTH = 2;
export const SEARCH_MAX_RESULTS = 8;

// Travel commute time (45 minutes)
export const TRAVEL_COMMUTE_MINUTES = 45;

// Calendar labels
export const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
export const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
