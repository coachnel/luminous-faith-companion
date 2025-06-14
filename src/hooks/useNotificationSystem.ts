
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useUserPreferences } from './useSupabaseData';
import { toast } from 'sonner';

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
    if (!('Notification' in window)) {
      toast.error('Notifications non supportées par ce navigateur');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      
      setPermission(prev => ({ ...prev, granted }));
      
      if (granted) {
        toast.success('Notifications activées !');
        
        // Test immédiat
        setTimeout(() => {
          sendNotification('🎉 Notifications activées !', {
            body: 'Vous recevrez maintenant vos rappels quotidiens',
            tag: 'activation-success'
          });
        }, 1000);

        // Enregistrer le service worker si disponible
        if ('serviceWorker' in navigator) {
          try {
            await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker enregistré pour les notifications');
          } catch (error) {
            console.warn('⚠️ Service Worker non disponible:', error);
          }
        }

        return true;
      } else {
        toast.error('Permission refusée. Activez les notifications dans les paramètres de votre navigateur');
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la demande de permission:', error);
      toast.error('Impossible d\'activer les notifications');
      return false;
    }
  };

  const sendNotification = (title: string, options: NotificationOptions = {}) => {
    if (!permission.granted) {
      console.warn('⚠️ Permission non accordée pour les notifications');
      return null;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'bible-app-reminder',
        requireInteraction: false,
        silent: false,
        renotify: true,
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      notification.onerror = (error) => {
        console.error('❌ Erreur notification:', error);
      };

      notification.onshow = () => {
        console.log('✅ Notification affichée:', title);
      };

      // Auto-fermeture après 8 secondes
      setTimeout(() => {
        try {
          notification.close();
        } catch (e) {
          // Notification déjà fermée
        }
      }, 8000);
      
      return notification;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de notification:', error);
      toast.error('Erreur lors de l\'envoi de la notification');
      return null;
    }
  };

  const scheduleNotification = (title: string, body: string, delayMs: number) => {
    const timeoutId = setTimeout(() => {
      sendNotification(title, { body });
    }, delayMs);

    // Sauvegarder l'ID pour pouvoir l'annuler si nécessaire
    const timeoutKey = `notification-timeout-${Date.now()}`;
    localStorage.setItem(timeoutKey, timeoutId.toString());

    return () => {
      clearTimeout(timeoutId);
      localStorage.removeItem(timeoutKey);
    };
  };

  const startNotificationService = () => {
    if (!user || !preferences || !permission.granted) {
      console.warn('⚠️ Conditions non remplies pour démarrer le service de notifications');
      return;
    }

    console.log('🔔 Service de notifications démarré');
    
    // Nettoyer les anciens intervalles
    clearOldIntervals();

    // Programmer les notifications selon les préférences
    scheduleRecurringNotifications();
  };

  const scheduleRecurringNotifications = () => {
    if (!preferences?.notification_preferences) return;

    const prefs = preferences.notification_preferences;

    // Notification verset du jour à 8h00
    if (prefs.dailyVerse) {
      scheduleDaily(8, 0, () => {
        sendNotification('🌅 Bonjour !', {
          body: 'Découvrez votre verset quotidien et commencez bien la journée',
          tag: 'daily-verse',
          icon: '/icons/icon-192x192.png'
        });
      });
      console.log('📅 Notification verset quotidien programmée (8h00)');
    }

    // Notifications de prière
    if (prefs.prayerReminder) {
      const prayerTimes = [
        { hour: 8, label: 'matinale' },
        { hour: 12, label: 'de midi' },
        { hour: 20, label: 'du soir' }
      ];
      
      prayerTimes.forEach(({ hour, label }) => {
        scheduleDaily(hour, 0, () => {
          sendNotification('🙏 Moment de prière', {
            body: `C'est l'heure de votre prière ${label}. Prenez un instant pour vous recueillir`,
            tag: `prayer-reminder-${hour}`,
            icon: '/icons/icon-192x192.png'
          });
        });
      });
      console.log('📅 Notifications de prière programmées (8h, 12h, 20h)');
    }

    // Notification de lecture à 19h00
    if (prefs.readingReminder) {
      scheduleDaily(19, 0, () => {
        sendNotification('📖 Lecture quotidienne', {
          body: 'Il est temps de lire votre passage quotidien. Continuez votre progression !',
          tag: 'reading-reminder',
          icon: '/icons/icon-192x192.png'
        });
      });
      console.log('📅 Notification lecture quotidienne programmée (19h00)');
    }
  };

  const clearOldIntervals = () => {
    try {
      // Nettoyer tous les anciens intervalles et timeouts
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('notification-interval-') || key.startsWith('notification-timeout-')
      );
      
      keys.forEach(key => {
        const id = localStorage.getItem(key);
        if (id) {
          if (key.includes('interval')) {
            clearInterval(parseInt(id));
          } else {
            clearTimeout(parseInt(id));
          }
          localStorage.removeItem(key);
        }
      });
      
      console.log('🧹 Anciens intervalles/timeouts nettoyés');
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage:', error);
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
    
    // Premier déclenchement
    const timeoutId = setTimeout(() => {
      callback();
      
      // Puis répéter chaque 24h
      const intervalId = setInterval(callback, 24 * 60 * 60 * 1000);
      
      // Sauvegarder l'ID de l'intervalle
      localStorage.setItem(`notification-interval-${hour}-${minute}`, intervalId.toString());
      
      console.log(`⏰ Notification récurrente configurée pour ${hour}:${minute.toString().padStart(2, '0')}`);
    }, delay);

    // Sauvegarder l'ID du timeout initial
    localStorage.setItem(`notification-timeout-${hour}-${minute}`, timeoutId.toString());
    
    const nextTime = scheduledTime.toLocaleString('fr-FR');
    console.log(`⏰ Prochaine notification à ${hour}:${minute.toString().padStart(2, '0')} (${nextTime})`);
  };

  // Test de notification
  const testNotification = () => {
    if (!permission.granted) {
      toast.error('Veuillez d\'abord activer les notifications');
      return false;
    }

    const success = sendNotification('🔔 Test de notification', {
      body: 'Votre système de notifications fonctionne parfaitement ! Vous recevrez vos rappels quotidiens.',
      tag: 'test-notification',
      requireInteraction: true
    });

    if (success) {
      toast.success('Notification de test envoyée !');
      return true;
    } else {
      toast.error('Erreur lors du test de notification');
      return false;
    }
  };

  return {
    permission,
    requestPermission,
    sendNotification,
    scheduleNotification,
    testNotification,
    clearOldIntervals
  };
};
