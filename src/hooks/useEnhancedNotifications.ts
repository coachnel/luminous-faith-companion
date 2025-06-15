
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  newContent: boolean;
  challengeReminders: boolean;
  communityUpdates: boolean;
}

export const useEnhancedNotifications = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    pushEnabled: false,
    emailEnabled: true,
    newContent: true,
    challengeReminders: true,
    communityUpdates: true
  });
  const { user } = useAuth();

  useEffect(() => {
    // Vérifier le support des notifications
    if ('Notification' in window) {
      setIsSupported(true);
      setHasPermission(Notification.permission === 'granted');
    }

    // Charger les préférences utilisateur
    loadPreferences();
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const stored = localStorage.getItem(`notification_prefs_${user.id}`);
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    }
  };

  const savePreferences = async (newPrefs: NotificationPreferences) => {
    if (!user) return;

    try {
      setPreferences(newPrefs);
      localStorage.setItem(`notification_prefs_${user.id}`, JSON.stringify(newPrefs));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
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
        toast.success('Notifications push activées !');
        
        // Mettre à jour les préférences
        const newPrefs = { ...preferences, pushEnabled: true };
        await savePreferences(newPrefs);
        
        // Test de notification
        setTimeout(() => {
          sendPushNotification('🔔 Notifications activées !', 'Vous recevrez maintenant les mises à jour importantes.');
        }, 1000);
        
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

  const sendPushNotification = useCallback((title: string, body: string, options?: NotificationOptions) => {
    if (!hasPermission || !preferences.pushEnabled) {
      return;
    }

    try {
      const notification = new Notification(title, {
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'spiritual-companion',
        requireInteraction: false,
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setTimeout(() => notification.close(), 8000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de notification push:', error);
    }
  }, [hasPermission, preferences.pushEnabled]);

  const sendEmailNotification = useCallback(async (type: string, data: any) => {
    if (!preferences.emailEnabled || !user) {
      return;
    }

    try {
      // Appeler la fonction edge pour envoyer l'email
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

  const sendCommunityNotification = useCallback(async (contentData: {
    type: 'challenge' | 'note' | 'prayer' | 'verse';
    title: string;
    content: string;
    authorName: string;
  }) => {
    if (!user) return;

    try {
      // Notification push immédiate
      if (preferences.newContent) {
        sendPushNotification(
          `📢 Nouveau ${contentData.type === 'challenge' ? 'défi' : contentData.type === 'note' ? 'contenu' : contentData.type === 'prayer' ? 'demande de prière' : 'verset'}`,
          `${contentData.authorName} a publié "${contentData.title}"`
        );
      }

      // Notification email (envoyée via edge function)
      if (preferences.emailEnabled && preferences.newContent) {
        await sendEmailNotification('new_community_content', {
          contentType: contentData.type,
          title: contentData.title,
          authorName: contentData.authorName
        });
      }

      // Envoyer via edge function pour notifier tous les utilisateurs
      const { error } = await supabase.functions.invoke('notify-community', {
        body: {
          contentId: Date.now().toString(),
          authorName: contentData.authorName,
          type: contentData.type,
          title: contentData.title
        }
      });

      if (error) {
        console.error('Erreur lors de la notification communautaire:', error);
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi de notifications:', error);
    }
  }, [user, preferences, sendPushNotification, sendEmailNotification]);

  const sendChallengeReminder = useCallback((challengeTitle: string) => {
    if (!preferences.challengeReminders) return;

    sendPushNotification(
      '⏰ Rappel de défi',
      `N'oubliez pas de valider votre défi : ${challengeTitle}`
    );
  }, [preferences.challengeReminders, sendPushNotification]);

  const testNotifications = useCallback(async () => {
    // Test notification push
    if (hasPermission && preferences.pushEnabled) {
      sendPushNotification('🧪 Test notification push', 'Votre système de notifications push fonctionne !');
    }

    // Test notification email
    if (preferences.emailEnabled && user) {
      await sendEmailNotification('test', {
        message: 'Test de notification par email'
      });
      toast.success('Email de test envoyé !');
    }

    if (!hasPermission && !preferences.emailEnabled) {
      toast.info('Activez au moins une méthode de notification pour tester');
    }
  }, [hasPermission, preferences, user, sendPushNotification, sendEmailNotification]);

  return {
    hasPermission,
    isSupported,
    preferences,
    requestPermission,
    savePreferences,
    sendPushNotification,
    sendEmailNotification,
    sendCommunityNotification,
    sendChallengeReminder,
    testNotifications
  };
};
