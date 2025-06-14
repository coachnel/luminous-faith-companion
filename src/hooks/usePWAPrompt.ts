
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
      const installed = isStandalone || isInWebAppiOS;
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
      
      // Analytics ou tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install', {
          event_category: 'engagement'
        });
      }
    };

    // Écouter les changements de mode d'affichage
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => {
      checkInstallStatus();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    // Vérification périodique pour iOS (qui ne supporte pas beforeinstallprompt)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && !isInstalled) {
      const timer = setTimeout(() => {
        if (!isInstalled) {
          setCanInstall(true);
          window.dispatchEvent(new CustomEvent("pwa-install-available"));
        }
      }, 2000);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("appinstalled", handleAppInstalled);
        mediaQuery.removeEventListener('change', handleDisplayModeChange);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  // Fonction pour déclencher l'installation
  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      // Pour iOS, afficher des instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        alert(
          'Pour installer cette application sur iOS:\n\n' +
          '1. Appuyez sur le bouton de partage (📤)\n' +
          '2. Sélectionnez "Ajouter à l\'écran d\'accueil"\n' +
          '3. Confirmez l\'ajout'
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
