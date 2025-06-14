
// Enregistrement du service worker avec gestion des mises à jour
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker enregistré avec succès:', registration.scope);

      // Vérifier les mises à jour
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          console.log('Nouvelle version du service worker en cours d\'installation');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Une mise à jour est disponible
                console.log('Mise à jour disponible');
                window.dispatchEvent(new CustomEvent('pwa-update-available'));
              } else {
                // Premier chargement
                console.log('Application mise en cache pour utilisation hors-ligne');
              }
            }
          });
        }
      });

      // Écouter les messages du service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          window.dispatchEvent(new CustomEvent('pwa-update-available'));
        }
      });

      // Vérifier immédiatement s'il y a une mise à jour
      registration.update();

      // Vérifier périodiquement les mises à jour (toutes les 60 minutes)
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

    } catch (error) {
      console.log('Échec de l\'enregistrement du service worker:', error);
    }
  });

  // Gérer les changements de contrôleur (quand une nouvelle version prend le relais)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Nouveau service worker actif');
    // Optionnel : recharger automatiquement la page
    // window.location.reload();
  });
}

// Fonction utilitaire pour forcer la mise à jour
export const forceUpdateSW = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration) {
        await registration.update();
        
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
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
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('Cache nettoyé avec succès');
    } catch (error) {
      console.error('Erreur lors du nettoyage du cache:', error);
    }
  }
};
