
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useUserPreferences } from './useSupabaseData';

interface NotificationPermission {
  granted: boolean;
  supported: boolean;
  error?: string;
}

export const useNotificationSystem = () => {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    supported: false
  });
  const { user } = useAuth();
  const { preferences } = useUserPreferences();

  useEffect(() => {
    checkNotificationSupport();
    startNotificationService();
  }, [user, preferences]);

  const checkNotificationSupport = async () => {
    if (!('Notification' in window)) {
      setPermission({
        granted: false,
        supported: false,
        error: 'Les notifications ne sont pas supportées par ce navigateur'
      });
      return;
    }

    if (!('serviceWorker' in navigator)) {
      setPermission({
        granted: false,
        supported: false,
        error: 'Service Worker non supporté'
      });
      return;
    }

    const currentPermission = Notification.permission;
    setPermission({
      granted: currentPermission === 'granted',
      supported: true
    });
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) return false;

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      
      setPermission(prev => ({ ...prev, granted }));
      
      if (granted) {
        await registerServiceWorker();
        console.log('✅ Notifications activées avec succès');
      }
      
      return granted;
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      setPermission(prev => ({ 
        ...prev, 
        error: 'Impossible d\'activer les notifications' 
      }));
      return false;
    }
  };

  const registerServiceWorker = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker enregistré:', registration);
        return registration;
      }
    } catch (error) {
      console.error('Erreur Service Worker:', error);
    }
  };

  const sendNotification = (title: string, options: NotificationOptions = {}) => {
    if (!permission.granted) return;

    try {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'spiritual-reminder',
        requireInteraction: true,
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-fermeture après 10 secondes
      setTimeout(() => notification.close(), 10000);
      
      return notification;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de notification:', error);
    }
  };

  const scheduleNotification = (title: string, body: string, delayMs: number) => {
    setTimeout(() => {
      sendNotification(title, { body });
    }, delayMs);
  };

  const startNotificationService = () => {
    if (!user || !preferences || !permission.granted) return;

    // Notifications quotidiennes programmées
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0); // 8h00 demain

    const msUntilTomorrow = tomorrow.getTime() - now.getTime();

    // Notification quotidienne
    setTimeout(() => {
      sendNotification(
        '🌅 Bonjour !',
        { body: 'Commencez votre journée avec une lecture spirituelle' }
      );
      
      // Programmer pour tous les jours suivants
      setInterval(() => {
        sendNotification(
          '🌅 Bonjour !',
          { body: 'Commencez votre journée avec une lecture spirituelle' }
        );
      }, 24 * 60 * 60 * 1000); // Chaque 24h
      
    }, msUntilTomorrow);

    // Notifications des préférences utilisateur
    if (preferences.notification_preferences?.prayerReminder) {
      schedulePrayerReminders();
    }

    if (preferences.notification_preferences?.readingReminder) {
      scheduleReadingReminders();
    }
  };

  const schedulePrayerReminders = () => {
    const times = ['08:00', '12:00', '20:00'];
    times.forEach(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);
      
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      const delay = scheduledTime.getTime() - now.getTime();
      
      setTimeout(() => {
        sendNotification(
          '🙏 Moment de prière',
          { body: 'Prenez un instant pour vous recueillir et prier' }
        );
        
        // Répéter chaque jour
        setInterval(() => {
          sendNotification(
            '🙏 Moment de prière',
            { body: 'Prenez un instant pour vous recueillir et prier' }
          );
        }, 24 * 60 * 60 * 1000);
        
      }, delay);
    });
  };

  const scheduleReadingReminders = () => {
    const scheduledTime = new Date();
    scheduledTime.setHours(19, 0, 0, 0); // 19h00
    
    const now = new Date();
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const delay = scheduledTime.getTime() - now.getTime();
    
    setTimeout(() => {
      sendNotification(
        '📖 Lecture de la Bible',
        { body: 'Il est temps de lire votre passage quotidien' }
      );
      
      // Répéter chaque jour
      setInterval(() => {
        sendNotification(
          '📖 Lecture de la Bible',
          { body: 'Il est temps de lire votre passage quotidien' }
        );
      }, 24 * 60 * 60 * 1000);
      
    }, delay);
  };

  return {
    permission,
    requestPermission,
    sendNotification,
    scheduleNotification
  };
};
