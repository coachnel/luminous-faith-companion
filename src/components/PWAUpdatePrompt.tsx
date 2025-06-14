
import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, X } from 'lucide-react';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { usePWAPrompt } from '@/hooks/usePWAPrompt';

const PWAUpdatePrompt = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const { promptInstall, isAvailable } = usePWAPrompt();

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    const isInstalled = isStandalone || isInWebAppiOS;

    // Afficher le prompt d'installation si pas installé et disponible
    if (!isInstalled && isAvailable) {
      setShowInstallPrompt(true);
    }

    // Écouter les événements PWA
    const handlePWAInstallAvailable = () => setShowInstallPrompt(true);
    const handleUpdateAvailable = () => setShowUpdatePrompt(true);

    window.addEventListener('pwa-install-available', handlePWAInstallAvailable);
    window.addEventListener('pwa-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('pwa-install-available', handlePWAInstallAvailable);
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
    };
  }, [isAvailable]);

  const handleInstall = () => {
    promptInstall();
    setShowInstallPrompt(false);
  };

  const handleUpdate = () => {
    window.location.reload();
    setShowUpdatePrompt(false);
  };

  if (!showInstallPrompt && !showUpdatePrompt) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-center">
      <ModernCard className="max-w-sm w-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        {showInstallPrompt && (
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--text-primary)] text-sm">
                Installer l'application
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Accès rapide depuis votre écran d'accueil
              </p>
            </div>
            <div className="flex gap-2">
              <ModernButton size="sm" onClick={handleInstall}>
                Installer
              </ModernButton>
              <ModernButton 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowInstallPrompt(false)}
              >
                <X className="h-4 w-4" />
              </ModernButton>
            </div>
          </div>
        )}

        {showUpdatePrompt && (
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
              <RefreshCw className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--text-primary)] text-sm">
                Mise à jour disponible
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Nouvelles fonctionnalités et améliorations
              </p>
            </div>
            <div className="flex gap-2">
              <ModernButton size="sm" onClick={handleUpdate}>
                Mettre à jour
              </ModernButton>
              <ModernButton 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowUpdatePrompt(false)}
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
