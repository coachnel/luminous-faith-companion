
import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Target, Users, Edit3, Calendar, 
  TrendingUp, CheckCircle, Heart, Clock, 
  Compass, Bell, Settings, User, Plus,
  Award, Flame, MessageCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserPreferences, useNotes } from '@/hooks/useSupabaseData';
import { useSupabaseChallenges } from '@/hooks/useSupabaseChallenges';
import { useReadingPlanProgress } from '@/hooks/useReadingProgress';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DashboardProps {
  onNavigate: (section: string) => void;
}

const ModernDashboard = ({ onNavigate }: DashboardProps) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { preferences } = useUserPreferences();
  const { challenges } = useSupabaseChallenges();
  const { notes } = useNotes();
  const { plans } = useReadingPlanProgress();
  const [realUserCount, setRealUserCount] = useState<number>(0);
  const [weeklyActiveUsers, setWeeklyActiveUsers] = useState<number>(0);

  // Obtenir le nombre réel d'utilisateurs inscrits
  useEffect(() => {
    const fetchRealUserStats = async () => {
      try {
        // Compter les utilisateurs réels depuis les profils
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Compter les utilisateurs actifs cette semaine (avec des défis ou notes récents)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const { data: activeChallengeUsers } = await supabase
          .from('daily_challenges')
          .select('user_id')
          .gte('created_at', oneWeekAgo.toISOString());

        const { data: activeNoteUsers } = await supabase
          .from('notes')
          .select('user_id')
          .gte('created_at', oneWeekAgo.toISOString());

        // Combiner et dédupliquer les utilisateurs actifs
        const activeUsers = new Set([
          ...(activeChallengeUsers?.map(u => u.user_id) || []),
          ...(activeNoteUsers?.map(u => u.user_id) || [])
        ]);

        setRealUserCount(totalUsers || 0);
        setWeeklyActiveUsers(activeUsers.size);
      } catch (error) {
        console.error('Erreur lors du comptage des utilisateurs:', error);
        // Valeurs par défaut en cas d'erreur
        setRealUserCount(1);
        setWeeklyActiveUsers(1);
      }
    };

    if (user) {
      fetchRealUserStats();
    }
  }, [user]);

  // Calculer les statistiques de progression
  const activePlans = plans.filter(p => p.is_active);
  const completedChallenges = challenges.filter(c => c.is_completed);
  const activeChallenges = challenges.filter(c => !c.is_completed);
  const totalNotes = notes.length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Bonjour';
    if (hour < 18) return '☀️ Bon après-midi';
    return '🌙 Bonsoir';
  };

  const userName = user?.email?.split('@')[0] || 'Utilisateur';

  return (
    <div 
      className="p-4 space-y-6 max-w-6xl mx-auto min-h-screen"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* En-tête personnalisé */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0066FF, #0052CC)' }}
            >
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                {getGreeting()}, {userName} !
              </h1>
              <p className="text-sm text-[var(--text-secondary)] break-words">
                Continuez votre progression quotidienne
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ModernButton
              onClick={() => onNavigate('notifications')}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </ModernButton>
            <ModernButton
              onClick={() => onNavigate('settings')}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Paramètres</span>
            </ModernButton>
          </div>
        </div>
      </ModernCard>

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ModernCard className="p-4 text-center bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950 dark:to-sky-950 border-blue-200 dark:border-blue-800">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activePlans.length}</div>
          <div className="text-sm text-blue-700 dark:text-blue-300 whitespace-nowrap">Plans actifs</div>
        </ModernCard>
        <ModernCard className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedChallenges.length}</div>
          <div className="text-sm text-green-700 dark:text-green-300 whitespace-nowrap">Défis terminés</div>
        </ModernCard>
        <ModernCard className="p-4 text-center bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 border-purple-200 dark:border-purple-800">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalNotes}</div>
          <div className="text-sm text-purple-700 dark:text-purple-300 whitespace-nowrap">Notes créées</div>
        </ModernCard>
        <ModernCard className="p-4 text-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border-orange-200 dark:border-orange-800">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{activeChallenges.length}</div>
          <div className="text-sm text-orange-700 dark:text-orange-300 whitespace-nowrap">Défis en cours</div>
        </ModernCard>
      </div>

      {/* Actions rapides */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Actions rapides</h3>
          <p className="text-sm text-[var(--text-secondary)]">Accédez rapidement à vos fonctionnalités</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <ModernButton 
            onClick={() => onNavigate('reading-plans')} 
            variant="outline" 
            className="h-auto p-4 flex-col gap-2"
          >
            <Calendar className="h-6 w-6" />
            <span className="text-sm text-center leading-tight">Nouveau<br className="sm:hidden"/>plan</span>
          </ModernButton>
          
          <ModernButton 
            onClick={() => onNavigate('challenges')} 
            variant="outline" 
            className="h-auto p-4 flex-col gap-2"
          >
            <Target className="h-6 w-6" />
            <span className="text-sm text-center leading-tight">Nouveau<br className="sm:hidden"/>défi</span>
          </ModernButton>
          
          <ModernButton 
            onClick={() => onNavigate('prayer-circles')} 
            variant="outline" 
            className="h-auto p-4 flex-col gap-2"
          >
            <Users className="h-6 w-6" />
            <span className="text-sm text-center leading-tight">Créer un<br className="sm:hidden"/>cercle</span>
          </ModernButton>
          
          <ModernButton 
            onClick={() => onNavigate('notes')} 
            variant="outline" 
            className="h-auto p-4 flex-col gap-2"
          >
            <Edit3 className="h-6 w-6" />
            <span className="text-sm text-center leading-tight">Nouvelle<br className="sm:hidden"/>note</span>
          </ModernButton>
          
          <ModernButton 
            onClick={() => onNavigate('discover')} 
            variant="outline" 
            className="h-auto p-4 flex-col gap-2"
          >
            <Compass className="h-6 w-6" />
            <span className="text-sm text-center leading-tight">Découvrir</span>
          </ModernButton>
          
          <ModernButton 
            onClick={() => toast.info('Fonctionnalité à venir')} 
            variant="outline" 
            className="h-auto p-4 flex-col gap-2"
          >
            <Plus className="h-6 w-6" />
            <span className="text-sm text-center leading-tight">Plus</span>
          </ModernButton>
        </div>
      </ModernCard>

      {/* Progression récente */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Plans de lecture */}
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[var(--accent-primary)]" />
              <h4 className="font-semibold text-[var(--text-primary)]">Plans de lecture</h4>
            </div>
            <ModernButton 
              onClick={() => onNavigate('reading-plans')} 
              variant="ghost" 
              size="sm"
            >
              Voir tout
            </ModernButton>
          </div>
          
          {activePlans.length === 0 ? (
            <div className="text-center py-6">
              <Calendar className="h-8 w-8 text-[var(--text-secondary)] mx-auto mb-2" />
              <p className="text-sm text-[var(--text-secondary)] mb-3">Aucun plan actif</p>
              <ModernButton 
                onClick={() => onNavigate('reading-plans')} 
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Commencer un plan
              </ModernButton>
            </div>
          ) : (
            <div className="space-y-3">
              {activePlans.slice(0, 2).map((plan) => (
                <div key={plan.id} className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-default)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[var(--text-primary)] text-sm">{plan.plan_name}</span>
                    <Badge variant="default" className="text-xs">
                      Jour {plan.current_day}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <Clock className="h-3 w-3" />
                    <span>{plan.completed_days.length} jours terminés</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ModernCard>

        {/* Défis récents */}
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[var(--accent-primary)]" />
              <h4 className="font-semibold text-[var(--text-primary)]">Défis</h4>
            </div>
            <ModernButton 
              onClick={() => onNavigate('challenges')} 
              variant="ghost" 
              size="sm"
            >
              Voir tout
            </ModernButton>
          </div>
          
          {challenges.length === 0 ? (
            <div className="text-center py-6">
              <Target className="h-8 w-8 text-[var(--text-secondary)] mx-auto mb-2" />
              <p className="text-sm text-[var(--text-secondary)] mb-3">Aucun défi créé</p>
              <ModernButton 
                onClick={() => onNavigate('challenges')} 
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Créer un défi
              </ModernButton>
            </div>
          ) : (
            <div className="space-y-3">
              {challenges.slice(0, 2).map((challenge) => (
                <div key={challenge.id} className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-default)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[var(--text-primary)] text-sm">{challenge.title}</span>
                    <Badge variant={challenge.is_completed ? "default" : "secondary"} className="text-xs">
                      {challenge.is_completed ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                      {challenge.is_completed ? 'Terminé' : 'En cours'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(challenge.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ModernCard>
      </div>

      {/* Communauté BibleApp */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-primary)' }}
          >
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Communauté BibleApp</h3>
            <p className="text-sm text-[var(--text-secondary)]">Statistiques en temps réel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-default)]">
            <div className="text-2xl font-bold text-[var(--accent-primary)] mb-1">{realUserCount}</div>
            <div className="text-sm text-[var(--text-secondary)]">Utilisateurs inscrits</div>
          </div>
          
          <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-default)]">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{activeChallenges.length}</div>
            <div className="text-sm text-[var(--text-secondary)] text-center leading-tight">Défis actifs<br className="sm:hidden"/>cette semaine</div>
          </div>
          
          <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-default)]">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{weeklyActiveUsers}</div>
            <div className="text-sm text-[var(--text-secondary)] text-center leading-tight">Utilisateurs actifs<br className="sm:hidden"/>cette semaine</div>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default ModernDashboard;
