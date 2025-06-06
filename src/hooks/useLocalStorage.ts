
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useUserProfile() {
  return useLocalStorage('christian-app-profile', {
    id: 'user-1',
    name: 'Utilisateur',
    favoriteVerses: [],
    readingPlan: 'daily',
    preferences: {
      bibleVersion: 'LSG',
      language: 'fr',
      notifications: {
        dailyVerse: true,
        prayerReminder: true,
        readingReminder: true,
      },
      reminderTimes: {
        prayer: ['08:00', '12:00', '20:00'],
        reading: '07:00',
      },
    },
    stats: {
      daysActive: 1,
      versesRead: 0,
      notesWritten: 0,
      lastActivity: new Date(),
    },
  });
}

export function useNotes() {
  return useLocalStorage('christian-app-notes', []);
}

export function useFavoriteVerses() {
  return useLocalStorage('christian-app-favorites', []);
}
