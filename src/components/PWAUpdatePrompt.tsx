import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, X, Monitor, Smartphone, Tablet } from 'lucide-react';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { usePWAPrompt } from '@/hooks/usePWAPrompt';

const PWAUpdatePrompt = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const { promptInstall, isAvailable } = usePWAPrompt();

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    const isInWebAppChrome = window.matchMedia('(display-mode: minimal-ui)').matches;
    const isInstalled = isStandalone || isInWebAppiOS || isInWebAppChrome;

    console.log('PWAUpdatePrompt: État installation', { isInstalled, isAvailable });

    // Afficher le prompt d'installation si pas installé et disponible
    if (!isInstalled && isAvailable) {
      const timer = setTimeout(() => {
        const installDismissed = localStorage.getItem('pwa-install-dismissed');
        const lastDismissed = installDismissed ? parseInt(installDismissed) : 0;
        const daysSinceDismissed = (Date.now() - lastDismissed) / (1000 * 60 * 60 * 24);
        
        // Réafficher le prompt après 1 jour
        if (daysSinceDismissed > 1 || !installDismissed) {
          setShowInstallPrompt(true);
          console.log('PWAUpdatePrompt: Affichage du prompt d\'installation');
        }
      }, 3000);

      return () => clearTimeout(timer);
    }

    // Écouter les événements PWA
    const handlePWAInstallAvailable = () => {
      if (!isInstalled) {
        const installDismissed = localStorage.getItem('pwa-install-dismissed');
        const lastDismissed = installDismissed ? parseInt(installDismissed) : 0;
        const daysSinceDismissed = (Date.now() - lastDismissed) / (1000 * 60 * 60 * 24);
        
        if (daysSinceDismissed > 1 || !installDismissed) {
          setShowInstallPrompt(true);
        }
      }
    };

    const handleUpdateAvailable = () => {
      setUpdateAvailable(true);
      setShowUpdatePrompt(true);
    };

    const handleSWMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        handleUpdateAvailable();
      }
    };

    // Vérifier les mises à jour du service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
      
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
          handleUpdateAvailable();
        }
      });
    }

    window.addEventListener('pwa-install-available', handlePWAInstallAvailable);
    window.addEventListener('pwa-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('pwa-install-available', handlePWAInstallAvailable);
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      }
    };
  }, [isAvailable]);

  const handleInstall = async () => {
    try {
      await promptInstall();
      setShowInstallPrompt(false);
      console.log('PWA: Installation déclenchée');
    } catch (error) {
      console.error('Erreur lors de l\'installation PWA:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          });
        } else {
          window.location.reload();
        }
      } else {
        window.location.reload();
      }
      
      setShowUpdatePrompt(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      window.location.reload();
    }
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const handleDismissUpdate = () => {
    setShowUpdatePrompt(false);
    setTimeout(() => {
      if (updateAvailable) {
        setShowUpdatePrompt(true);
      }
    }, 30 * 60 * 1000);
  };

  // Détecter le type d'appareil pour l'icône
  const getDeviceIcon = () => {
    const width = window.innerWidth;
    if (width >= 1024) return Monitor;
    if (width >= 768) return Tablet;
    return Smartphone;
  };

  const DeviceIcon = getDeviceIcon();

  // Adapter le message selon l'appareil
  const getInstallMessage = () => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isDesktop = window.innerWidth >= 1024;
    
    if (isIOS) {
      return "Accès rapide depuis votre écran d'accueil, notifications et fonctionnement hors-ligne";
    }
    if (isDesktop) {
      return "Accès rapide depuis votre bureau, notifications et fonctionnement hors-ligne";
    }
    return "Accès rapide depuis votre écran d'accueil, notifications et fonctionnement hors-ligne";
  };

  if (!showInstallPrompt && !showUpdatePrompt) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-center">
      <ModernCard className="max-w-sm w-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 backdrop-blur-md">
        {showInstallPrompt && (
          <div className="flex items-center gap-3 p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-[var(--text-primary)] text-sm">
                  Installer l'application
                </h3>
                <DeviceIcon className="h-4 w-4 text-[var(--text-secondary)]" />
              </div>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                {getInstallMessage()}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <ModernButton size="sm" onClick={handleInstall} className="text-xs">
                Installer
              </ModernButton>
              <ModernButton 
                variant="ghost" 
                size="sm" 
                onClick={handleDismissInstall}
                className="p-1"
              >
                <X className="h-4 w-4" />
              </ModernButton>
            </div>
          </div>
        )}

        {showUpdatePrompt && (
          <div className="flex items-center gap-3 p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[var(--text-primary)] text-sm">
                Mise à jour disponible
              </h3>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                Nouvelles fonctionnalités et améliorations de performance
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <ModernButton size="sm" onClick={handleUpdate} className="text-xs">
                Mettre à jour
              </ModernButton>
              <ModernButton 
                variant="ghost" 
                size="sm" 
                onClick={handleDismissUpdate}
                className="p-1"
              >
                <X className="h-4 w-4" />
              </ModernButton>
            </div>
          </div>
        )}
      </ModernCard>
    </div>
  );
};

export default PWAUpdatePrompt;
