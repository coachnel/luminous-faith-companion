
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

// Hook pour gérer les dernières visites
export function useLastVisits() {
  const { user } = useAuth();
  const [lastVisitDiscover, setLastVisitDiscover] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchLastVisit = async () => {
      try {
        const { data, error } = await supabase
          .from('user_last_visits')
          .select('last_visit_discover')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Erreur lors de la récupération de la dernière visite:', error);
          return;
        }

        setLastVisitDiscover(data?.last_visit_discover || null);
      } catch (error) {
        console.error('Erreur inattendue:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLastVisit();
  }, [user]);

  const updateLastVisitDiscover = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_last_visits')
        .upsert(
          {
            user_id: user.id,
            last_visit_discover: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id' }
        );

      if (error) {
        console.error('Erreur lors de la mise à jour de la dernière visite:', error);
        return;
      }

      setLastVisitDiscover(new Date().toISOString());
    } catch (error) {
      console.error('Erreur inattendue:', error);
    }
  };

  return {
    lastVisitDiscover,
    updateLastVisitDiscover,
    loading
  };
}

// Hook pour gérer les achievements
export function useAchievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAchievements = async () => {
      try {
        const { data, error } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_visible', true)
          .order('earned_at', { ascending: false });

        if (error) {
          console.error('Erreur lors de la récupération des achievements:', error);
          return;
        }

        setAchievements(data || []);
      } catch (error) {
        console.error('Erreur inattendue:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  const addAchievement = async (type: string, name: string, description?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_type: type,
          achievement_name: name,
          description,
          earned_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de l\'ajout de l\'achievement:', error);
        return;
      }

      setAchievements(prev => [data, ...prev]);
    } catch (error) {
      console.error('Erreur inattendue:', error);
    }
  };

  return {
    achievements,
    addAchievement,
    loading
  };
}

// Hook pour gérer le leaderboard des défis
export function useChallengeLeaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('challenge_leaderboard')
          .select(`
            *,
            profiles:user_id (name)
          `)
          .order('total_challenges_completed', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Erreur lors de la récupération du leaderboard:', error);
          return;
        }

        setLeaderboard(data || []);

        // Récupérer les stats de l'utilisateur actuel
        if (user) {
          const userStat = data?.find(stat => stat.user_id === user.id);
          setUserStats(userStat);
        }
      } catch (error) {
        console.error('Erreur inattendue:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user]);

  const updateUserStats = async (challengesCompleted: number, daysCompleted: number) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('challenge_leaderboard')
        .upsert(
          {
            user_id: user.id,
            total_challenges_completed: challengesCompleted,
            total_days_completed: daysCompleted,
            last_activity: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id' }
        )
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour des stats:', error);
        return;
      }

      setUserStats(data);
    } catch (error) {
      console.error('Erreur inattendue:', error);
    }
  };

  return {
    leaderboard,
    userStats,
    updateUserStats,
    loading
  };
}

// Hook pour gérer les statistiques communautaires
export function useCommunityStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const currentMonth = new Date().toISOString().slice(0, 7); // Format YYYY-MM
        
        const { data, error } = await supabase
          .from('community_stats')
          .select('*')
          .eq('month_year', currentMonth)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Erreur lors de la récupération des stats:', error);
          return;
        }

        setStats(data || {
          total_prayers: 0,
          total_notes: 0,
          total_challenges: 0,
          total_plans_completed: 0,
          active_users: 0
        });
      } catch (error) {
        console.error('Erreur inattendue:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return {
    stats,
    loading
  };
}

// Hook pour gérer la progression des plans de lecture
export function useReadingProgress() {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('reading_plan_progress')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erreur lors de la récupération de la progression:', error);
          return;
        }

        setProgressData(data || []);
      } catch (error) {
        console.error('Erreur inattendue:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  const updateProgress = async (planName: string, totalDays: number, completedDays: number) => {
    if (!user) return;

    const completionPercentage = (completedDays / totalDays) * 100;

    try {
      const { data, error } = await supabase
        .from('reading_plan_progress')
        .upsert(
          {
            user_id: user.id,
            plan_name: planName,
            total_days: totalDays,
            completed_days: completedDays,
            completion_percentage: completionPercentage,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id,plan_name' }
        )
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour de la progression:', error);
        return;
      }

      setProgressData(prev => {
        const existingIndex = prev.findIndex(p => p.plan_name === planName);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = data;
          return updated;
        }
        return [data, ...prev];
      });
    } catch (error) {
      console.error('Erreur inattendue:', error);
    }
  };

  return {
    progressData,
    updateProgress,
    loading
  };
}
