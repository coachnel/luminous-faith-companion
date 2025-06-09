import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
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

export interface Reminder {
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

export interface UserPreferences {
  user_id: string;
  bible_version: string;
  language: string;
  theme: string;
  notification_preferences: {
    dailyVerse: boolean;
    prayerReminder: boolean;
    readingReminder: boolean;
  };
  reminder_times: {
    prayer: string[];
    reading: string;
  };
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;
      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return { profile, loading, updateProfile };
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
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

  const addNote = async (noteData: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
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

  const updateNote = async (id: string, noteData: Partial<Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
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
        .eq('id', id);

      if (error) throw error;
      await fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  return { notes, loading, addNote, updateNote, deleteNote, refetch: fetchNotes };
}

export function useFavoriteVerses() {
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

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      setPreferences(null);
      setLoading(false);
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      
      // Transform the JSON data to match our interface
      const transformedData: UserPreferences = {
        user_id: data.user_id,
        bible_version: data.bible_version,
        language: data.language,
        theme: data.theme,
        notification_preferences: typeof data.notification_preferences === 'string' 
          ? JSON.parse(data.notification_preferences) 
          : data.notification_preferences,
        reminder_times: typeof data.reminder_times === 'string' 
          ? JSON.parse(data.reminder_times) 
          : data.reminder_times,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setPreferences(transformedData);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', user?.id);

      if (error) throw error;
      await fetchPreferences();
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  return { preferences, loading, updatePreferences };
}
