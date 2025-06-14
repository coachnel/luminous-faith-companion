
import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Target, 
  FileText, 
  Heart, 
  Users, 
  BookOpen, 
  TrendingUp,
  Settings,
  User,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseChallenges } from '@/hooks/useSupabaseChallenges';
import { useNeonNotes } from '@/hooks/useNeonData';
import { useReadingPlanProgress } from '@/hooks/useReadingProgress';
import { supabase } from '@/integrations/supabase/client';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

interface DashboardProps {
  onNavigate: (section: string) => void;
}

const ModernDashboard = ({ onNavigate }: DashboardProps) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { challenges, loading: challengesLoading } = useSupabaseChallenges();
  const { notes, loading: notesLoading } = useNeonNotes();
  const { plans, loading: plansLoading } = useReadingPlanProgress();
  
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeThisWeek: 0,
    todaysPrayers: 0
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        // Compter le nombre total d'utilisateurs
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Compter les utilisateurs actifs cette semaine
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const { count: activeThisWeek } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('updated_at', weekAgo.toISOString());

        // Compter les prières d'aujourd'hui
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { count: todaysPrayers } = await supabase
          .from('prayer_requests')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());

        setUserStats({
          totalUsers: totalUsers || 0,
          activeThisWeek: activeThisWeek || 0,
          todaysPrayers: todaysPrayers || 0
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    fetchUserStats();
  }, []);

  const activeChallenges = challenges.filter(c => c.is_active);
  const activePlans = plans.filter(p => p.is_active);
  const recentNotes = notes.slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #12121A 0%, #1E1E2A 50%, #2A2A3F 100%)'
          : 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 50%, #F0F0F2 100%)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Header moderne */}
      <header 
        className="sticky top-0 z-40 backdrop-blur-lg"
        style={{
          background: theme === 'dark' 
            ? 'rgba(30, 30, 42, 0.9)' 
            : 'rgba(255, 255, 255, 0.9)',
          borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
        }}
      >
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0066FF, #0052CC)' }}
            >
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-sm text-[var(--text-primary)]">
                BibleApp
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ModernButton 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('notifications')}
            >
              <Bell className="h-4 w-4" />
            </ModernButton>
            <ThemeToggle />
            <ModernButton 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('settings')}
            >
              <Settings className="h-4 w-4" />
            </ModernButton>
          </div>
        </div>
      </header>

      <div className="p-4 pb-24 space-y-6 max-w-4xl mx-auto">
        {/* Salutation personnalisée */}
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                {getGreeting()} {user?.email?.split('@')[0]} 👋
              </h2>
              <p className="text-[var(--text-secondary)] mt-1">
                Bienvenue dans votre espace personnel
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent-primary)] flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
        </ModernCard>

        {/* Actions rapides */}
        <ModernCard className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Actions rapides</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ModernButton
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => onNavigate('reading-plans')}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Plans de lecture</span>
            </ModernButton>
            <ModernButton
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => onNavigate('challenges')}
            >
              <Target className="h-5 w-5" />
              <span className="text-xs">Défis</span>
            </ModernButton>
            <ModernButton
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => onNavigate('notes')}
            >
              <FileText className="h-5 w-5" />
              <span className="text-xs">Journal</span>
            </ModernButton>
            <ModernButton
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => onNavigate('prayer-circles')}
            >
              <Heart className="h-5 w-5" />
              <span className="text-xs">Prières</span>
            </ModernButton>
          </div>
        </ModernCard>

        {/* Vue d'ensemble */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Défis actifs */}
          <ModernCard className="bg-[var(--bg-card)] border-[var(--border-default)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--text-primary)]">Défis actifs</h3>
              <Target className="h-5 w-5 text-[var(--accent-primary)]" />
            </div>
            
            {challengesLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-[var(--bg-secondary)] rounded"></div>
                <div className="h-4 bg-[var(--bg-secondary)] rounded w-3/4"></div>
              </div>
            ) : activeChallenges.length > 0 ? (
              <div className="space-y-3">
                {activeChallenges.slice(0, 2).map((challenge) => (
                  <div key={challenge.id} className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="font-medium text-sm text-[var(--text-primary)] mb-1">
                      {challenge.title}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      {challenge.target_days} jours - Commencé le {new Date(challenge.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                <ModernButton 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate('challenges')}
                >
                  Voir tous les défis
                </ModernButton>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-[var(--text-secondary)] mb-2">
                  Aucun défi actif
                </p>
                <ModernButton 
                  size="sm" 
                  onClick={() => onNavigate('challenges')}
                >
                  Créer un défi
                </ModernButton>
              </div>
            )}
          </ModernCard>

          {/* Plans de lecture */}
          <ModernCard className="bg-[var(--bg-card)] border-[var(--border-default)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--text-primary)]">Plans de lecture</h3>
              <BookOpen className="h-5 w-5 text-[var(--accent-primary)]" />
            </div>
            
            {plansLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-[var(--bg-secondary)] rounded"></div>
                <div className="h-4 bg-[var(--bg-secondary)] rounded w-3/4"></div>
              </div>
            ) : activePlans.length > 0 ? (
              <div className="space-y-3">
                {activePlans.slice(0, 2).map((plan) => {
                  const progress = Math.round((plan.completed_days.length / 365) * 100);
                  return (
                    <div key={plan.id} className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="font-medium text-sm text-[var(--text-primary)] mb-2">
                        {plan.plan_name}
                      </div>
                      <Progress value={progress} className="h-2 mb-1" />
                      <div className="text-xs text-[var(--text-secondary)]">
                        {plan.completed_days.length} jours terminés ({progress}%)
                      </div>
                    </div>
                  );
                })}
                <ModernButton 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate('reading-plans')}
                >
                  Voir tous les plans
                </ModernButton>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-[var(--text-secondary)] mb-2">
                  Aucun plan actif
                </p>
                <ModernButton 
                  size="sm" 
                  onClick={() => onNavigate('reading-plans')}
                >
                  Commencer un plan
                </ModernButton>
              </div>
            )}
          </ModernCard>
        </div>

        {/* Notes récentes */}
        <ModernCard className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--text-primary)]">Notes récentes</h3>
            <FileText className="h-5 w-5 text-[var(--accent-primary)]" />
          </div>
          
          {notesLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-[var(--bg-secondary)] rounded"></div>
              <div className="h-4 bg-[var(--bg-secondary)] rounded w-3/4"></div>
            </div>
          ) : recentNotes.length > 0 ? (
            <div className="space-y-3">
              {recentNotes.map((note) => (
                <div key={note.id} className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                  <div className="font-medium text-sm text-[var(--text-primary)] mb-1">
                    {note.title}
                  </div>
                  {note.content && (
                    <div className="text-xs text-[var(--text-secondary)] line-clamp-2">
                      {note.content}
                    </div>
                  )}
                  <div className="text-xs text-[var(--text-secondary)] mt-2">
                    {new Date(note.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
              <ModernButton 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => onNavigate('notes')}
              >
                Voir toutes les notes
              </ModernButton>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-[var(--text-secondary)] mb-2">
                Aucune note pour le moment
              </p>
              <ModernButton 
                size="sm" 
                onClick={() => onNavigate('notes')}
              >
                Créer une note
              </ModernButton>
            </div>
          )}
        </ModernCard>

        {/* Communauté BibleApp */}
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Communauté BibleApp</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Découvrez ce que partage la communauté
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {userStats.totalUsers}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                Utilisateurs inscrits
              </div>
            </div>
            <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {userStats.activeThisWeek}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                Actifs cette semaine
              </div>
            </div>
            <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {userStats.todaysPrayers}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                Prières aujourd'hui
              </div>
            </div>
          </div>
          
          <ModernButton 
            className="w-full gap-2"
            onClick={() => onNavigate('discover')}
          >
            <Search className="h-4 w-4" />
            Découvrir la communauté
          </ModernButton>
        </ModernCard>
      </div>
    </div>
  );
};

export default ModernDashboard;
