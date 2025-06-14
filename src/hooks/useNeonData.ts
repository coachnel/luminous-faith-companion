
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

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
      // TODO: Implémenter la requête vers Neon
      console.log('Fetching notes from Neon for user:', user.id);
      // Placeholder - sera implémenté après la migration des tables
      setNotes([]);
    } catch (error) {
      console.error('Error fetching notes from Neon:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const addNote = async (noteData: Omit<NeonNote, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      // TODO: Implémenter l'ajout vers Neon
      console.log('Adding note to Neon:', noteData);
      await fetchNotes();
    } catch (error) {
      console.error('Error adding note to Neon:', error);
      throw error;
    }
  };

  const updateNote = async (id: string, noteData: Partial<Omit<NeonNote, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      // TODO: Implémenter la mise à jour vers Neon
      console.log('Updating note in Neon:', id, noteData);
      await fetchNotes();
    } catch (error) {
      console.error('Error updating note in Neon:', error);
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      // TODO: Implémenter la suppression vers Neon
      console.log('Deleting note from Neon:', id);
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
      // TODO: Implémenter la requête vers Neon
      console.log('Fetching favorite verses from Neon for user:', user.id);
      setFavoriteVerses([]);
    } catch (error) {
      console.error('Error fetching favorite verses from Neon:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteVerses();
  }, [user]);

  const addFavoriteVerse = async (verse: any) => {
    try {
      // TODO: Implémenter l'ajout vers Neon
      console.log('Adding favorite verse to Neon:', verse);
      await fetchFavoriteVerses();
    } catch (error) {
      console.error('Error adding favorite verse to Neon:', error);
      throw error;
    }
  };

  const removeFavoriteVerse = async (verseId: string) => {
    try {
      // TODO: Implémenter la suppression vers Neon
      console.log('Removing favorite verse from Neon:', verseId);
      await fetchFavoriteVerses();
    } catch (error) {
      console.error('Error removing favorite verse from Neon:', error);
      throw error;
    }
  };

  return { favoriteVerses, loading, addFavoriteVerse, removeFavoriteVerse };
}
