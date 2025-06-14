
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
  }, []);

  useEffect(() => {
    if (permission.granted && preferences?.notification_preferences) {
      startNotificationService();
    }
  }, [permission.granted, preferences]);

  const checkNotificationSupport = () => {
    if (!('Notification' in window)) {
      setPermission({
        granted: false,
        supported: false,
        error: 'Les notifications ne sont pas supportées par ce navigateur'
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

  const sendNotification = (title: string, options: NotificationOptions = {}) => {
    if (!permission.granted) return;

    try {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'spiritual-reminder',
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

    console.log('🔔 Démarrage du service de notifications');

    // Programmer les notifications quotidiennes
    scheduleQuotidienneNotifications();
  };

  const scheduleQuotidienneNotifications = () => {
    // Notification verset du jour à 8h00
    if (preferences?.notification_preferences?.dailyVerse) {
      scheduleDaily(8, 0, () => {
        sendNotification(
          '🌅 Bonjour !',
          { body: 'Découvrez votre verset quotidien pour nourrir votre âme' }
        );
      });
    }

    // Notifications de prière
    if (preferences?.notification_preferences?.prayerReminder) {
      const prayerTimes = [8, 12, 20];
      prayerTimes.forEach(hour => {
        scheduleDaily(hour, 0, () => {
          sendNotification(
            '🙏 Moment de prière',
            { body: 'Prenez un instant pour vous recueillir et prier' }
          );
        });
      });
    }

    // Notification de lecture à 19h00
    if (preferences?.notification_preferences?.readingReminder) {
      scheduleDaily(19, 0, () => {
        sendNotification(
          '📖 Lecture de la Bible',
          { body: 'Il est temps de lire votre passage quotidien' }
        );
      });
    }
  };

  const scheduleDaily = (hour: number, minute: number, callback: () => void) => {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);
    
    // Si l'heure est déjà passée aujourd'hui, programmer pour demain
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const delay = scheduledTime.getTime() - now.getTime();
    
    setTimeout(() => {
      callback();
      // Programmer pour le jour suivant
      setInterval(callback, 24 * 60 * 60 * 1000);
    }, delay);
  };

  return {
    permission,
    requestPermission,
    sendNotification,
    scheduleNotification
  };
};
