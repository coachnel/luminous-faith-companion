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
  links?: string[];
  is_public?: boolean;
  shared_at?: string;
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
  theme_mode: 'light' | 'dark' | 'sepia';
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
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      console.log('Récupération du profil pour user ID:', user.id);
      
      // D'abord, vérifier si le profil existe
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération du profil:', error);
        throw error;
      }

      if (!data) {
        console.log('Aucun profil trouvé, création d\'un nouveau profil...');
        // Créer un nouveau profil si il n'existe pas
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Utilisateur',
            email: user.email
          }])
          .select()
          .single();

        if (createError) {
          console.error('Erreur lors de la création du profil:', createError);
          throw createError;
        }

        console.log('Nouveau profil créé:', newProfile);
        setProfile(newProfile);
      } else {
        console.log('Profil trouvé:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Erreur dans fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      console.log('Mise à jour du profil avec:', updates);
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        throw error;
      }

      console.log('Profil mis à jour avec succès:', data);
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Erreur dans updateProfile:', error);
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

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        // Validate and normalize theme_mode to ensure it's one of the allowed values
        const normalizeThemeMode = (value: any): 'light' | 'dark' | 'sepia' => {
          if (value === 'dark' || value === 'sepia') {
            return value;
          }
          return 'light'; // Default fallback
        };
        
        // Transform the JSON data to match our interface
        const transformedData: UserPreferences = {
          user_id: data.user_id,
          bible_version: data.bible_version,
          language: data.language,
          theme: data.theme,
          theme_mode: normalizeThemeMode(data.theme_mode),
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
        
        // Appliquer le thème automatiquement
        applyTheme(transformedData.theme_mode);
      } else {
        // Create default preferences if none exist
        const defaultPreferences: UserPreferences = {
          user_id: user?.id || '',
          bible_version: 'LSG',
          language: 'fr',
          theme: 'light',
          theme_mode: 'light',
          notification_preferences: {
            dailyVerse: true,
            prayerReminder: true,
            readingReminder: true
          },
          reminder_times: {
            prayer: ['08:00', '12:00', '20:00'],
            reading: '07:00'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setPreferences(defaultPreferences);
        applyTheme('light');
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      // En cas d'erreur, utiliser les préférences par défaut
      const defaultPreferences: UserPreferences = {
        user_id: user?.id || '',
        bible_version: 'LSG',
        language: 'fr',
        theme: 'light',
        theme_mode: 'light',
        notification_preferences: {
          dailyVerse: true,
          prayerReminder: true,
          readingReminder: true
        },
        reminder_times: {
          prayer: ['08:00', '12:00', '20:00'],
          reading: '07:00'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setPreferences(defaultPreferences);
      applyTheme('light');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ user_id: user?.id, ...updates }, { onConflict: 'user_id' });

      if (error) throw error;
      
      // Appliquer le nouveau thème si changé
      if (updates.theme_mode) {
        applyTheme(updates.theme_mode);
      }
      
      await fetchPreferences();
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  const applyTheme = (themeMode: 'light' | 'dark' | 'sepia') => {
    const root = document.documentElement;
    
    // Supprimer les anciennes classes de thème
    root.classList.remove('light', 'dark', 'sepia');
    
    // Ajouter la nouvelle classe de thème
    root.classList.add(themeMode);
    
    // Appliquer les styles spécifiques
    switch (themeMode) {
      case 'dark':
        root.style.setProperty('--background', '222.2% 84% 4.9%');
        root.style.setProperty('--foreground', '210% 40% 98%');
        break;
      case 'sepia':
        root.style.setProperty('--background', '48% 96% 89%');
        root.style.setProperty('--foreground', '48% 19% 13%');
        break;
      default: // light
        root.style.setProperty('--background', '0 0% 100%');
        root.style.setProperty('--foreground', '222.2% 84% 4.9%');
        break;
    }
  };

  return { preferences, loading, updatePreferences };
}
