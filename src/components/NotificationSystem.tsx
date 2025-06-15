
import React, { useEffect } from 'react';
import { useCommunityNotifications } from '@/hooks/useCommunityContent';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';

const NotificationSystem: React.FC = () => {
  const { notifications, unreadCount, markAsRead } = useCommunityNotifications();
  const { user } = useAuth();

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (user && notifications.length > 0) {
      const latestNotification = notifications[0];
      
      if (!latestNotification.is_read) {
        // Afficher une notification toast
        toast.info(latestNotification.title, {
          description: latestNotification.message,
          action: {
            label: 'Marquer comme lu',
            onClick: () => markAsRead(latestNotification.id)
          }
        });

        // Afficher une notification push si autorisée
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(latestNotification.title, {
            body: latestNotification.message,
            icon: '/icon-192x192.png',
            badge: '/icon-72x72.png',
            tag: 'community-notification'
          });
        }
      }
    }
  }, [notifications, user, markAsRead]);

  if (!user || unreadCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <div className="bg-blue-500 text-white p-3 rounded-full shadow-lg">
          <Bell className="h-5 w-5" />
        </div>
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSystem;
