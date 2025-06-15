import React, { memo, useMemo, useState, useEffect } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Heart, BookOpen, Target, Compass, Users, Plus, Zap, Settings, Calendar, MessageSquare, Star, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
  const [isReady, setIsReady] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Tout');
  const [searchQuery, setSearchQuery] = useState('');

  // CORRECTION: Appeler tous les hooks de manière inconditionnelle
  const prayerData = useNeonPrayerRequests();
  const notesData = useNeonNotes();
  const plansData = useReadingPlanProgress();
  const challengesData = useSupabaseChallenges();
  useDataCleanup();

  // Calcul des statistiques sécurisé
  const stats = useMemo(() => {
    const defaultStats = {
      prayers: 0,
      notes: 0,
      activePlans: 0,
      activeChallenges: 0,
      publicContent: 0
    };

    if (!user || !prayerData?.prayerRequests || !notesData?.notes || !plansData?.plans || !challengesData?.challenges) {
      return defaultStats;
    }

    try {
      const prayerRequests = Array.isArray(prayerData.prayerRequests) ? prayerData.prayerRequests : [];
      const notes = Array.isArray(notesData.notes) ? notesData.notes : [];
      const plans = Array.isArray(plansData.plans) ? plansData.plans : [];
      const challenges = Array.isArray(challengesData.challenges) ? challengesData.challenges : [];

      return {
        prayers: prayerRequests.length,
        notes: notes.length,
        activePlans: plans.filter(plan => plan?.is_active).length,
        activeChallenges: challenges.filter(challenge => challenge?.is_active).length,
        publicContent: prayerRequests.filter(prayer => prayer && !prayer.is_anonymous).length
      };
    } catch (error) {
      console.error('Erreur calcul stats:', error);
      return defaultStats;
    }
  }, [user, prayerData?.prayerRequests, notesData?.notes, plansData?.plans, challengesData?.challenges]);

  // Effect de préparation sécurisé
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 300); // Réduit le délai
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
    }
  }, [user]);

  // Rendu conditionnel sécurisé
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-base font-medium text-gray-700 mb-2">Connexion...</p>
        <p className="text-gray-500 text-sm">Vérification de votre session</p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-base font-medium text-gray-700 mb-2">Chargement...</p>
        <p className="text-gray-500 text-sm">Préparation de votre espace</p>
      </div>
    );
  }

  const loading = prayerData?.loading || notesData?.loading || plansData?.loading || challengesData?.loading;

  // Actions rapides - design sobre et propre
  const quickActions = [
    {
      icon: Heart,
      title: "Nouvelle prière",
      description: "Ajouter une intention",
      color: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-100",
      action: () => onNavigate('prayer'),
    },
    {
      icon: Plus,
      title: "Créer une note",
      description: "Noter vos réflexions",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-100",
      action: () => onNavigate('notes'),
    },
    {
      icon: Target,
      title: "Nouveau défi",
      description: "Se lancer un défi",
      color: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-100",
      action: () => onNavigate('challenges'),
    },
    {
      icon: Star,
      title: "Témoignage",
      description: "Partager votre expérience",
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-100",
      action: () => onNavigate('testimony'),
    },
    {
      icon: Compass,
      title: "Découvrir",
      description: "Explorer la communauté",
      color: "bg-orange-50",
      iconColor: "text-orange-600",
      action: () => onNavigate('discover'),
    },
    {
      icon: Users,
      title: "Cercles",
      description: "Prier ensemble",
      color: "bg-indigo-50",
      iconColor: "text-indigo-600",
      action: () => onNavigate('prayer-circles'),
    }
  ];

  // Cartes de navigation principales
  const navigationCards = [
    {
      icon: Heart,
      title: "Centre de Prière",
      description: `${stats.prayers} intention${stats.prayers > 1 ? 's' : ''}`,
      color: "bg-white",
      borderColor: "border-gray-200",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      route: "prayer"
    },
    {
      icon: BookOpen,
      title: "Journal Spirituel",
      description: `${stats.notes} note${stats.notes > 1 ? 's' : ''}`,
      color: "bg-white",
      borderColor: "border-gray-200",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      route: "notes"
    },
    {
      icon: Target,
      title: "Défis Quotidiens",
      description: `${stats.activeChallenges} défi${stats.activeChallenges > 1 ? 's' : ''} actif${stats.activeChallenges > 1 ? 's' : ''}`,
      color: "bg-white",
      borderColor: "border-gray-200",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      route: "challenges"
    },
    {
      icon: Calendar,
      title: "Plans de Lecture",
      description: `${stats.activePlans} plan${stats.activePlans > 1 ? 's' : ''} actif${stats.activePlans > 1 ? 's' : ''}`,
      color: "bg-white",
      borderColor: "border-gray-200",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      route: "reading-plans"
    }
  ];

  const filters = ['Tout', 'Prières', 'Notes', 'Défis', 'Témoignages'];

  const getUserName = () => {
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Ami';
  };

  return (
    <div className="p-3 sm:p-4 space-y-6 max-w-6xl mx-auto min-h-screen bg-gray-50">
      {/* Hero Card - Travel app inspired */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 p-6 text-white shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Bonjour {getUserName()} 🌅
              </h1>
              <p className="text-blue-100 text-sm sm:text-base opacity-90">
                Votre parcours spirituel continue aujourd'hui
              </p>
            </div>
            <button 
              onClick={() => onNavigate('settings')}
              className="p-2 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{stats.prayers} prières</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span className="font-medium">{stats.notes} notes</span>
            </div>
            <div className="text-blue-100 text-sm">
              {stats.activeChallenges} défis actifs
            </div>
          </div>
        </div>
      </div>

      {/* Modern Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher dans votre espace spirituel..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-4 py-4 rounded-2xl border-0 bg-white shadow-sm text-base placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Pill-style Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeFilter === filter
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Quick Actions - Horizontal Scroll */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Actions rapides</h2>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
            Voir tout
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div key={index} className="flex-shrink-0 w-40">
                <button
                  onClick={action.action}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left"
                >
                  <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center mb-3`}>
                    <Icon className={`h-6 w-6 ${action.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{action.description}</p>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Votre activité</h3>
        
        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">{stats.prayers}</div>
              <div className="text-sm text-gray-600">Prières</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-green-50 border border-green-100">
              <div className="text-2xl font-bold text-green-600">{stats.notes}</div>
              <div className="text-sm text-gray-600">Notes</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-purple-50 border border-purple-100">
              <div className="text-2xl font-bold text-purple-600">{stats.activeChallenges}</div>
              <div className="text-sm text-gray-600">Défis actifs</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-orange-50 border border-orange-100">
              <div className="text-2xl font-bold text-orange-600">{stats.activePlans}</div>
              <div className="text-sm text-gray-600">Plans actifs</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Vos espaces</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {navigationCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="p-6 cursor-pointer transition-all duration-200 hover:shadow-md rounded-2xl bg-white border border-gray-100"
                onClick={() => onNavigate(card.route)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.iconBg}`}>
                    <Icon className={`h-7 w-7 ${card.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{card.title}</h4>
                    <p className="text-sm text-gray-600">{card.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

ModernDashboard.displayName = 'ModernDashboard';

export default ModernDashboard;
