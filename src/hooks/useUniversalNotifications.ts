
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface UniversalNotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  newContent: boolean;
  challengeReminders: boolean;
  communityUpdates: boolean;
  prayerReminders: boolean;
  readingReminders: boolean;
}

export const useUniversalNotifications = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [preferences, setPreferences] = useState<UniversalNotificationPreferences>({
    pushEnabled: false,
    emailEnabled: true,
    newContent: true,
    challengeReminders: true,
    communityUpdates: true,
    prayerReminders: true,
    readingReminders: true
  });
  const [serviceWorker, setServiceWorker] = useState<ServiceWorkerRegistration | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    initializeNotifications();
    loadPreferences();
  }, [user]);

  const initializeNotifications = async () => {
    // Vérifier le support des notifications
    if ('Notification' in window) {
      setIsSupported(true);
      setHasPermission(Notification.permission === 'granted');
    }

    // Enregistrer le service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        setServiceWorker(registration);
        console.log('Service Worker enregistré:', registration);
      } catch (error) {
        console.warn('Service Worker non disponible:', error);
      }
    }
  };

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data: userPrefs } = await supabase
        .from('user_preferences')
        .select('notification_preferences')
        .eq('user_id', user.id)
        .single();

      if (userPrefs?.notification_preferences) {
        setPreferences({
          pushEnabled: hasPermission,
          emailEnabled: true,
          newContent: userPrefs.notification_preferences.dailyVerse || true,
          challengeReminders: userPrefs.notification_preferences.prayerReminder || true,
          communityUpdates: userPrefs.notification_preferences.readingReminder || true,
          prayerReminders: userPrefs.notification_preferences.prayerReminder || true,
          readingReminders: userPrefs.notification_preferences.readingReminder || true
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    }
  };

  const savePreferences = async (newPrefs: UniversalNotificationPreferences) => {
    if (!user) return;

    try {
      setPreferences(newPrefs);
      
      await supabase
        .from('user_preferences')
        .update({
          notification_preferences: {
            dailyVerse: newPrefs.newContent,
            prayerReminder: newPrefs.prayerReminders,
            readingReminder: newPrefs.readingReminders
          }
        })
        .eq('user_id', user.id);

      toast.success('Préférences sauvegardées');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast.error('Les notifications ne sont pas supportées par ce navigateur');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      
      setHasPermission(granted);
      
      if (granted) {
        toast.success('🔔 Notifications push activées !');
        
        // Test immédiat
        setTimeout(() => {
          sendNotification('✨ Notifications activées !', {
            body: 'Vous recevrez maintenant les mises à jour importantes.',
            tag: 'activation-success'
          });
        }, 1000);
        
        // Mettre à jour les préférences
        const newPrefs = { ...preferences, pushEnabled: true };
        await savePreferences(newPrefs);
        
      } else {
        toast.error('Permission refusée. Activez les notifications dans les paramètres de votre navigateur');
      }
      
      return granted;
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      toast.error('Impossible d\'activer les notifications');
      return false;
    }
  }, [preferences]);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!hasPermission || !preferences.pushEnabled) {
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'spiritual-companion',
        requireInteraction: false,
        silent: false,
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-fermeture après 8 secondes
      setTimeout(() => notification.close(), 8000);
      
      return notification;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de notification:', error);
    }
  }, [hasPermission, preferences.pushEnabled]);

  const scheduleNotification = useCallback((title: string, body: string, delay: number) => {
    if (!hasPermission || !preferences.pushEnabled) {
      return;
    }

    setTimeout(() => {
      sendNotification(title, { body });
    }, delay);
  }, [hasPermission, preferences.pushEnabled, sendNotification]);

  const sendEmailNotification = useCallback(async (type: string, data: any) => {
    if (!preferences.emailEnabled || !user) {
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          userId: user.id,
          email: user.email,
          type,
          data
        }
      });

      if (error) {
        console.error('Erreur lors de l\'envoi d\'email:', error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi d\'email:', error);
    }
  }, [preferences.emailEnabled, user]);

  const sendPrayerReminder = useCallback((prayerTime: string) => {
    if (!preferences.prayerReminders) return;

    sendNotification('🙏 Temps de prière', {
      body: `Il est ${prayerTime}, prenez un moment pour prier`,
      tag: 'prayer-reminder'
    });
  }, [preferences.prayerReminders, sendNotification]);

  const sendCommunityNotification = useCallback(async (contentData: {
    type: 'challenge' | 'note' | 'prayer' | 'verse' | 'testimony';
    title: string;
    content: string;
    authorName: string;
  }) => {
    if (!user || !preferences.communityUpdates) return;

    try {
      // Notification push immédiate
      sendNotification(
        `📢 Nouveau ${contentData.type === 'testimony' ? 'témoignage' : contentData.type === 'prayer' ? 'demande de prière' : 'contenu'}`,
        {
          body: `${contentData.authorName} a publié "${contentData.title}"`,
          tag: 'community-update'
        }
      );

      // Notification email
      if (preferences.emailEnabled) {
        await sendEmailNotification('new_community_content', {
          contentType: contentData.type,
          title: contentData.title,
          authorName: contentData.authorName
        });
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi de notifications communautaires:', error);
    }
  }, [user, preferences, sendNotification, sendEmailNotification]);

  const testAllNotifications = useCallback(async () => {
    if (hasPermission && preferences.pushEnabled) {
      sendNotification('🧪 Test notification push', {
        body: 'Votre système de notifications push fonctionne parfaitement !',
        tag: 'test-push'
      });
    }

    if (preferences.emailEnabled && user) {
      await sendEmailNotification('test', {
        message: 'Test de notification par email depuis l\'application'
      });
      toast.success('📧 Email de test envoyé !');
    }

    if (!hasPermission && !preferences.emailEnabled) {
      toast.info('ℹ️ Activez au moins une méthode de notification pour tester');
    }
  }, [hasPermission, preferences, user, sendNotification, sendEmailNotification]);

  return {
    hasPermission,
    isSupported,
    preferences,
    serviceWorker,
    requestPermission,
    savePreferences,
    sendNotification,
    scheduleNotification,
    sendEmailNotification,
    sendPrayerReminder,
    sendCommunityNotification,
    testAllNotifications
  };
};
