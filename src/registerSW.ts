
// Enregistrement du service worker avec gestion améliorée des mises à jour
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker enregistré avec succès:', registration.scope);

      // Vérifier immédiatement s'il y a une mise à jour en attente
      if (registration.waiting) {
        console.log('Service Worker en attente détecté immédiatement');
        window.dispatchEvent(new CustomEvent('pwa-update-available'));
      }

      // Vérifier les mises à jour
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          console.log('Nouvelle version du service worker en cours d\'installation');
          
          newWorker.addEventListener('statechange', () => {
            console.log('État du nouveau service worker:', newWorker.state);
            
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Une mise à jour est disponible
                console.log('Mise à jour disponible - nouveau service worker installé');
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
        console.log('Message reçu du service worker:', event.data);
        
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          window.dispatchEvent(new CustomEvent('pwa-update-available'));
        }
      });

      // Vérifier immédiatement s'il y a une mise à jour
      const updateCheckResult = await registration.update();
      console.log('Vérification de mise à jour effectuée:', updateCheckResult);

      // Vérifier périodiquement les mises à jour (toutes les 30 minutes)
      setInterval(async () => {
        try {
          console.log('Vérification périodique des mises à jour...');
          await registration.update();
        } catch (error) {
          console.log('Erreur lors de la vérification périodique:', error);
        }
      }, 30 * 60 * 1000);

      // Vérifier aussi lors de la reprise de focus de la page
      document.addEventListener('visibilitychange', async () => {
        if (!document.hidden) {
          try {
            console.log('Page redevenue visible, vérification des mises à jour...');
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

  // Gérer les changements de contrôleur (quand une nouvelle version prend le relais)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Nouveau service worker actif - contrôleur changé');
    // Ne pas recharger automatiquement, laisser l'utilisateur décider
  });
}

// Fonction utilitaire pour forcer la mise à jour
export const forceUpdateSW = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration) {
        console.log('Forçage de la mise à jour du service worker...');
        await registration.update();
        
        if (registration.waiting) {
          console.log('Activation du service worker en attente...');
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
      
      // Notifier le service worker du nettoyage
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.active) {
        registration.active.postMessage({ type: 'CACHE_UPDATE' });
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage du cache:', error);
    }
  }
};
