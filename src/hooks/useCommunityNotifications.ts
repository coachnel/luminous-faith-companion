
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CommunityNotification {
  id: string;
  user_id: string;
  content_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  sent_at: string;
}

export function useCommunityNotifications() {
  const [notifications, setNotifications] = useState<CommunityNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Charger les notifications
  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      // Pour le moment, utiliser localStorage en attendant la base de données
      const storedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (storedNotifications) {
        const notifs = JSON.parse(storedNotifications);
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n: CommunityNotification) => !n.is_read).length);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Envoyer une notification à tous les utilisateurs
  const sendCommunityNotification = async (contentData: {
    type: 'challenge' | 'note' | 'prayer' | 'verse';
    title: string;
    content: string;
    authorName: string;
  }) => {
    try {
      // Simuler l'envoi à tous les utilisateurs connectés
      const notification = {
        id: Date.now().toString(),
        type: 'new_content',
        title: `📢 Nouveau ${contentData.type === 'challenge' ? 'défi' : contentData.type === 'note' ? 'contenu' : contentData.type === 'prayer' ? 'demande de prière' : 'verset'}`,
        message: `${contentData.authorName} a publié "${contentData.title}". Découvrez ce nouveau contenu dans la communauté !`,
        content_id: Date.now().toString(),
        sent_at: new Date().toISOString(),
        is_read: false
      };

      // Simuler l'envoi aux autres utilisateurs (en réalité, cela se ferait via une fonction edge)
      console.log('Notification envoyée à la communauté:', notification);
      
      // Afficher une notification push si les permissions sont accordées
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/icons/icon-192x192.png'
        });
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
    }
  };

  // Marquer une notification comme lue
  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const storedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (storedNotifications) {
        const notifs = JSON.parse(storedNotifications);
        const updatedNotifs = notifs.map((n: CommunityNotification) => 
          n.id === notificationId ? { ...n, is_read: true } : n
        );
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifs));
        setNotifications(updatedNotifs);
        setUnreadCount(updatedNotifs.filter((n: CommunityNotification) => !n.is_read).length);
      }
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  // Marquer toutes comme lues
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const updatedNotifs = notifications.map(n => ({ ...n, is_read: true }));
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifs));
      setNotifications(updatedNotifs);
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur lors du marquage global comme lu:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    sendCommunityNotification,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
}
