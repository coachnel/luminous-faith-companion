
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { BookOpen, Heart, Target, Calendar, Users, MessageSquare, Bell, User, Edit3 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/hooks/useSupabaseData';

interface ModernDashboardProps {
  onNavigate: (section: string) => void;
}

const ModernDashboard: React.FC<ModernDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { theme } = useTheme();

  const getUserInitials = () => {
    if (profile?.name) {
      return profile.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const stats = [
    { label: 'Jours de lecture', value: '7', color: 'bg-blue-500' },
    { label: 'Versets favoris', value: '24', color: 'bg-purple-500' },
    { label: 'Défis actifs', value: '3', color: 'bg-green-500' },
    { label: 'Prières partagées', value: '12', color: 'bg-orange-500' }
  ];

  const quickActions = [
    { 
      icon: BookOpen, 
      label: 'Bible', 
      section: 'bible',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10'
    },
    { 
      icon: Calendar, 
      label: 'Plans de lecture', 
      section: 'reading-plans',
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10'
    },
    { 
      icon: Target, 
      label: 'Défis', 
      section: 'challenges',
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10'
    },
    { 
      icon: Heart, 
      label: 'Prières', 
      section: 'prayer-circles',
      gradient: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10'
    },
    { 
      icon: Edit3, 
      label: 'Notes', 
      section: 'notes',
      gradient: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-500/10'
    },
    { 
      icon: Heart, 
      label: 'Favoris', 
      section: 'favorites',
      gradient: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-500/10'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header moderne */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 ring-2 ring-[var(--accent-primary)]/20">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[var(--text-secondary)] text-sm">Bonjour,</p>
              <h1 className="text-[var(--text-primary)] font-semibold text-lg">
                {profile?.name || user?.email?.split('@')[0] || 'Utilisateur'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModernButton variant="ghost" size="sm" onClick={() => onNavigate('notifications')}>
              <Bell className="h-5 w-5" />
            </ModernButton>
            <ModernButton variant="ghost" size="sm" onClick={() => onNavigate('settings')}>
              <User className="h-5 w-5" />
            </ModernButton>
          </div>
        </div>

        {/* Balance spirituelle */}
        <div className="mb-8">
          <p className="text-[var(--text-secondary)] text-sm mb-2">Progression spirituelle</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-[var(--text-primary)] text-4xl font-bold">85%</h2>
            <span className="text-green-500 text-sm font-medium">+12% ce mois</span>
          </div>
        </div>

        {/* Cartes de stats modernes */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat, index) => (
            <ModernCard key={index} className="p-4 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--text-secondary)] text-xs mb-1">{stat.label}</p>
                  <p className="text-[var(--text-primary)] text-xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-8 h-8 rounded-lg ${stat.color} opacity-20`}></div>
              </div>
            </ModernCard>
          ))}
        </div>
      </div>

      {/* Section Actions rapides */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[var(--text-primary)] font-semibold text-lg">Spiritualité</h3>
          <ModernButton variant="ghost" size="sm">
            <span className="text-[var(--accent-primary)] text-sm">Voir tout</span>
          </ModernButton>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <ModernCard 
              key={index} 
              className={`p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${action.bgColor} border-none`}
              onClick={() => onNavigate(action.section)}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-[var(--text-primary)] font-medium text-sm">{action.label}</span>
              </div>
            </ModernCard>
          ))}
        </div>
      </div>

      {/* Section Activité récente */}
      <div className="px-6 flex-1">
        <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-4">Activité récente</h3>
        
        <div className="space-y-3">
          <ModernCard className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[var(--text-primary)] font-medium text-sm">Lecture quotidienne</p>
                <p className="text-[var(--text-secondary)] text-xs">Psaume 23 - Il y a 2h</p>
              </div>
              <div className="text-blue-500 text-xs font-medium">+47%</div>
            </div>
          </ModernCard>

          <ModernCard className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[var(--text-primary)] font-medium text-sm">Défi accompli</p>
                <p className="text-[var(--text-secondary)] text-xs">Prière matinale - Aujourd'hui</p>
              </div>
              <div className="text-green-500 text-xs font-medium">25%</div>
            </div>
          </ModernCard>

          <ModernCard className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[var(--text-primary)] font-medium text-sm">Note ajoutée</p>
                <p className="text-[var(--text-secondary)] text-xs">Réflexion sur Jean 3:16 - Il y a 1h</p>
              </div>
              <div className="text-purple-500 text-xs font-medium">23%</div>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;
