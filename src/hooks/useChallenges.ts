
import { useState, useEffect } from 'react';
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
      // Utiliser localStorage temporairement
      const storedChallenges = localStorage.getItem(`challenges_${user.id}`);
      if (storedChallenges) {
        setChallenges(JSON.parse(storedChallenges));
      }

      const storedPublicChallenges = localStorage.getItem('public_challenges');
      if (storedPublicChallenges) {
        setPublicChallenges(JSON.parse(storedPublicChallenges));
      }
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
      const newChallenge: SpiritualChallenge = {
        id: Date.now().toString(),
        ...challengeData,
        user_id: user.id,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedChallenges = [...challenges, newChallenge];
      setChallenges(updatedChallenges);
      localStorage.setItem(`challenges_${user.id}`, JSON.stringify(updatedChallenges));

      if (challengeData.is_public) {
        const updatedPublicChallenges = [...publicChallenges, newChallenge];
        setPublicChallenges(updatedPublicChallenges);
        localStorage.setItem('public_challenges', JSON.stringify(updatedPublicChallenges));
      }
    } catch (error) {
      console.error('Erreur lors de la création du défi:', error);
      throw error;
    }
  };

  const markChallengeCompleted = async (challengeId: string, notes?: string) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const newProgress: ChallengeProgress = {
        id: Date.now().toString(),
        challenge_id: challengeId,
        user_id: user.id,
        completed_date: today,
        notes: notes,
        created_at: new Date().toISOString()
      };

      const storedProgress = localStorage.getItem(`challenge_progress_${challengeId}`);
      const currentProgress: ChallengeProgress[] = storedProgress ? JSON.parse(storedProgress) : [];
      
      // Vérifier si déjà marqué aujourd'hui
      const alreadyCompleted = currentProgress.some(p => p.completed_date === today);
      if (!alreadyCompleted) {
        const updatedProgress = [...currentProgress, newProgress];
        localStorage.setItem(`challenge_progress_${challengeId}`, JSON.stringify(updatedProgress));
      }
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
        const storedProgress = localStorage.getItem(`challenge_progress_${challengeId}`);
        if (storedProgress) {
          setProgress(JSON.parse(storedProgress));
        }
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
