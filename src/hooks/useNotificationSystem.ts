
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

    if (Notification.permission === 'granted') {
      setHasPermission(true);
      toast.success('Notifications déjà activées !');
      return true;
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
            const notification = new Notification('🎉 Notifications activées !', {
              body: 'Vous recevrez maintenant des rappels pour vos prières et défis',
              icon: '/icons/icon-192x192.png',
              badge: '/icons/icon-192x192.png',
              tag: 'activation-test',
              requireInteraction: false,
              silent: false
            });

            // Auto fermeture après 5 secondes
            setTimeout(() => {
              notification.close();
            }, 5000);

            notification.onclick = () => {
              window.focus();
              notification.close();
            };

          } catch (error) {
            console.warn('Erreur lors du test de notification:', error);
          }
        }, 1000);
        
        // Enregistrer le service worker pour les notifications persistantes
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker enregistré pour les notifications:', registration);
            
            // S'assurer que le SW est actif
            if (registration.active) {
              console.log('Service Worker actif et prêt pour les notifications');
            }
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
      const notification = new Notification('🔔 Test de notification', {
        body: 'Votre système de notifications fonctionne parfaitement !',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'test-notification',
        requireInteraction: false
      });

      // Auto fermeture
      setTimeout(() => {
        notification.close();
      }, 8000);

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

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
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        requireInteraction: false,
        ...options
      });

      // Auto fermeture après 10 secondes si pas d'interaction
      setTimeout(() => {
        notification.close();
      }, 10000);

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de notification:', error);
    }
  }, [hasPermission]);

  const scheduleNotification = useCallback((title: string, body: string, delay: number) => {
    if (!hasPermission) {
      console.warn('Notifications non autorisées');
      return;
    }

    const timeoutId = setTimeout(() => {
      sendNotification(title, { body });
    }, delay);

    return timeoutId;
  }, [hasPermission, sendNotification]);

  const scheduleDailyReminder = useCallback((hour: number, minute: number, title: string, body: string) => {
    if (!hasPermission) {
      console.warn('Notifications non autorisées');
      return;
    }

    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);

    // Si l'heure est déjà passée aujourd'hui, programmer pour demain
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();
    
    return scheduleNotification(title, body, delay);
  }, [hasPermission, scheduleNotification]);

  return {
    hasPermission,
    isSupported,
    isLoading,
    requestPermission,
    testNotification,
    sendNotification,
    scheduleNotification,
    scheduleDailyReminder
  };
};
