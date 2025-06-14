
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Challenge {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_days: number;
  is_public: boolean;
  shared_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ChallengeProgress {
  id: string;
  challenge_id: string;
  user_id: string;
  completed_date: string;
  created_at: string;
}

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [publicChallenges, setPublicChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchChallenges = useCallback(async () => {
    if (!user) {
      setChallenges([]);
      setLoading(false);
      return;
    }

    try {
      // Récupérer les défis de l'utilisateur
      const { data: userChallenges, error: userError } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (userError) throw userError;
      setChallenges(userChallenges || []);

      // Récupérer les défis publics
      const { data: publicData, error: publicError } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (publicError) throw publicError;
      setPublicChallenges(publicData || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const createChallenge = async (challengeData: Omit<Challenge, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { error } = await supabase
        .from('challenges')
        .insert([{
          ...challengeData,
          user_id: user.id,
          shared_at: challengeData.is_public ? new Date().toISOString() : null
        }]);

      if (error) throw error;
      await fetchChallenges();
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw error;
    }
  };

  const updateChallenge = async (id: string, challengeData: Partial<Omit<Challenge, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const updateData = {
        ...challengeData,
        shared_at: challengeData.is_public ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('challenges')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchChallenges();
    } catch (error) {
      console.error('Error updating challenge:', error);
      throw error;
    }
  };

  const deleteChallenge = async (id: string) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchChallenges();
    } catch (error) {
      console.error('Error deleting challenge:', error);
      throw error;
    }
  };

  const markChallengeCompleted = async (challengeId: string) => {
    if (!user) throw new Error('Utilisateur non connecté');

    const today = new Date().toISOString().split('T')[0];

    try {
      // Vérifier si déjà complété aujourd'hui
      const { data: existing } = await supabase
        .from('challenge_progress')
        .select('id')
        .eq('challenge_id', challengeId)
        .eq('user_id', user.id)
        .eq('completed_date', today)
        .maybeSingle();

      if (existing) {
        throw new Error('Défi déjà validé aujourd\'hui');
      }

      // Ajouter la progression
      const { error } = await supabase
        .from('challenge_progress')
        .insert([{
          challenge_id: challengeId,
          user_id: user.id,
          completed_date: today
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking challenge completed:', error);
      throw error;
    }
  };

  return {
    challenges,
    publicChallenges,
    loading,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    markChallengeCompleted,
    refetch: fetchChallenges
  };
}

export function useChallengeProgress(challengeId: string) {
  const [progress, setProgress] = useState<ChallengeProgress[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !challengeId) return;

    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('challenge_progress')
          .select('*')
          .eq('challenge_id', challengeId)
          .eq('user_id', user.id)
          .order('completed_date', { ascending: false });

        if (error) throw error;
        setProgress(data || []);
      } catch (error) {
        console.error('Error fetching challenge progress:', error);
      }
    };

    fetchProgress();
  }, [challengeId, user]);

  const getStats = () => {
    const completedDays = progress.length;
    
    // Calculer la série actuelle
    let currentStreak = 0;
    const today = new Date();
    const sortedProgress = [...progress].sort((a, b) => 
      new Date(b.completed_date).getTime() - new Date(a.completed_date).getTime()
    );

    for (let i = 0; i < sortedProgress.length; i++) {
      const progressDate = new Date(sortedProgress[i].completed_date);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (progressDate.toDateString() === expectedDate.toDateString()) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculer la plus longue série
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < sortedProgress.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const currentDate = new Date(sortedProgress[i].completed_date);
        const previousDate = new Date(sortedProgress[i - 1].completed_date);
        const dayDiff = Math.abs(previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (dayDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      completedDays,
      currentStreak,
      longestStreak
    };
  };

  return { progress, getStats };
}
