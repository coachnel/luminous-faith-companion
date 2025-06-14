
import { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPrayerRequests = useCallback(async () => {
    if (!user) {
      setPrayerRequests([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('prayer_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50); // Limite pour optimiser les performances

      if (fetchError) throw fetchError;
      setPrayerRequests(data || []);
    } catch (err) {
      console.error('Error fetching prayer requests:', err);
      setError('Erreur lors du chargement des demandes de prière');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPrayerRequests();
  }, [fetchPrayerRequests]);

  const addPrayerRequest = useCallback(async (requestData: Omit<PrayerRequest, 'id' | 'user_id' | 'prayer_count' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      setError(null);
      const { error } = await supabase
        .from('prayer_requests')
        .insert([{ ...requestData, user_id: user.id, prayer_count: 0 }]);

      if (error) throw error;
      await fetchPrayerRequests();
    } catch (err) {
      console.error('Error adding prayer request:', err);
      setError('Erreur lors de l\'ajout de la demande');
      throw err;
    }
  }, [user, fetchPrayerRequests]);

  return { 
    prayerRequests, 
    loading, 
    error,
    addPrayerRequest, 
    refetch: fetchPrayerRequests 
  };
}

export function useNeonNotes() {
  const [notes, setNotes] = useState<NeonNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchNotes = useCallback(async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100); // Limite pour optimiser les performances

      if (fetchError) throw fetchError;
      setNotes(data || []);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = useCallback(async (noteData: Omit<NeonNote, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      setError(null);
      const { error } = await supabase
        .from('notes')
        .insert([{ ...noteData, user_id: user.id }]);

      if (error) throw error;
      await fetchNotes();
    } catch (err) {
      console.error('Error adding note:', err);
      setError('Erreur lors de l\'ajout de la note');
      throw err;
    }
  }, [user, fetchNotes]);

  const updateNote = useCallback(async (id: string, noteData: Partial<Omit<NeonNote, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      setError(null);
      const { error } = await supabase
        .from('notes')
        .update(noteData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchNotes();
    } catch (err) {
      console.error('Error updating note:', err);
      setError('Erreur lors de la mise à jour');
      throw err;
    }
  }, [user, fetchNotes]);

  const deleteNote = useCallback(async (id: string) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      setError(null);
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Erreur lors de la suppression');
      throw err;
    }
  }, [user, fetchNotes]);

  return { 
    notes, 
    loading, 
    error,
    addNote, 
    updateNote, 
    deleteNote, 
    refetch: fetchNotes 
  };
}

export function useNeonFavoriteVerses() {
  const [favoriteVerses, setFavoriteVerses] = useState<FavoriteVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchFavoriteVerses = useCallback(async () => {
    if (!user) {
      setFavoriteVerses([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('favorite_verses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100); // Limite pour optimiser les performances

      if (fetchError) throw fetchError;
      setFavoriteVerses(data || []);
    } catch (err) {
      console.error('Error fetching favorite verses:', err);
      setError('Erreur lors du chargement des versets favoris');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavoriteVerses();
  }, [fetchFavoriteVerses]);

  const addFavoriteVerse = useCallback(async (verse: any) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      setError(null);
      const { error } = await supabase
        .from('favorite_verses')
        .insert([{
          user_id: user.id,
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
    } catch (err) {
      console.error('Error adding favorite verse:', err);
      setError('Erreur lors de l\'ajout du verset');
      throw err;
    }
  }, [user, fetchFavoriteVerses]);

  const removeFavoriteVerse = useCallback(async (verseId: string) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      setError(null);
      const { error } = await supabase
        .from('favorite_verses')
        .delete()
        .eq('verse_id', verseId)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchFavoriteVerses();
    } catch (err) {
      console.error('Error removing favorite verse:', err);
      setError('Erreur lors de la suppression du verset');
      throw err;
    }
  }, [user, fetchFavoriteVerses]);

  return { 
    favoriteVerses, 
    loading, 
    error,
    addFavoriteVerse, 
    removeFavoriteVerse 
  };
}
