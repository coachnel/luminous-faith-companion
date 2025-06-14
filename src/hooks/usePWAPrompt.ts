
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
      const isInWebAppFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
      const installed = isStandalone || isInWebAppiOS || isInWebAppChrome || isInWebAppFullscreen;
      setIsInstalled(installed);
      
      console.log('PWA: Status d\'installation vérifié', { installed, isStandalone, isInWebAppiOS, isInWebAppChrome });
      
      // Autoriser l'installation si pas encore installé
      if (!installed) {
        setCanInstall(true);
      }
    };

    checkInstallStatus();

    // Écouter l'événement beforeinstallprompt (principalement Chrome/Edge)
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

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    
    mediaQueries.forEach(mq => {
      mq.addEventListener('change', handleDisplayModeChange);
    });

    // Configuration spécifique par type d'appareil
    const userAgent = navigator.userAgent;
    const isDesktop = window.innerWidth >= 1024;
    const isChrome = userAgent.includes('Chrome') && !userAgent.includes('Edg');
    const isEdge = userAgent.includes('Edg');
    const isFirefox = userAgent.includes('Firefox');
    const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = userAgent.includes('Android');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    console.log('PWA: Détection appareil', { 
      isDesktop, isChrome, isEdge, isFirefox, isSafari, 
      isIOS, isAndroid, isMobile, userAgent 
    });

    // Activer l'installation pour tous les navigateurs compatibles
    if (!isInstalled) {
      const timer = setTimeout(() => {
        if ((isChrome || isEdge || isFirefox || (isSafari && isIOS) || isAndroid) && !deferredPrompt && !isInstalled) {
          setCanInstall(true);
          window.dispatchEvent(new CustomEvent("pwa-install-available"));
          console.log('PWA: Installation activée pour ce navigateur');
        }
      }, 2000);

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
    canInstall
  };
}
