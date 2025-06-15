
// Enregistrement du service worker avec gestion douce des mises à jour
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('Service Worker enregistré avec succès:', registration.scope);

      // Gestion douce des mises à jour - pas de reload automatique
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          console.log('Nouvelle version du service worker détectée');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('Mise à jour disponible');
                // Pas de reload automatique - laissons l'utilisateur choisir
              } else {
                console.log('Application mise en cache pour utilisation hors-ligne');
              }
            }
          });
        }
      });

      // Vérification des mises à jour moins fréquente
      setInterval(async () => {
        try {
          await registration.update();
        } catch (error) {
          console.log('Erreur lors de la vérification:', error);
        }
      }, 30 * 60 * 1000); // 30 minutes au lieu de 10

    } catch (error) {
      console.log('Échec de l\'enregistrement du service worker:', error);
    }
  });
}

// Fonction pour forcer la mise à jour si nécessaire
export const forceUpdateSW = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration) {
        await registration.update();
        
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour forcée:', error);
    }
  }
};

// Fonction pour nettoyer le cache
export const clearSWCache = async () => {
  if ('serviceWorker' in navigator && 'caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          console.log('Suppression du cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
      console.log('Tous les caches ont été supprimés');
    } catch (error) {
      console.error('Erreur lors du nettoyage du cache:', error);
    }
  }
};
