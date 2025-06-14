
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CommunityContent {
  id: string;
  user_id: string;
  author_name: string;
  type: 'prayer' | 'note' | 'verse' | 'testimony';
  title: string;
  content: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
}

export interface CommunityNotification {
  id: string;
  content_id: string | null;
  user_id: string | null;
  type: 'new_content' | 'content_liked' | 'content_commented';
  title: string;
  message: string;
  is_read: boolean;
  sent_at: string;
  email_sent: boolean;
}

export function useCommunityContent() {
  const [content, setContent] = useState<CommunityContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchContent = useCallback(async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('community_content')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;
      setContent((data || []) as CommunityContent[]);
    } catch (err) {
      console.error('Error fetching community content:', err);
      setError('Erreur lors du chargement du contenu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();

    // Écouter les nouvelles publications en temps réel
    const channel = supabase
      .channel('community_content_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_content'
        },
        (payload) => {
          console.log('New community content:', payload);
          if (payload.new.is_public) {
            setContent(prev => [payload.new as CommunityContent, ...prev]);
            toast.success('📢 Nouveau contenu communautaire !');
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'community_content'
        },
        (payload) => {
          console.log('Updated community content:', payload);
          setContent(prev => prev.map(item => 
            item.id === payload.new.id ? payload.new as CommunityContent : item
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchContent]);

  const publishContent = useCallback(async (contentData: {
    type: 'prayer' | 'note' | 'verse' | 'testimony';
    title: string;
    content: string;
    is_public?: boolean;
  }) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      setError(null);
      
      // Obtenir le nom de l'utilisateur depuis le profil
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      const authorName = profile?.name || user.email?.split('@')[0] || 'Utilisateur';

      const { data, error } = await supabase
        .from('community_content')
        .insert([{
          ...contentData,
          user_id: user.id,
          author_name: authorName,
          is_public: contentData.is_public !== false
        }])
        .select()
        .single();

      if (error) throw error;

      // Déclencher les notifications par Edge Function
      if (data.is_public) {
        try {
          await supabase.functions.invoke('notify-community', {
            body: {
              contentId: data.id,
              authorName: authorName,
              type: data.type,
              title: data.title
            }
          });
        } catch (notifError) {
          console.warn('Erreur lors de l\'envoi des notifications:', notifError);
        }
      }

      await fetchContent();
      toast.success('✨ Contenu publié avec succès !');
      return data as CommunityContent;
    } catch (err) {
      console.error('Error publishing content:', err);
      setError('Erreur lors de la publication');
      throw err;
    }
  }, [user, fetchContent]);

  const likeContent = useCallback(async (contentId: string) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { error } = await supabase
        .from('community_likes')
        .insert([{
          content_id: contentId,
          user_id: user.id
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.info('Vous avez déjà aimé ce contenu');
          return;
        }
        throw error;
      }

      toast.success('👍 Contenu aimé !');
    } catch (err) {
      console.error('Error liking content:', err);
      toast.error('Erreur lors du like');
    }
  }, [user]);

  const unlikeContent = useCallback(async (contentId: string) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { error } = await supabase
        .from('community_likes')
        .delete()
        .eq('content_id', contentId)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('👍 Like retiré');
    } catch (err) {
      console.error('Error unliking content:', err);
      toast.error('Erreur lors du retrait du like');
    }
  }, [user]);

  return {
    content,
    loading,
    error,
    publishContent,
    likeContent,
    unlikeContent,
    refetch: fetchContent
  };
}

export function useCommunityNotifications() {
  const [notifications, setNotifications] = useState<CommunityNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('community_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('sent_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      setNotifications((data || []) as CommunityNotification[]);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();

    if (!user) return;

    // Écouter les nouvelles notifications en temps réel
    const channel = supabase
      .channel('user_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification:', payload);
          const newNotification = payload.new as CommunityNotification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Afficher une notification toast
          toast.info(newNotification.title, {
            description: newNotification.message
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNotifications, user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('community_notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('community_notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success('Toutes les notifications marquées comme lues');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
}
