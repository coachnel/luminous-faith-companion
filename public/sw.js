// Service Worker de base généré par vite-plugin-pwa (sera remplacé en prod)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Laisser passer toutes les requêtes, gestion par défaut
});
