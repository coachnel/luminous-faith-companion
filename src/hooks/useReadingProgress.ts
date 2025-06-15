
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

// Types pour la progression de lecture
export interface ReadingPlanProgress {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  current_day: number;
  completed_days: number[];
  start_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BibleReadingProgress {
  id: string;
  user_id: string;
  book_id: string;
  book_name: string;
  chapter_number: number;
  verse_number?: number;
  last_read_at: string;
  is_completed: boolean;
  created_at: string;
}

// Plans de lecture prédéfinis
export const READING_PLANS = [
  {
    id: 'bible-1-year',
    name: 'Bible en 1 an',
    description: 'Lire la Bible complète en 365 jours',
    duration: 365
  },
  {
    id: 'new-testament-90',
    name: 'Nouveau Testament en 90 jours',
    description: 'Parcourir le Nouveau Testament en 3 mois',
    duration: 90
  },
  {
    id: 'psalms-month',
    name: 'Psaumes en 1 mois',
    description: 'Découvrir les Psaumes en 30 jours',
    duration: 30
  }
];

export function useReadingPlanProgress() {
  const [plans, setPlans] = useState<ReadingPlanProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchPlans = async () => {
    if (!user) {
      setPlans([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      // Utiliser localStorage temporairement
      const storedPlans = localStorage.getItem(`reading_plans_${user.id}`);
      if (storedPlans) {
        setPlans(JSON.parse(storedPlans));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des plans:', error);
      setError(error as Error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [user]);

  const startPlan = async (planId: string, planName: string) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const newPlan: ReadingPlanProgress = {
        id: Date.now().toString(),
        user_id: user.id,
        plan_id: planId,
        plan_name: planName,
        current_day: 1,
        completed_days: [],
        start_date: new Date().toISOString(),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedPlans = [...plans, newPlan];
      setPlans(updatedPlans);
      localStorage.setItem(`reading_plans_${user.id}`, JSON.stringify(updatedPlans));
    } catch (error) {
      console.error('Erreur lors du démarrage du plan:', error);
      setError(error as Error);
      throw error;
    }
  };

  const cancelPlan = async (planId: string) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const updatedPlans = plans.map(plan => 
        plan.id === planId 
          ? { ...plan, is_active: false, updated_at: new Date().toISOString() }
          : plan
      );
      
      setPlans(updatedPlans);
      localStorage.setItem(`reading_plans_${user.id}`, JSON.stringify(updatedPlans));
    } catch (error) {
      console.error('Erreur lors de l\'annulation du plan:', error);
      setError(error as Error);
      throw error;
    }
  };

  const markDayCompleted = async (planId: string, day: number) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const updatedPlans = plans.map(plan => {
        if (plan.id === planId) {
          const updatedCompletedDays = [...plan.completed_days];
          if (!updatedCompletedDays.includes(day)) {
            updatedCompletedDays.push(day);
          }
          return {
            ...plan,
            completed_days: updatedCompletedDays,
            current_day: Math.max(plan.current_day, day + 1),
            updated_at: new Date().toISOString()
          };
        }
        return plan;
      });

      setPlans(updatedPlans);
      localStorage.setItem(`reading_plans_${user.id}`, JSON.stringify(updatedPlans));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setError(error as Error);
      throw error;
    }
  };

  const getPlanStats = (plan: ReadingPlanProgress) => {
    const totalDays = READING_PLANS.find(p => p.id === plan.plan_id)?.duration || 365;
    const completedDays = plan.completed_days.length;
    const percentage = Math.round((completedDays / totalDays) * 100);
    
    return {
      totalDays,
      completedDays,
      percentage,
      remainingDays: totalDays - completedDays
    };
  };

  return {
    plans,
    loading,
    error,
    startPlan,
    cancelPlan,
    markDayCompleted,
    getPlanStats,
    refetch: fetchPlans
  };
}

export function useBibleReadingProgress() {
  const [progress, setProgress] = useState<BibleReadingProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProgress = async () => {
    if (!user) {
      setProgress([]);
      setLoading(false);
      return;
    }

    try {
      // Utiliser localStorage temporairement
      const storedProgress = localStorage.getItem(`bible_progress_${user.id}`);
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

  useEffect(() => {
    fetchProgress();
  }, [user]);

  const markChapterRead = async (bookId: string, bookName: string, chapterNumber: number, verseNumber?: number) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const newProgress: BibleReadingProgress = {
        id: `${bookId}_${chapterNumber}_${Date.now()}`,
        user_id: user.id,
        book_id: bookId,
        book_name: bookName,
        chapter_number: chapterNumber,
        verse_number: verseNumber,
        last_read_at: new Date().toISOString(),
        is_completed: true,
        created_at: new Date().toISOString()
      };

      // Supprimer l'ancienne entrée si elle existe
      const filteredProgress = progress.filter(p => 
        !(p.book_id === bookId && p.chapter_number === chapterNumber)
      );
      
      const updatedProgress = [newProgress, ...filteredProgress];
      setProgress(updatedProgress);
      localStorage.setItem(`bible_progress_${user.id}`, JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  };

  const getOverallStats = () => {
    const totalChapters = 1189; // Nombre total de chapitres dans la Bible
    const readChapters = progress.filter(p => p.is_completed).length;
    const percentage = Math.round((readChapters / totalChapters) * 100);
    
    return {
      totalChapters,
      readChapters,
      percentage,
      lastRead: progress[0] || null
    };
  };

  return {
    progress,
    loading,
    markChapterRead,
    getOverallStats,
    refetch: fetchProgress
  };
}
