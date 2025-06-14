
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PrayerRequest {
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

export interface NeonNote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface FavoriteVerse {
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

export function useNeonPrayerRequests() {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPrayerRequests();
    } else {
      setPrayerRequests([]);
      setLoading(false);
    }
  }, [user]);

  const fetchPrayerRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrayerRequests(data || []);
    } catch (error) {
      console.error('Error fetching prayer requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPrayerRequest = async (requestData: Omit<PrayerRequest, 'id' | 'user_id' | 'prayer_count' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .insert([{ ...requestData, user_id: user?.id, prayer_count: 0 }]);

      if (error) throw error;
      await fetchPrayerRequests();
    } catch (error) {
      console.error('Error adding prayer request:', error);
      throw error;
    }
  };

  return { prayerRequests, loading, addPrayerRequest, refetch: fetchPrayerRequests };
}

export function useNeonNotes() {
  const [notes, setNotes] = useState<NeonNote[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (noteData: Omit<NeonNote, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('notes')
        .insert([{ ...noteData, user_id: user?.id }]);

      if (error) throw error;
      await fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  };

  const updateNote = async (id: string, noteData: Partial<Omit<NeonNote, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update(noteData)
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      await fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      await fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  return { notes, loading, addNote, updateNote, deleteNote, refetch: fetchNotes };
}

export function useNeonFavoriteVerses() {
  const [favoriteVerses, setFavoriteVerses] = useState<FavoriteVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavoriteVerses();
    } else {
      setFavoriteVerses([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFavoriteVerses = async () => {
    try {
      const { data, error } = await supabase
        .from('favorite_verses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavoriteVerses(data || []);
    } catch (error) {
      console.error('Error fetching favorite verses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavoriteVerse = async (verse: any) => {
    try {
      const { error } = await supabase
        .from('favorite_verses')
        .insert([{
          user_id: user?.id,
          verse_id: verse.id,
          book: verse.book,
          chapter: verse.chapter,
          verse: verse.verse,
          text: verse.text,
          version: verse.version,
          language: verse.language
        }]);

      if (error) throw error;
      await fetchFavoriteVerses();
    } catch (error) {
      console.error('Error adding favorite verse:', error);
      throw error;
    }
  };

  const removeFavoriteVerse = async (verseId: string) => {
    try {
      const { error } = await supabase
        .from('favorite_verses')
        .delete()
        .eq('verse_id', verseId)
        .eq('user_id', user?.id);

      if (error) throw error;
      await fetchFavoriteVerses();
    } catch (error) {
      console.error('Error removing favorite verse:', error);
      throw error;
    }
  };

  return { favoriteVerses, loading, addFavoriteVerse, removeFavoriteVerse };
}
