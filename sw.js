// Das Große Datebuch - Service Worker
const CACHE_NAME = 'datebuch-v3';
const STATIC_ASSETS = [
  './',
  './das-grosse-datebuch-v10.html',
  './events.json',
  './locations-database.json',
  './manifest.json'
];

// External resources to cache
const EXTERNAL_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        // Cache static assets first
        return cache.addAll(STATIC_ASSETS)
          .then(() => {
            // Try to cache external assets (don't fail if they're unavailable)
            return Promise.allSettled(
              EXTERNAL_ASSETS.map(url =>
                fetch(url)
                  .then(response => {
                    if (response.ok) {
                      return cache.put(url, response);
                    }
                  })
                  .catch(() => console.log('[SW] Could not cache:', url))
              )
            );
          });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version
          // Also fetch fresh version in background for next time
          if (event.request.url.includes('events.json') ||
              event.request.url.includes('locations-database.json')) {
            fetch(event.request)
              .then((response) => {
                if (response.ok) {
                  caches.open(CACHE_NAME)
                    .then((cache) => cache.put(event.request, response));
                }
              })
              .catch(() => {});
          }
          return cachedResponse;
        }

        // Not in cache - fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-ok responses or opaque responses we can't use
            if (!response || response.status !== 200) {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache successful responses for images and API calls
            if (event.request.url.includes('tile.openstreetmap.org') ||
                event.request.url.includes('.png') ||
                event.request.url.includes('.jpg') ||
                event.request.url.includes('.svg')) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch(() => {
            // Network failed - return offline fallback for HTML
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('./das-grosse-datebuch-v10.html');
            }
          });
      })
  );
});

// Background sync for ratings
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-ratings') {
    console.log('[SW] Syncing ratings...');
    event.waitUntil(syncRatings());
  }
});

async function syncRatings() {
  // This would sync with Supabase when online
  // For now, just log
  console.log('[SW] Ratings sync complete');
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💕</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💕</text></svg>',
    vibrate: [100, 50, 100],
    requireInteraction: false
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.body || 'Neues Date wartet auf euch!';
    options.tag = data.tag || 'datebuch-notification';
    options.data = data;

    event.waitUntil(
      self.registration.showNotification(data.title || 'Datebuch', options)
    );
  }
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url.includes('datebuch') && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow('./das-grosse-datebuch-v10.html');
        }
      })
  );
});

console.log('[SW] Service Worker loaded');
