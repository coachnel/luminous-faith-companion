
// Service worker simple et stable pour mobile
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('SW: Enregistré avec succès');

      // Gestion simple des mises à jour - pas de reload automatique
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          console.log('SW: Nouvelle version détectée');
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('SW: Mise à jour disponible');
              // Pas de reload automatique - laissons l'utilisateur choisir
            }
          });
        }
      });

    } catch (error) {
      console.log('SW: Échec de l\'enregistrement:', error);
    }
  });
}

// Fonction pour forcer la mise à jour si nécessaire
export const forceUpdateSW = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    } catch (error) {
      console.error('Erreur mise à jour SW:', error);
    }
  }
};

// Fonction pour nettoyer le cache
export const clearSWCache = async () => {
  if ('serviceWorker' in navigator && 'caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
      console.log('SW: Caches supprimés');
    } catch (error) {
      console.error('Erreur nettoyage cache:', error);
    }
  }
};
