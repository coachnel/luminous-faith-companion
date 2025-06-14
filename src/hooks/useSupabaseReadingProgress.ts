
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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

export function useSupabaseReadingPlanProgress() {
  const [plans, setPlans] = useState<ReadingPlanProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPlans = async () => {
    if (!user) {
      setPlans([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reading_plan_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des plans:', error);
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
      const { error } = await supabase
        .from('reading_plan_progress')
        .insert([{
          user_id: user.id,
          plan_id: planId,
          plan_name: planName
        }]);

      if (error) throw error;
      await fetchPlans();
    } catch (error) {
      console.error('Erreur lors du démarrage du plan:', error);
      throw error;
    }
  };

  const markDayCompleted = async (planId: string, day: number) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan) return;

      const updatedCompletedDays = [...plan.completed_days];
      if (!updatedCompletedDays.includes(day)) {
        updatedCompletedDays.push(day);
      }

      const { error } = await supabase
        .from('reading_plan_progress')
        .update({
          completed_days: updatedCompletedDays,
          current_day: Math.max(plan.current_day, day + 1),
          updated_at: new Date().toISOString()
        })
        .eq('id', planId);

      if (error) throw error;
      await fetchPlans();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
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
    startPlan,
    markDayCompleted,
    getPlanStats,
    refetch: fetchPlans
  };
}

export function useSupabaseBibleReadingProgress() {
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
      const { data, error } = await supabase
        .from('bible_reading_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('last_read_at', { ascending: false });

      if (error) throw error;
      setProgress(data || []);
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
      const { error } = await supabase
        .from('bible_reading_progress')
        .upsert([{
          user_id: user.id,
          book_id: bookId,
          book_name: bookName,
          chapter_number: chapterNumber,
          verse_number: verseNumber,
          last_read_at: new Date().toISOString(),
          is_completed: true
        }], {
          onConflict: 'user_id,book_id,chapter_number'
        });

      if (error) throw error;
      await fetchProgress();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  };

  const getOverallStats = () => {
    const totalChapters = 1189;
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
