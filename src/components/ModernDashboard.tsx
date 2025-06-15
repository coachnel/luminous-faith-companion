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
      }, 300);
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

  // Quick actions with consistent blue circular backgrounds and white icons
  const quickActions = [
    {
      icon: Heart,
      title: "Nouvelle prière",
      description: "Ajouter une intention",
      action: () => onNavigate('prayer'),
      category: 'Prières'
    },
    {
      icon: Plus,
      title: "Créer une note",
      description: "Noter vos réflexions",
      action: () => onNavigate('notes'),
      category: 'Notes'
    },
    {
      icon: Target,
      title: "Nouveau défi",
      description: "Se lancer un défi",
      action: () => onNavigate('challenges'),
      category: 'Défis'
    },
    {
      icon: Star,
      title: "Témoignage",
      description: "Partager votre expérience",
      action: () => onNavigate('testimony'),
      category: 'Témoignages'
    },
    {
      icon: Compass,
      title: "Découvrir",
      description: "Explorer la communauté",
      action: () => onNavigate('discover'),
      category: 'Tout'
    },
    {
      icon: Users,
      title: "Cercles",
      description: "Prier ensemble",
      action: () => onNavigate('prayer-circles'),
      category: 'Prières'
    }
  ];

  // Main navigation cards with blue circular backgrounds and white icons
  const navigationCards = [
    {
      icon: Heart,
      title: "Centre de Prière",
      description: `${stats.prayers} intention${stats.prayers > 1 ? 's' : ''}`,
      route: "prayer",
      category: 'Prières'
    },
    {
      icon: BookOpen,
      title: "Journal Spirituel",
      description: `${stats.notes} note${stats.notes > 1 ? 's' : ''}`,
      route: "notes",
      category: 'Notes'
    },
    {
      icon: Target,
      title: "Défis Quotidiens",
      description: `${stats.activeChallenges} défi${stats.activeChallenges > 1 ? 's' : ''} actif${stats.activeChallenges > 1 ? 's' : ''}`,
      route: "challenges",
      category: 'Défis'
    },
    {
      icon: Calendar,
      title: "Plans de Lecture",
      description: `${stats.activePlans} plan${stats.activePlans > 1 ? 's' : ''} actif${stats.activePlans > 1 ? 's' : ''}`,
      route: "reading-plans",
      category: 'Tout'
    }
  ];

  const filters = ['Tout', 'Prières', 'Notes', 'Défis', 'Témoignages'];

  // Filter function for actions and cards
  const getFilteredQuickActions = () => {
    if (activeFilter === 'Tout') return quickActions;
    return quickActions.filter(action => action.category === activeFilter);
  };

  const getFilteredNavigationCards = () => {
    if (activeFilter === 'Tout') return navigationCards;
    return navigationCards.filter(card => card.category === activeFilter);
  };

  const getUserName = () => {
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Ami';
  };

  const filteredQuickActions = getFilteredQuickActions();
  const filteredNavigationCards = getFilteredNavigationCards();

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-6xl mx-auto min-h-screen bg-gray-50">
      {/* Hero Card with blue background and white text */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 p-4 sm:p-6 text-white shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/5 rounded-full translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 text-white break-words">
                Bonjour {getUserName()} 🌅
              </h1>
              <p className="text-blue-100 text-sm sm:text-base opacity-90 break-words">
                Votre parcours spirituel continue aujourd'hui
              </p>
            </div>
            <button 
              onClick={() => onNavigate('settings')}
              className="p-3 rounded-xl sm:rounded-2xl bg-blue-600 backdrop-blur-sm hover:bg-blue-700 transition-all flex-shrink-0 ml-3"
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-4 sm:mt-6">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base text-white">{stats.prayers} prières</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base text-white">{stats.notes} notes</span>
            </div>
            <div className="text-blue-100 text-xs sm:text-sm">
              {stats.activeChallenges} défis actifs
            </div>
          </div>
        </div>
      </div>

      {/* Modern Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher dans votre espace spirituel..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-0 bg-white shadow-sm text-sm sm:text-base placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Blue Pill-style Filters */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeFilter === filter
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Quick Actions with blue circular backgrounds and white icons */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Actions rapides</h2>
          <button className="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700">
            Voir tout
          </button>
        </div>
        
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {filteredQuickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div key={index} className="flex-shrink-0 w-32 sm:w-40">
                <button
                  onClick={action.action}
                  className="w-full bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 flex items-center justify-center mb-2 sm:mb-3">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm text-gray-900 mb-1 break-words">{action.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed break-words">{action.description}</p>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Votre activité</h3>
        
        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-100">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.prayers}</div>
              <div className="text-xs sm:text-sm text-gray-600">Prières</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-green-50 border border-green-100">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.notes}</div>
              <div className="text-xs sm:text-sm text-gray-600">Notes</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-purple-50 border border-purple-100">
              <div className="text-xl sm:text-2xl font-bold text-purple-600">{stats.activeChallenges}</div>
              <div className="text-xs sm:text-sm text-gray-600">Défis actifs</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-orange-50 border border-orange-100">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">{stats.activePlans}</div>
              <div className="text-xs sm:text-sm text-gray-600">Plans actifs</div>
            </div>
          </div>
        )}
      </div>

      {/* "Your Spaces" Navigation Cards with blue circular backgrounds and white icons */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Vos espaces</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {filteredNavigationCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="p-4 sm:p-6 cursor-pointer transition-all duration-200 hover:shadow-md rounded-xl sm:rounded-2xl bg-white border border-gray-100"
                onClick={() => onNavigate(card.route)}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 break-words">{card.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">{card.description}</p>
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
