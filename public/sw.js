
const CACHE_VERSION = 'compagnon-spirituel-v3-20250615';
const CACHE_NAME = CACHE_VERSION;
const urlsToCache = [
  '/',
  '/?v=20250615',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json?v=20250615'
];

// Force update on install with updated version
self.addEventListener('install', (event) => {
  console.log('[SW] Installing... (v20250615)');
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Purge all old caches when activating new version
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v20250615...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((c) => {
          if (c !== CACHE_NAME) {
            return caches.delete(c);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Cache-busting on fetch
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestURL = new URL(event.request.url);

  // Bypass cache for HTML entrypoints (force reload, bust old cache)
  if (requestURL.pathname === '/' || requestURL.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Update cache for HTML
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Always cache versioned manifest/JS/CSS
  if (
    requestURL.pathname.endsWith('.js') ||
    requestURL.pathname.endsWith('.css') ||
    requestURL.pathname.endsWith('manifest.json')
  ) {
    // Append ?v=version to bust cache
    let bustRequest = event.request;
    if (!requestURL.searchParams.get('v')) {
      const url = new URL(event.request.url);
      url.searchParams.set('v', '20250615');
      bustRequest = new Request(url, event.request);
    }
    event.respondWith(
      caches.open(CACHE_NAME)
        .then((cache) =>
          cache.match(bustRequest).then((res) => {
            if (res) return res;
            return fetch(bustRequest).then((response) => {
              if (response && response.status === 200) {
                cache.put(bustRequest, response.clone());
              }
              return response;
            });
          })
        )
    );
    return;
  }

  // Default: network first, fallback cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(res => res || new Response('Offline...'))
      )
  );
});

// Handle skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    event.ports[0].postMessage({ type: 'UPDATE_AVAILABLE' });
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nouveau contenu disponible !',
    icon: '/lovable-uploads/ee59e58d-a594-4372-b796-33f8edb80c6c.png',
    badge: '/lovable-uploads/ee59e58d-a594-4372-b796-33f8edb80c6c.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(self.registration.showNotification('Compagnon Spirituel', options));
});
