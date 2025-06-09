
import { useEffect } from 'react';
import { useUserPreferences } from './useSupabaseData';

export const useNotifications = () => {
  const { preferences } = useUserPreferences();

  useEffect(() => {
    if (!('Notification' in window)) {
      console.log('Ce navigateur ne supporte pas les notifications');
      return;
    }

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const scheduleNotification = (title: string, body: string, delay: number = 0) => {
    if (Notification.permission === 'granted') {
      setTimeout(() => {
        const notification = new Notification(title, {
          body,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
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

  const scheduleDailyReminders = () => {
    if (!preferences?.notification_preferences) return;

    const now = new Date();
    const reminderTimes = preferences.reminder_times as any;

    // Notification verset du jour
    if (preferences.notification_preferences.dailyVerse) {
      const verseTime = new Date();
      verseTime.setHours(7, 0, 0, 0);
      
      if (verseTime > now) {
        const delay = verseTime.getTime() - now.getTime();
        setTimeout(() => {
          scheduleNotification(
            '🙏 Verset du jour',
            'Découvrez votre verset quotidien pour nourrir votre âme'
          );
        }, delay);
      }
    }

    // Notifications de prière
    if (preferences.notification_preferences.prayerReminder && reminderTimes?.prayer) {
      reminderTimes.prayer.forEach((time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const prayerTime = new Date();
        prayerTime.setHours(hours, minutes, 0, 0);
        
        if (prayerTime > now) {
          const delay = prayerTime.getTime() - now.getTime();
          setTimeout(() => {
            scheduleNotification(
              '🤲 Moment de prière',
              'Prenez un moment pour vous recueillir et prier'
            );
          }, delay);
        }
      });
    }

    // Notification de lecture
    if (preferences.notification_preferences.readingReminder && reminderTimes?.reading) {
      const [hours, minutes] = reminderTimes.reading.split(':').map(Number);
      const readingTime = new Date();
      readingTime.setHours(hours, minutes, 0, 0);
      
      if (readingTime > now) {
        const delay = readingTime.getTime() - now.getTime();
        setTimeout(() => {
          scheduleNotification(
            '📖 Lecture de la Bible',
            'Il est temps de lire votre passage quotidien de la Bible'
          );
        }, delay);
      }
    }
  };

  return {
    scheduleNotification,
    scheduleDailyReminders
  };
};
