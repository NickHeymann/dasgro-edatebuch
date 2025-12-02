// Service Worker für Datebuch PWA
const CACHE_NAME = 'datebuch-v5';
const urlsToCache = [
  './',
  './index.html',
  './events.json',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Quicksand:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdn.jsdelivr.net/npm/topojson-client@3',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Install - Cache wichtige Dateien
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache geöffnet');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Cache Fehler:', err))
  );
  self.skipWaiting();
});

// Activate - Alte Caches löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Lösche alten Cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - Cache-First Strategie mit Netzwerk-Fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Klone Request weil er nur einmal verwendet werden kann
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Prüfe ob valide Response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Klone Response für Cache
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              // Nur GET Requests cachen
              if (event.request.method === 'GET') {
                cache.put(event.request, responseToCache);
              }
            });

          return response;
        }).catch(() => {
          // Offline Fallback
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
