
import { useEffect } from 'react';
import { useUserPreferences } from './useSupabaseData';

export const useNotifications = () => {
  const { preferences } = useUserPreferences();

  useEffect(() => {
    if (!('Notification' in window)) {
      console.log('Ce navigateur ne supporte pas les notifications');
      return;
    }

    // Demander permission si pas encore accordée
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const scheduleNotification = (title: string, body: string, delay: number = 0) => {
    if (Notification.permission === 'granted') {
      setTimeout(() => {
        const notification = new Notification(title, {
          body,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
          tag: 'spiritual-companion'
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        setTimeout(() => notification.close(), 5000);
      }, delay);
    }
  };

  return {
    scheduleNotification
  };
};
