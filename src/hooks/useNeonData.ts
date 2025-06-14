
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { neonSql } from '@/integrations/neon/client';

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
      const result = await neonSql`
        SELECT * FROM notes 
        WHERE user_id = ${user.id} 
        ORDER BY created_at DESC
      `;
      setNotes(result as unknown as NeonNote[]);
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
      await neonSql`
        INSERT INTO notes (user_id, title, content, tags)
        VALUES (${user.id}, ${noteData.title}, ${noteData.content}, ${noteData.tags})
      `;
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
      
      const setParts: string[] = [];
      const values: any[] = [];
      
      if (noteData.title !== undefined) {
        setParts.push('title = $' + (values.length + 1));
        values.push(noteData.title);
      }
      if (noteData.content !== undefined) {
        setParts.push('content = $' + (values.length + 1));
        values.push(noteData.content);
      }
      if (noteData.tags !== undefined) {
        setParts.push('tags = $' + (values.length + 1));
        values.push(noteData.tags);
      }
      
      setParts.push('updated_at = NOW()');
      
      if (setParts.length > 1) {
        values.push(id, user.id);
        
        await neonSql`
          UPDATE notes 
          SET ${neonSql.unsafe(setParts.join(', '))}
          WHERE id = ${id} AND user_id = ${user.id}
        `;
        await fetchNotes();
      }
    } catch (error) {
      console.error('Error updating note in Neon:', error);
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      console.log('Deleting note from Neon:', id);
      await neonSql`
        DELETE FROM notes 
        WHERE id = ${id} AND user_id = ${user.id}
      `;
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
      const result = await neonSql`
        SELECT * FROM favorite_verses 
        WHERE user_id = ${user.id} 
        ORDER BY created_at DESC
      `;
      setFavoriteVerses(result as unknown as NeonFavoriteVerse[]);
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
      await neonSql`
        INSERT INTO favorite_verses (
          user_id, verse_id, book, chapter, verse, text, version, language
        ) VALUES (
          ${user.id}, ${verse.id || `${verse.book}-${verse.chapter}-${verse.verse}`}, 
          ${verse.book}, ${verse.chapter}, ${verse.verse}, ${verse.text}, 
          ${verse.version || 'LSG'}, ${verse.language || 'fr'}
        )
      `;
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
      await neonSql`
        DELETE FROM favorite_verses 
        WHERE verse_id = ${verseId} AND user_id = ${user.id}
      `;
      await fetchFavoriteVerses();
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
      const result = await neonSql`
        SELECT * FROM prayer_requests 
        WHERE user_id = ${user.id} 
        ORDER BY created_at DESC
      `;
      setPrayerRequests(result as unknown as NeonPrayerRequest[]);
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
      await neonSql`
        INSERT INTO prayer_requests (user_id, title, content, author_name, is_anonymous)
        VALUES (${user.id}, ${requestData.title}, ${requestData.content}, ${requestData.author_name}, ${requestData.is_anonymous})
      `;
      await fetchPrayerRequests();
    } catch (error) {
      console.error('Error adding prayer request to Neon:', error);
      throw error;
    }
  };

  return { prayerRequests, loading, addPrayerRequest, refetch: fetchPrayerRequests };
}
