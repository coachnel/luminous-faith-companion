
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
}

export interface ChallengeProgress {
  id: string;
  challenge_id: string;
  user_id: string;
  completed_date: string;
  notes?: string;
  created_at: string;
}

export function useChallenges() {
  const [challenges, setChallenges] = useState<SpiritualChallenge[]>([]);
  const [publicChallenges, setPublicChallenges] = useState<SpiritualChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchChallenges = async () => {
    if (!user) {
      setChallenges([]);
      setLoading(false);
      return;
    }

    try {
      // Récupérer les défis personnels
      const { data: userChallenges, error: userError } = await supabase
        .from('spiritual_challenges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (userError) throw userError;

      // Récupérer les défis publics
      const { data: communityF, error: communityError } = await supabase
        .from('spiritual_challenges')
        .select('*')
        .eq('is_public', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (communityError) throw communityError;

      setChallenges(userChallenges || []);
      setPublicChallenges(communityF || []);
    } catch (error) {
      console.error('Erreur lors du chargement des défis:', error);
      setChallenges([]);
      setPublicChallenges([]);
    } finally {
      setLoading(false);
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
      const { error } = await supabase
        .from('spiritual_challenges')
        .insert([{
          ...challengeData,
          user_id: user.id,
          is_active: true
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
        .upsert({
          challenge_id: challengeId,
          user_id: user.id,
          completed_date: today,
          notes: notes
        });

      if (error) throw error;
      await fetchChallenges();
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

export function useChallengeProgress(challengeId: string) {
  const [progress, setProgress] = useState<ChallengeProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('challenge_progress')
          .select('*')
          .eq('challenge_id', challengeId)
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

    if (challengeId) {
      fetchProgress();
    }
  }, [challengeId]);

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
