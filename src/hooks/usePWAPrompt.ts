
import { useEffect, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      const isInWebAppChrome = window.matchMedia('(display-mode: minimal-ui)').matches;
      const isInWebAppFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
      const installed = isStandalone || isInWebAppiOS || isInWebAppChrome || isInWebAppFullscreen;
      setIsInstalled(installed);
      
      console.log('PWA: Status d\'installation vérifié', { installed, isStandalone, isInWebAppiOS, isInWebAppChrome });
      
      return installed;
    };

    const installed = checkInstallStatus();

    // Vérifier les mises à jour du service worker immédiatement
    const checkForUpdates = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            // Forcer la vérification des mises à jour
            await registration.update();
            
            // Vérifier s'il y a un service worker en attente
            if (registration.waiting) {
              console.log('PWA: Mise à jour détectée (service worker en attente)');
              setUpdateAvailable(true);
              window.dispatchEvent(new CustomEvent('pwa-update-available'));
            }
            
            // Vérifier s'il y a un nouveau service worker en cours d'installation
            if (registration.installing) {
              console.log('PWA: Nouveau service worker en cours d\'installation');
              registration.installing.addEventListener('statechange', () => {
                if (registration.installing?.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                  window.dispatchEvent(new CustomEvent('pwa-update-available'));
                }
              });
            }
          }
        } catch (error) {
          console.error('Erreur lors de la vérification des mises à jour:', error);
        }
      }
    };

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setCanInstall(true);
      
      console.log('PWA: beforeinstallprompt détecté');
      window.dispatchEvent(new CustomEvent("pwa-install-available"));
    };

    // Écouter l'événement appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
      console.log('PWA: Application installée avec succès');
    };

    // Écouter les changements de mode d'affichage
    const mediaQueries = [
      window.matchMedia('(display-mode: standalone)'),
      window.matchMedia('(display-mode: minimal-ui)'),
      window.matchMedia('(display-mode: fullscreen)')
    ];
    
    const handleDisplayModeChange = () => {
      checkInstallStatus();
    };

    // Écouter les messages du service worker
    const handleSWMessage = (event: MessageEvent) => {
      console.log('PWA: Message reçu du service worker:', event.data);
      
      if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        setUpdateAvailable(true);
        window.dispatchEvent(new CustomEvent('pwa-update-available'));
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    
    mediaQueries.forEach(mq => {
      mq.addEventListener('change', handleDisplayModeChange);
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
      // Vérifier immédiatement les mises à jour
      checkForUpdates();
    }

    // Autoriser l'installation si pas encore installé (avec délai pour laisser le temps aux événements)
    if (!installed) {
      const timer = setTimeout(() => {
        const userAgent = navigator.userAgent;
        const isChrome = userAgent.includes('Chrome') && !userAgent.includes('Edg');
        const isEdge = userAgent.includes('Edg');
        const isFirefox = userAgent.includes('Firefox');
        const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');
        const isIOS = /iPad|iPhone|iPod/.test(userAgent);
        const isAndroid = userAgent.includes('Android');

        console.log('PWA: Détection appareil', { 
          isChrome, isEdge, isFirefox, isSafari, 
          isIOS, isAndroid, userAgent 
        });

        // Activer l'installation pour tous les navigateurs compatibles
        if (isChrome || isEdge || isFirefox || (isSafari && isIOS) || isAndroid) {
          setCanInstall(true);
          window.dispatchEvent(new CustomEvent("pwa-install-available"));
          console.log('PWA: Installation activée pour ce navigateur');
        }
      }, 1000);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("appinstalled", handleAppInstalled);
        mediaQueries.forEach(mq => {
          mq.removeEventListener('change', handleDisplayModeChange);
        });
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.removeEventListener('message', handleSWMessage);
        }
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      mediaQueries.forEach(mq => {
        mq.removeEventListener('change', handleDisplayModeChange);
      });
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      }
    };
  }, []);

  // Fonction pour déclencher l'installation
  const promptInstall = useCallback(async () => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');
    const isDesktop = window.innerWidth >= 1024;
    const isFirefox = userAgent.includes('Firefox');

    // Gérer l'installation avec le prompt natif si disponible
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        console.log('PWA: Choix utilisateur:', choiceResult.outcome);
        
        setDeferredPrompt(null);
        if (choiceResult.outcome === 'dismissed') {
          setCanInstall(false);
        }
        
        return;
      } catch (error) {
        console.error('Erreur lors du prompt d\'installation:', error);
      }
    }

    // Instructions spécifiques par plateforme
    if (isIOS && isSafari) {
      alert(
        '📱 Installation sur iPhone/iPad:\n\n' +
        '1. Appuyez sur le bouton de partage (□↗) en bas\n' +
        '2. Faites défiler et sélectionnez "Sur l\'écran d\'accueil"\n' +
        '3. Appuyez sur "Ajouter" pour confirmer\n\n' +
        'L\'application apparaîtra sur votre écran d\'accueil !'
      );
      return;
    }

    if (isFirefox) {
      alert(
        '🦊 Installation sur Firefox:\n\n' +
        '1. Cliquez sur le menu (☰) en haut à droite\n' +
        '2. Sélectionnez "Installer cette application"\n' +
        '3. Ou cherchez l\'icône d\'installation dans la barre d\'adresse\n\n' +
        'L\'application sera ajoutée à votre système !'
      );
      return;
    }

    if (isDesktop) {
      alert(
        '💻 Installation sur ordinateur:\n\n' +
        '• Chrome/Edge: Cliquez sur l\'icône d\'installation (⊕) dans la barre d\'adresse\n' +
        '• Ou Menu > "Installer Luminous Faith"\n' +
        '• Firefox: Menu > "Installer cette application"\n\n' +
        'L\'application sera accessible depuis votre bureau !'
      );
      return;
    }

    // Instructions générales pour Android et autres
    alert(
      '📱 Installation de l\'application:\n\n' +
      '1. Ouvrez le menu de votre navigateur (⋮)\n' +
      '2. Recherchez "Ajouter à l\'écran d\'accueil" ou "Installer l\'app"\n' +
      '3. Confirmez l\'installation\n\n' +
      'L\'application sera accessible depuis votre écran d\'accueil !'
    );
  }, [deferredPrompt]);

  return { 
    promptInstall, 
    isAvailable: canInstall && !isInstalled,
    isInstalled,
    canInstall,
    updateAvailable
  };
}
