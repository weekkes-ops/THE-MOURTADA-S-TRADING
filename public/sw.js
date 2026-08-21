// The Mourtada's Trading - Service Worker for Bo City Offline Resilience
const CACHE_NAME = 'mourtada-trading-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/public/logo.svg',
  '/favicon.ico',
];

// Install Event - Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets for Bo City offline mode');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache non-fatal error:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Deleting obsolete cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Stale while revalidate / Network-first with cache fallback
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip browser-extension or chrome-extension URLs
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if available, but fetch fresh in background
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          // If offline and no cached response, fallback to root/index
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/');
          }
          throw err;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
