
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { neonClient } from '@/integrations/neon/restClient';

// Types pour les données métier sur Neon
export interface NeonNote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface NeonFavoriteVerse {
  id: string;
  user_id: string;
  verse_id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  version: string;
  language: string;
  created_at: string;
}

export interface NeonPrayerRequest {
  id: string;
  user_id: string;
  title: string;
  content: string;
  author_name: string;
  is_anonymous: boolean;
  prayer_count: number;
  created_at: string;
  updated_at: string;
}

export interface NeonReminder {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message?: string;
  scheduled_for: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Hook pour les notes sur Neon
export function useNeonNotes() {
  const [notes, setNotes] = useState<NeonNote[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotes = async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching notes from Neon for user:', user.id);
      const result = await neonClient.select<NeonNote>('notes', { user_id: user.id });
      setNotes(result);
    } catch (error) {
      console.error('Error fetching notes from Neon:', error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const addNote = async (noteData: Omit<NeonNote, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      console.log('Adding note to Neon:', noteData);
      await neonClient.insert<NeonNote>('notes', {
        ...noteData,
        user_id: user.id,
      });
      await fetchNotes();
    } catch (error) {
      console.error('Error adding note to Neon:', error);
      throw error;
    }
  };

  const updateNote = async (id: string, noteData: Partial<Omit<NeonNote, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      console.log('Updating note in Neon:', id, noteData);
      await neonClient.update<NeonNote>('notes', id, noteData);
      await fetchNotes();
    } catch (error) {
      console.error('Error updating note in Neon:', error);
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      console.log('Deleting note from Neon:', id);
      await neonClient.delete('notes', id);
      await fetchNotes();
    } catch (error) {
      console.error('Error deleting note from Neon:', error);
      throw error;
    }
  };

  return { notes, loading, addNote, updateNote, deleteNote, refetch: fetchNotes };
}

// Hook pour les versets favoris sur Neon
export function useNeonFavoriteVerses() {
  const [favoriteVerses, setFavoriteVerses] = useState<NeonFavoriteVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFavoriteVerses = async () => {
    if (!user) {
      setFavoriteVerses([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching favorite verses from Neon for user:', user.id);
      const result = await neonClient.select<NeonFavoriteVerse>('favorite_verses', { user_id: user.id });
      setFavoriteVerses(result);
    } catch (error) {
      console.error('Error fetching favorite verses from Neon:', error);
      setFavoriteVerses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteVerses();
  }, [user]);

  const addFavoriteVerse = async (verse: any) => {
    if (!user) throw new Error('User not authenticated');

    try {
      console.log('Adding favorite verse to Neon:', verse);
      await neonClient.insert<NeonFavoriteVerse>('favorite_verses', {
        user_id: user.id,
        verse_id: verse.id || `${verse.book}-${verse.chapter}-${verse.verse}`,
        book: verse.book,
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text,
        version: verse.version || 'LSG',
        language: verse.language || 'fr',
      });
      await fetchFavoriteVerses();
    } catch (error) {
      console.error('Error adding favorite verse to Neon:', error);
      throw error;
    }
  };

  const removeFavoriteVerse = async (verseId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      console.log('Removing favorite verse from Neon:', verseId);
      const verses = await neonClient.select<NeonFavoriteVerse>('favorite_verses', { 
        user_id: user.id, 
        verse_id: verseId 
      });
      
      if (verses.length > 0) {
        await neonClient.delete('favorite_verses', verses[0].id);
        await fetchFavoriteVerses();
      }
    } catch (error) {
      console.error('Error removing favorite verse from Neon:', error);
      throw error;
    }
  };

  return { favoriteVerses, loading, addFavoriteVerse, removeFavoriteVerse };
}

// Hook pour les demandes de prière sur Neon
export function useNeonPrayerRequests() {
  const [prayerRequests, setPrayerRequests] = useState<NeonPrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPrayerRequests = async () => {
    if (!user) {
      setPrayerRequests([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching prayer requests from Neon for user:', user.id);
      const result = await neonClient.select<NeonPrayerRequest>('prayer_requests', { user_id: user.id });
      setPrayerRequests(result);
    } catch (error) {
      console.error('Error fetching prayer requests from Neon:', error);
      setPrayerRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayerRequests();
  }, [user]);

  const addPrayerRequest = async (requestData: Omit<NeonPrayerRequest, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'prayer_count'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      console.log('Adding prayer request to Neon:', requestData);
      await neonClient.insert<NeonPrayerRequest>('prayer_requests', {
        ...requestData,
        user_id: user.id,
        prayer_count: 0,
      });
      await fetchPrayerRequests();
    } catch (error) {
      console.error('Error adding prayer request to Neon:', error);
      throw error;
    }
  };

  return { prayerRequests, loading, addPrayerRequest, refetch: fetchPrayerRequests };
}
