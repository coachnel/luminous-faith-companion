
const CACHE_VERSION = 'compagnon-spirituel-v4-stable';
const CACHE_NAME = CACHE_VERSION;

// Cache minimal pour éviter les blocages
const urlsToCache = [
  '/',
  '/manifest.json'
];

// Installation simple
self.addEventListener('install', (event) => {
  console.log('[SW] Installing stable version...');
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).catch(err => {
          console.log('[SW] Cache failed, continuing...', err);
        });
      })
  );
});

// Activation avec nettoyage
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating stable version...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch simple - network first pour éviter les blocages
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestURL = new URL(event.request.url);

  // Pour les pages HTML, toujours aller sur le réseau
  if (requestURL.pathname === '/' || requestURL.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Pour les autres ressources, réseau d'abord puis cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone).catch(() => {
              // Ignore cache errors
            });
          });
        }
        return response;
      })
      .catch(() => 
        caches.match(event.request).then(response => 
          response || new Response('Offline', { status: 503 })
        )
      )
  );
});

// Handle skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Push notification simple
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nouveau contenu disponible !',
    icon: '/lovable-uploads/ee59e58d-a594-4372-b796-33f8edb80c6c.png',
    badge: '/lovable-uploads/ee59e58d-a594-4372-b796-33f8edb80c6c.png',
    vibrate: [100, 50, 100],
    data: { dateOfArrival: Date.now(), primaryKey: 1 }
  };
  event.waitUntil(
    self.registration.showNotification('Compagnon Spirituel', options)
  );
});
