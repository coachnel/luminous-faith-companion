
export interface BibleVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  version: string;
  language: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  verse?: BibleVerse;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  favoriteVerses: string[];
  readingPlan: string;
  preferences: {
    bibleVersion: string;
    language: string;
    notifications: {
      dailyVerse: boolean;
      prayerReminder: boolean;
      readingReminder: boolean;
    };
    reminderTimes: {
      prayer: string[];
      reading: string;
    };
  };
  stats: {
    daysActive: number;
    versesRead: number;
    notesWritten: number;
    lastActivity: Date;
  };
}

export interface Notification {
  id: string;
  type: 'prayer' | 'reading' | 'verse' | 'encouragement';
  title: string;
  message: string;
  scheduledFor: Date;
  isRead: boolean;
}

export interface BibleBook {
  name: string;
  abbreviation: string;
  chapters: number;
}
