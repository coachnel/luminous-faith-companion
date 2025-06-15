
const CACHE_NAME = 'compagnon-spirituel-v2';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json'
];

// Force update on install
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation en cours...');
  // Skip waiting pour forcer l'activation immédiate
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Mise en cache des ressources');
        return cache.addAll(urlsToCache);
      })
  );
});

// Clean old caches and take control immediately
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation en cours...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Prendre le contrôle immédiatement
      return self.clients.claim();
    })
  );
});

// Network first strategy for main app files
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la requête réussit, mettre en cache et retourner
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // Si la requête échoue, chercher en cache
        return caches.match(event.request)
          .then((response) => {
            return response || new Response('Contenu non disponible hors ligne');
          });
      })
  );
});

// Handle skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Service Worker: Skip waiting demandé');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    console.log('Service Worker: Mise à jour du cache demandée');
    // Notifier qu'une mise à jour est disponible
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

  event.waitUntil(
    self.registration.showNotification('Compagnon Spirituel', options)
  );
});
