
import React, { useEffect } from 'react';
import { useCommunityNotifications } from '@/hooks/useCommunityContent';
import { useUniversalNotifications } from '@/hooks/useUniversalNotifications';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';

const NotificationSystem: React.FC = () => {
  const { notifications, unreadCount, markAsRead } = useCommunityNotifications();
  const { sendNotification, hasPermission } = useUniversalNotifications();
  const { user } = useAuth();

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
        if (hasPermission) {
          sendNotification(latestNotification.title, {
            body: latestNotification.message,
            tag: 'community-notification'
          });
        }
      }
    }
  }, [notifications, user, markAsRead, hasPermission, sendNotification]);

  if (!user || unreadCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 lg:bottom-6 lg:right-6">
      <div className="relative">
        <div className="bg-blue-500 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors cursor-pointer">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-[10px] xs:text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSystem;
