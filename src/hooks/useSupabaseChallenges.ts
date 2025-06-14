
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SpiritualChallenge {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  is_public: boolean;
  target_days: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  expires_at: string;
}

export interface ChallengeProgress {
  id: string;
  challenge_id: string;
  user_id: string;
  completed_date: string;
  notes?: string;
  created_at: string;
}

export function useSupabaseChallenges() {
  const [challenges, setChallenges] = useState<SpiritualChallenge[]>([]);
  const [publicChallenges, setPublicChallenges] = useState<SpiritualChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchChallenges = async () => {
    if (!user) {
      setChallenges([]);
      setPublicChallenges([]);
      setLoading(false);
      return;
    }

    try {
      // Nettoyer les défis expirés avant de les récupérer
      await cleanupExpiredChallenges();

      // Récupérer les défis de l'utilisateur
      const { data: userChallenges, error: userError } = await supabase
        .from('spiritual_challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (userError) throw userError;

      // Récupérer les défis publics
      const { data: publicChallengesData, error: publicError } = await supabase
        .from('spiritual_challenges')
        .select('*')
        .eq('is_public', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (publicError) throw publicError;

      setChallenges(userChallenges || []);
      setPublicChallenges(publicChallengesData || []);
    } catch (error) {
      console.error('Erreur lors du chargement des défis:', error);
      setChallenges([]);
      setPublicChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const cleanupExpiredChallenges = async () => {
    try {
      await supabase
        .from('spiritual_challenges')
        .update({ is_active: false })
        .lt('expires_at', new Date().toISOString());
    } catch (error) {
      console.error('Erreur lors du nettoyage des défis expirés:', error);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [user]);

  const createChallenge = async (challengeData: {
    title: string;
    description?: string;
    is_public: boolean;
    target_days: number;
  }) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + challengeData.target_days);

      const { error } = await supabase
        .from('spiritual_challenges')
        .insert([{
          ...challengeData,
          user_id: user.id,
          expires_at: expiresAt.toISOString()
        }]);

      if (error) throw error;
      await fetchChallenges();
    } catch (error) {
      console.error('Erreur lors de la création du défi:', error);
      throw error;
    }
  };

  const markChallengeCompleted = async (challengeId: string, notes?: string) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('challenge_progress')
        .upsert([{
          challenge_id: challengeId,
          user_id: user.id,
          completed_date: today,
          notes: notes
        }], {
          onConflict: 'challenge_id,user_id,completed_date'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la validation du défi:', error);
      throw error;
    }
  };

  return {
    challenges,
    publicChallenges,
    loading,
    createChallenge,
    markChallengeCompleted,
    refetch: fetchChallenges
  };
}

export function useSupabaseChallengeProgress(challengeId: string) {
  const [progress, setProgress] = useState<ChallengeProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProgress = async () => {
      if (!challengeId || !user) {
        setProgress([]);
        setLoading(false);
        return;
      }

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
        console.error('Erreur lors du chargement de la progression:', error);
        setProgress([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [challengeId, user]);

  const getStats = () => {
    const completedDays = progress.length;
    const currentStreak = calculateCurrentStreak(progress);
    const longestStreak = calculateLongestStreak(progress);

    return {
      completedDays,
      currentStreak,
      longestStreak
    };
  };

  return { progress, loading, getStats };
}

// Fonctions utilitaires pour calculer les séquences
function calculateCurrentStreak(progress: ChallengeProgress[]): number {
  if (progress.length === 0) return 0;

  const sortedDates = progress
    .map(p => new Date(p.completed_date))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const date of sortedDates) {
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (date.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function calculateLongestStreak(progress: ChallengeProgress[]): number {
  if (progress.length === 0) return 0;

  const sortedDates = progress
    .map(p => new Date(p.completed_date))
    .sort((a, b) => a.getTime() - b.getTime());

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currentDate = new Date(sortedDates[i]);
    
    prevDate.setDate(prevDate.getDate() + 1);
    
    if (prevDate.getTime() === currentDate.getTime()) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
}
