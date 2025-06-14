
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export const useNotificationSystem = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Vérifier le support des notifications
    if ('Notification' in window) {
      setIsSupported(true);
      setHasPermission(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast.error('Les notifications ne sont pas supportées par ce navigateur');
      return false;
    }

    setIsLoading(true);
    
    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      
      setHasPermission(granted);
      
      if (granted) {
        toast.success('Notifications activées avec succès !');
        
        // Test de notification immédiat
        setTimeout(() => {
          try {
            new Notification('🎉 Notifications activées !', {
              body: 'Vos rappels sont maintenant opérationnels',
              icon: '/icons/icon-192x192.png',
              tag: 'activation-test',
              requireInteraction: false
            });
          } catch (error) {
            console.warn('Erreur lors du test de notification:', error);
          }
        }, 1000);
        
        // Enregistrer le service worker pour les notifications persistantes
        if ('serviceWorker' in navigator) {
          try {
            await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker enregistré pour les notifications');
          } catch (error) {
            console.warn('Service Worker non disponible:', error);
          }
        }
      } else {
        toast.error('Permission refusée. Activez les notifications dans les paramètres de votre navigateur');
      }
      
      return granted;
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      toast.error('Impossible d\'activer les notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const testNotification = useCallback(() => {
    if (!hasPermission) {
      toast.error('Veuillez d\'abord activer les notifications');
      return;
    }

    try {
      new Notification('🔔 Test de notification', {
        body: 'Votre système de notifications fonctionne parfaitement !',
        icon: '/icons/icon-192x192.png',
        tag: 'test-notification',
        requireInteraction: false
      });
      toast.success('Notification de test envoyée');
    } catch (error) {
      console.error('Erreur lors du test:', error);
      toast.error('Erreur lors du test de notification');
    }
  }, [hasPermission]);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!hasPermission) {
      console.warn('Notifications non autorisées');
      return;
    }

    try {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        requireInteraction: false,
        ...options
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de notification:', error);
    }
  }, [hasPermission]);

  const scheduleNotification = useCallback((title: string, body: string, delay: number) => {
    if (!hasPermission) {
      console.warn('Notifications non autorisées');
      return;
    }

    setTimeout(() => {
      sendNotification(title, { body });
    }, delay);
  }, [hasPermission, sendNotification]);

  return {
    hasPermission,
    isSupported,
    isLoading,
    requestPermission,
    testNotification,
    sendNotification,
    scheduleNotification
  };
};
