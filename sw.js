/**
 * Datebuch Service Worker
 * Offline caching for static assets and API responses
 */

const CACHE_NAME = 'datebuch-v16';

const STATIC_ASSETS = [
    './', './index.html', './events.json', './manifest.json',
    './css/variables.css', './css/base.css', './css/animations.css',
    './css/layout.css', './css/components.css', './css/pages.css',
    './css/themes/theme-romantic.css', './css/themes/theme-modern.css', './css/themes/theme-playful.css',
    './js/app.js', './js/logger.js', './js/config.js', './js/utils.js',
    './js/storage.js', './js/auth.js', './js/events.js', './js/events-render.js',
    './js/navigation.js', './js/calendar.js', './js/date-builder.js',
    './js/date-builder-map.js', './js/date-builder-export.js', './js/weather.js',
    './js/globe.js', './js/globe-controls.js', './js/memories.js',
    './js/roulette.js', './js/strava.js', './js/komoot.js', './js/error-handler.js',
    './js/theme-switcher.js'
];

const API_PATTERNS = [/api\.open-meteo\.com/, /overpass-api\.de/];

// Install: Cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(names =>
            Promise.all(names
                .filter(name => name.startsWith('datebuch-') && name !== CACHE_NAME)
                .map(name => caches.delete(name))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch: Route to appropriate strategy
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) return;

    const isApi = API_PATTERNS.some(p => p.test(url.href));

    if (isApi) {
        event.respondWith(networkFirst(event.request));
    } else if (url.pathname.endsWith('.json')) {
        event.respondWith(staleWhileRevalidate(event.request));
    } else {
        event.respondWith(cacheFirst(event.request));
    }
});

// Cache-first: Static assets
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        if (request.mode === 'navigate') return caches.match('./index.html');
        throw new Error('Offline');
    }
}

// Network-first: API calls
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return await caches.match(request) ||
            new Response('{"error":"Offline"}', { status: 503, headers: { 'Content-Type': 'application/json' }});
    }
}

// Stale-while-revalidate: JSON data
async function staleWhileRevalidate(request) {
    const cached = await caches.match(request);
    const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
            caches.open(CACHE_NAME).then(c => c.put(request, response.clone()));
        }
        return response;
    }).catch(() => cached);

    return cached || fetchPromise;
}

// Message handling
self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
    if (event.data?.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME).then(() => event.ports[0]?.postMessage({ success: true }));
    }
});
