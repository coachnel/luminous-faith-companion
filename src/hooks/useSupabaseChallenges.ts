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
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchChallenges = async () => {
    if (!user) {
      setChallenges([]);
      setPublicChallenges([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      // Nettoyer les défis expirés avant de les récupérer
      await cleanupExpiredChallenges();

      // Utiliser localStorage temporairement
      const storedChallenges = localStorage.getItem(`challenges_${user.id}`);
      if (storedChallenges) {
        const userChallenges = JSON.parse(storedChallenges).filter((c: SpiritualChallenge) => c.is_active);
        setChallenges(userChallenges);
      }

      const storedPublicChallenges = localStorage.getItem('public_challenges');
      if (storedPublicChallenges) {
        const publicData = JSON.parse(storedPublicChallenges).filter((c: SpiritualChallenge) => c.is_active);
        setPublicChallenges(publicData.slice(0, 10));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des défis:', error);
      setError(error as Error);
      setChallenges([]);
      setPublicChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const cleanupExpiredChallenges = async () => {
    try {
      // Nettoyer localStorage des défis expirés
      if (user) {
        const storedChallenges = localStorage.getItem(`challenges_${user.id}`);
        if (storedChallenges) {
          const challenges = JSON.parse(storedChallenges);
          const activeChallenges = challenges.map((challenge: SpiritualChallenge) => {
            if (new Date(challenge.expires_at) < new Date()) {
              return { ...challenge, is_active: false };
            }
            return challenge;
          });
          localStorage.setItem(`challenges_${user.id}`, JSON.stringify(activeChallenges));
        }
      }

      // Nettoyer les défis publics expirés
      const storedPublicChallenges = localStorage.getItem('public_challenges');
      if (storedPublicChallenges) {
        const publicChallenges = JSON.parse(storedPublicChallenges);
        const activePublicChallenges = publicChallenges.map((challenge: SpiritualChallenge) => {
          if (new Date(challenge.expires_at) < new Date()) {
            return { ...challenge, is_active: false };
          }
          return challenge;
        });
        localStorage.setItem('public_challenges', JSON.stringify(activePublicChallenges));
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage des défis expirés:', error);
      setError(error as Error);
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

      const newChallenge: SpiritualChallenge = {
        id: Date.now().toString(),
        ...challengeData,
        user_id: user.id,
        expires_at: expiresAt.toISOString(),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Sauvegarder le défi personnel
      const storedChallenges = localStorage.getItem(`challenges_${user.id}`);
      const currentChallenges = storedChallenges ? JSON.parse(storedChallenges) : [];
      const updatedChallenges = [...currentChallenges, newChallenge];
      localStorage.setItem(`challenges_${user.id}`, JSON.stringify(updatedChallenges));

      // Si public, l'ajouter aux défis publics
      if (challengeData.is_public) {
        const storedPublicChallenges = localStorage.getItem('public_challenges');
        const currentPublicChallenges = storedPublicChallenges ? JSON.parse(storedPublicChallenges) : [];
        const updatedPublicChallenges = [...currentPublicChallenges, newChallenge];
        localStorage.setItem('public_challenges', JSON.stringify(updatedPublicChallenges));
      }

      await fetchChallenges();
    } catch (error) {
      console.error('Erreur lors de la création du défi:', error);
      setError(error as Error);
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
      setError(error as Error);
      throw error;
    }
  };

  return {
    challenges,
    publicChallenges,
    loading,
    error,
    createChallenge,
    markChallengeCompleted,
    refetch: fetchChallenges
  };
}

export function useSupabaseChallengeProgress(challengeId: string) {
  const [progress, setProgress] = useState<ChallengeProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProgress = async () => {
      if (!challengeId || !user) {
        setProgress([]);
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const storedProgress = localStorage.getItem(`challenge_progress_${challengeId}`);
        if (storedProgress) {
          const progressData = JSON.parse(storedProgress);
          setProgress(progressData.filter((p: ChallengeProgress) => p.user_id === user.id));
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la progression:', error);
        setError(error as Error);
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

  return { progress, loading, error, getStats };
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
