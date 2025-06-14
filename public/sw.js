
const CACHE_NAME = 'luminous-faith-v1.2.0';
const STATIC_CACHE = 'luminous-faith-static-v1.2.0';
const DYNAMIC_CACHE = 'luminous-faith-dynamic-v1.2.0';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/ee59e58d-a594-4372-b796-33f8edb80c6c.png'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation en cours...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Cache statique ouvert');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Assets statiques mis en cache');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Erreur lors de l\'installation', error);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation en cours...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== CACHE_NAME) {
              console.log('Service Worker: Suppression de l\'ancien cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Prise de contrôle des clients');
        return self.clients.claim();
      })
      .catch(error => {
        console.error('Service Worker: Erreur lors de l\'activation', error);
      })
  );
});

// Stratégie de cache pour les requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }

  // Stratégie pour les assets statiques
  if (STATIC_ASSETS.includes(url.pathname) || url.pathname.includes('/lovable-uploads/')) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          return response || fetch(request)
            .then(fetchResponse => {
              return caches.open(STATIC_CACHE)
                .then(cache => {
                  cache.put(request, fetchResponse.clone());
                  return fetchResponse;
                });
            });
        })
        .catch(() => {
          // Fallback pour les images
          if (request.destination === 'image') {
            return caches.match('/lovable-uploads/ee59e58d-a594-4372-b796-33f8edb80c6c.png');
          }
        })
    );
    return;
  }

  // Stratégie Network First pour les API
  if (url.hostname.includes('supabase') || url.hostname.includes('api')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Stratégie Cache First pour les autres ressources
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(request)
          .then(fetchResponse => {
            if (!fetchResponse.ok) {
              throw new Error('Réponse réseau non valide');
            }
            
            const responseClone = fetchResponse.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone))
              .catch(error => console.log('Erreur mise en cache:', error));
            
            return fetchResponse;
          });
      })
      .catch(error => {
        console.log('Service Worker: Erreur de récupération', error);
        // Fallback vers la page d'accueil pour les navigations
        if (request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});

// Gestion des messages depuis l'application
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    // Forcer la mise à jour du cache
    caches.delete(DYNAMIC_CACHE);
    caches.delete(STATIC_CACHE);
    console.log('Service Worker: Cache mis à jour');
  }
});

// Notification de mise à jour disponible
self.addEventListener('controllerchange', () => {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'UPDATE_AVAILABLE',
        message: 'Une nouvelle version est disponible'
      });
    });
  });
});
