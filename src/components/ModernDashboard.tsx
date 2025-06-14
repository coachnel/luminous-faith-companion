
import React, { memo, useMemo } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Badge } from '@/components/ui/badge';
import { Heart, BookOpen, Target, Compass, Users, Plus, Calendar, Zap, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNeonPrayerRequests, useNeonNotes } from '@/hooks/useNeonData';
import { useReadingPlanProgress } from '@/hooks/useReadingProgress';
import { useSupabaseChallenges } from '@/hooks/useSupabaseChallenges';
import { useDataCleanup } from '@/hooks/useDataCleanup';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

const ModernDashboard: React.FC<DashboardProps> = memo(({ onNavigate }) => {
  const { user } = useAuth();
  const { prayerRequests, loading: prayersLoading } = useNeonPrayerRequests();
  const { notes, loading: notesLoading } = useNeonNotes();
  const { plans, loading: plansLoading } = useReadingPlanProgress();
  const { challenges, loading: challengesLoading } = useSupabaseChallenges();

  // Utiliser le hook de nettoyage automatique
  useDataCleanup();

  // Mémoiser les statistiques pour optimiser les performances
  const stats = useMemo(() => ({
    prayers: prayerRequests.length,
    notes: notes.length,
    activePlans: plans.filter(plan => plan.is_active).length,
    activeChallenges: challenges.filter(challenge => challenge.is_active).length,
    publicContent: prayerRequests.filter(prayer => !prayer.is_anonymous).length
  }), [prayerRequests, notes, plans, challenges]);

  const loading = prayersLoading || notesLoading || plansLoading || challengesLoading;

  const quickActions = [
    {
      icon: Heart,
      title: "Nouvelle prière",
      description: "Ajouter une intention",
      color: "from-red-500 to-pink-500",
      action: () => onNavigate('/prayer')
    },
    {
      icon: Plus,
      title: "Créer une note",
      description: "Noter vos réflexions",
      color: "from-blue-500 to-indigo-500",
      action: () => onNavigate('/notes')
    },
    {
      icon: Target,
      title: "Nouveau défi",
      description: "Se lancer un défi",
      color: "from-green-500 to-emerald-500",
      action: () => onNavigate('/challenges')
    },
    {
      icon: BookOpen,
      title: "Plan de lecture",
      description: "Commencer à lire",
      color: "from-purple-500 to-violet-500",
      action: () => onNavigate('/reading-plans')
    }
  ];

  const navigationCards = [
    {
      icon: Heart,
      title: "Centre de Prière",
      description: `${stats.prayers} intention${stats.prayers > 1 ? 's' : ''}`,
      color: "from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950",
      borderColor: "border-red-200 dark:border-red-800",
      textColor: "text-red-600 dark:text-red-400",
      route: "/prayer"
    },
    {
      icon: BookOpen,
      title: "Journal",
      description: `${stats.notes} note${stats.notes > 1 ? 's' : ''}`,
      color: "from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-600 dark:text-blue-400",
      route: "/notes"
    },
    {
      icon: Target,
      title: "Défis quotidiens",
      description: `${stats.activeChallenges} défi${stats.activeChallenges > 1 ? 's' : ''} actif${stats.activeChallenges > 1 ? 's' : ''}`,
      color: "from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
      borderColor: "border-green-200 dark:border-green-800",
      textColor: "text-green-600 dark:text-green-400",
      route: "/challenges"
    },
    {
      icon: BookOpen,
      title: "Plans de lecture",
      description: `${stats.activePlans} plan${stats.activePlans > 1 ? 's' : ''} actif${stats.activePlans > 1 ? 's' : ''}`,
      color: "from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950",
      borderColor: "border-purple-200 dark:border-purple-800",
      textColor: "text-purple-600 dark:text-purple-400",
      route: "/reading-plans"
    },
    {
      icon: Compass,
      title: "Découvrir",
      description: `${stats.publicContent} contenu${stats.publicContent > 1 ? 's' : ''} partagé${stats.publicContent > 1 ? 's' : ''}`,
      color: "from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950",
      borderColor: "border-orange-200 dark:border-orange-800",
      textColor: "text-orange-600 dark:text-orange-400",
      route: "/discover"
    },
    {
      icon: Users,
      title: "Cercles de prière",
      description: "Communauté spirituelle",
      color: "from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950",
      borderColor: "border-teal-200 dark:border-teal-800",
      textColor: "text-teal-600 dark:text-teal-400",
      route: "/prayer-circles"
    }
  ];

  return (
    <div 
      className="p-4 space-y-6 max-w-6xl mx-auto min-h-screen"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* En-tête avec message de bienvenue */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-primary)' }}
          >
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Bonjour {user?.email?.split('@')[0] || 'Ami'}
            </h1>
            <p className="text-[var(--text-secondary)]">
              Bienvenue dans votre espace spirituel personnel
            </p>
          </div>
          <ModernButton 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('/settings')}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Paramètres</span>
          </ModernButton>
        </div>
      </ModernCard>

      {/* Actions rapides */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Actions rapides</h2>
          <p className="text-sm text-[var(--text-secondary)]">Commencez quelque chose de nouveau</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <ModernCard
                key={index}
                className={`p-4 cursor-pointer transition-all duration-200 hover:scale-105 bg-gradient-to-br ${action.color} border-0`}
                onClick={action.action}
              >
                <div className="text-center text-white">
                  <Icon className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
              </ModernCard>
            );
          })}
        </div>
      </ModernCard>

      {/* Statistiques de la communauté */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Votre activité</h2>
          <p className="text-sm text-[var(--text-secondary)]">Aperçu de votre parcours spirituel</p>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)]">Chargement...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]">
              <div className="text-2xl font-bold text-[var(--accent-primary)]">{stats.prayers}</div>
              <div className="text-sm text-[var(--text-secondary)]">Prières</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]">
              <div className="text-2xl font-bold text-[var(--accent-primary)]">{stats.notes}</div>
              <div className="text-sm text-[var(--text-secondary)]">Notes</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]">
              <div className="text-2xl font-bold text-[var(--accent-primary)]">{stats.activeChallenges}</div>
              <div className="text-sm text-[var(--text-secondary)]">Défis actifs</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]">
              <div className="text-2xl font-bold text-[var(--accent-primary)]">{stats.activePlans}</div>
              <div className="text-sm text-[var(--text-secondary)]">Plans actifs</div>
            </div>
          </div>
        )}
      </ModernCard>

      {/* Sections principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {navigationCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <ModernCard
              key={index}
              className={`p-6 cursor-pointer transition-all duration-200 hover:scale-105 bg-gradient-to-br ${card.color} ${card.borderColor}`}
              onClick={() => onNavigate(card.route)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/80 dark:bg-black/20`}>
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold ${card.textColor} mb-1 truncate`}>{card.title}</h3>
                  <p className={`text-sm ${card.textColor} opacity-80 truncate`}>{card.description}</p>
                </div>
              </div>
            </ModernCard>
          );
        })}
      </div>
    </div>
  );
});

ModernDashboard.displayName = 'ModernDashboard';

export default ModernDashboard;
