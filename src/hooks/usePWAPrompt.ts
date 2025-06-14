
import { useEffect, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      const isInWebAppChrome = window.matchMedia('(display-mode: minimal-ui)').matches;
      const installed = isStandalone || isInWebAppiOS || isInWebAppChrome;
      setIsInstalled(installed);
      
      // Vérifier si l'installation est possible
      const canInstallApp = !installed && 'serviceWorker' in navigator;
      setCanInstall(canInstallApp);
    };

    checkInstallStatus();

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setCanInstall(true);
      
      // Dispatche un événement personnalisé
      window.dispatchEvent(new CustomEvent("pwa-install-available"));
      console.log('PWA: Installation disponible');
    };

    // Écouter l'événement appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
      console.log('PWA: Application installée');
      
      // Track installation without external dependencies
      console.log('PWA installation completed');
    };

    // Écouter les changements de mode d'affichage
    const mediaQueries = [
      window.matchMedia('(display-mode: standalone)'),
      window.matchMedia('(display-mode: minimal-ui)')
    ];
    
    const handleDisplayModeChange = () => {
      checkInstallStatus();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    
    mediaQueries.forEach(mq => {
      mq.addEventListener('change', handleDisplayModeChange);
    });

    // Vérification pour les navigateurs desktop
    const isDesktop = window.innerWidth >= 1024;
    const isChrome = navigator.userAgent.includes('Chrome');
    const isEdge = navigator.userAgent.includes('Edg');
    
    if ((isChrome || isEdge) && isDesktop && !isInstalled) {
      // Délai pour permettre au prompt natif de se charger
      const timer = setTimeout(() => {
        if (!deferredPrompt && !isInstalled) {
          setCanInstall(true);
          window.dispatchEvent(new CustomEvent("pwa-install-available"));
        }
      }, 3000);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("appinstalled", handleAppInstalled);
        mediaQueries.forEach(mq => {
          mq.removeEventListener('change', handleDisplayModeChange);
        });
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      mediaQueries.forEach(mq => {
        mq.removeEventListener('change', handleDisplayModeChange);
      });
    };
  }, [deferredPrompt, isInstalled]);

  // Fonction pour déclencher l'installation
  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      // Pour les navigateurs qui ne supportent pas beforeinstallprompt
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isDesktop = window.innerWidth >= 1024;
      
      if (isIOS) {
        alert(
          'Pour installer cette application sur iOS:\n\n' +
          '1. Appuyez sur le bouton de partage (📤)\n' +
          '2. Sélectionnez "Ajouter à l\'écran d\'accueil"\n' +
          '3. Confirmez l\'ajout'
        );
        return;
      }
      
      if (isDesktop) {
        alert(
          'Pour installer cette application sur votre ordinateur:\n\n' +
          '1. Cliquez sur l\'icône d\'installation dans la barre d\'adresse\n' +
          '2. Ou utilisez le menu navigateur → "Installer Luminous Faith"\n' +
          '3. Confirmez l\'installation'
        );
        return;
      }
      
      throw new Error('Installation non disponible');
    }

    try {
      // Afficher le prompt d'installation
      await deferredPrompt.prompt();
      
      // Attendre le choix de l'utilisateur
      const choiceResult = await deferredPrompt.userChoice;
      
      console.log('PWA: Choix utilisateur:', choiceResult.outcome);
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA: Installation acceptée');
      } else {
        console.log('PWA: Installation refusée');
      }
      
      // Nettoyer le prompt
      setDeferredPrompt(null);
      setCanInstall(false);
      
    } catch (error) {
      console.error('Erreur lors du prompt d\'installation:', error);
      throw error;
    }
  }, [deferredPrompt]);

  return { 
    promptInstall, 
    isAvailable: canInstall && !isInstalled,
    isInstalled,
    canInstall
  };
}
