// Enregistrement du service worker avec mise à jour forcée
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Éviter la mise en cache du SW
      });

      console.log('Service Worker enregistré avec succès:', registration.scope);

      // Forcer la mise à jour immédiatement
      await registration.update();

      // Ajout: forcer les assets à recharger à chaque maj
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      } else {
        // Pour les cas où controllerchange ne déclenche pas
        setTimeout(() => {
          if (navigator.serviceWorker.controller) {
            window.location.reload();
          }
        }, 1500);
      }

      // Vérifier les mises à jour plus fréquemment
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          console.log('Nouvelle version du service worker détectée');
          
          newWorker.addEventListener('statechange', () => {
            console.log('État du nouveau service worker:', newWorker.state);
            
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('Mise à jour disponible - rechargement automatique');
                // Recharger automatiquement pour les mises à jour critiques
                window.location.reload();
              } else {
                console.log('Application mise en cache pour utilisation hors-ligne');
              }
            }
          });
        }
      });

      // Écouter les changements de contrôleur
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Nouveau service worker actif');
        window.location.reload();
      });

      // Vérifier les mises à jour plus fréquemment (toutes les 10 minutes)
      setInterval(async () => {
        try {
          console.log('Vérification automatique des mises à jour...');
          await registration.update();
        } catch (error) {
          console.log('Erreur lors de la vérification:', error);
        }
      }, 10 * 60 * 1000);

      // Vérifier aussi lors du focus de la page
      document.addEventListener('visibilitychange', async () => {
        if (!document.hidden) {
          try {
            console.log('Page active - vérification des mises à jour...');
            await registration.update();
          } catch (error) {
            console.log('Erreur lors de la vérification au focus:', error);
          }
        }
      });

    } catch (error) {
      console.log('Échec de l\'enregistrement du service worker:', error);
    }
  });
}

// Fonction pour forcer la mise à jour immédiate
export const forceUpdateSW = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration) {
        console.log('Forçage de la mise à jour...');
        // Supprimer tous les caches d'abord
        await clearSWCache();
        // Puis forcer la mise à jour
        await registration.update();
        
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        
        // Recharger la page
        window.location.reload();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour forcée:', error);
      // En cas d'erreur, recharger quand même
      window.location.reload();
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
