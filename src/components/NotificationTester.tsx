
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Bell, TestTube, AlertCircle, CheckCircle } from 'lucide-react';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { toast } from '@/hooks/use-toast';

const NotificationTester = () => {
  const { hasPermission, isSupported, requestPermission, testNotification, sendNotification } = useNotificationSystem();

  const testDifferentNotifications = () => {
    if (!hasPermission) {
      toast({
        title: "Permission requise",
        description: "Veuillez d'abord activer les notifications",
        variant: "destructive",
      });
      return;
    }

    // Test immédiat
    sendNotification('🔔 Test immédiat', {
      body: 'Cette notification s\'affiche immédiatement',
      icon: '/icons/icon-192x192.png',
      tag: 'test-immediate'
    });

    // Test avec délai
    setTimeout(() => {
      sendNotification('⏰ Test avec délai', {
        body: 'Cette notification s\'affiche après 3 secondes',
        icon: '/icons/icon-192x192.png',
        tag: 'test-delayed'
      });
    }, 3000);

    // Test de notification persistante
    setTimeout(() => {
      sendNotification('📌 Test persistant', {
        body: 'Cette notification reste affichée plus longtemps',
        icon: '/icons/icon-192x192.png',
        tag: 'test-persistent',
        requireInteraction: true
      });
    }, 6000);

    toast({
      title: "Tests lancés",
      description: "3 notifications vont s'afficher dans les prochaines secondes",
    });
  };

  const testNotificationWhileAway = () => {
    if (!hasPermission) {
      toast({
        title: "Permission requise",
        description: "Veuillez d'abord activer les notifications",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Test programmé",
      description: "Une notification apparaîtra dans 10 secondes. Vous pouvez changer d'onglet pour tester.",
    });

    setTimeout(() => {
      sendNotification('🔔 Test en arrière-plan', {
        body: 'Cette notification fonctionne même quand l\'onglet n\'est pas actif',
        icon: '/icons/icon-192x192.png',
        tag: 'test-background',
        requireInteraction: true
      });
    }, 10000);
  };

  return (
    <ModernCard variant="elevated">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
          <TestTube className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[var(--text-primary)]">Test des notifications</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Vérifiez le bon fonctionnement des notifications
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Statut des notifications */}
        <div className="p-4 rounded-lg bg-[var(--background-secondary)]">
          <div className="flex items-center gap-2 mb-2">
            {isSupported ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="font-medium">
              Support : {isSupported ? 'Notifications supportées' : 'Non supportées'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {hasPermission ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-500" />
            )}
            <span className="font-medium">
              Permission : {hasPermission ? 'Accordée' : 'Non accordée'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {!hasPermission && (
            <ModernButton
              onClick={requestPermission}
              className="w-full"
              variant="primary"
            >
              <Bell className="h-4 w-4 mr-2" />
              Activer les notifications
            </ModernButton>
          )}

          {hasPermission && (
            <>
              <ModernButton
                onClick={testNotification}
                className="w-full"
                variant="outline"
              >
                <Bell className="h-4 w-4 mr-2" />
                Test simple
              </ModernButton>

              <ModernButton
                onClick={testDifferentNotifications}
                className="w-full"
                variant="outline"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Test multiple (3 notifications)
              </ModernButton>

              <ModernButton
                onClick={testNotificationWhileAway}
                className="w-full"
                variant="outline"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Test en arrière-plan (10s)
              </ModernButton>
            </>
          )}
        </div>

        <div className="text-xs text-[var(--text-secondary)] p-3 bg-[var(--background-secondary)] rounded-lg">
          <strong>Note :</strong> Les notifications fonctionnent sur tous les navigateurs modernes. 
          Sur mobile, elles apparaissent même quand l'application est fermée. 
          Testez en changeant d'onglet ou en minimisant l'application.
        </div>
      </div>
    </ModernCard>
  );
};

export default NotificationTester;
