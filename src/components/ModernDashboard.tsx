
import React, { memo, useMemo, useState, useEffect } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Heart, BookOpen, Target, Compass, Users, Plus, Zap, Settings, Calendar, MessageSquare, Star } from 'lucide-react';
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

  // Tous les hooks doivent être appelés de manière inconditionnelle
  const prayerData = useNeonPrayerRequests();
  const notesData = useNeonNotes();
  const plansData = useReadingPlanProgress();
  const challengesData = useSupabaseChallenges();
  useDataCleanup();

  // Calcul des statistiques avec useMemo - appelé de manière inconditionnelle
  const stats = useMemo(() => {
    if (!user || !prayerData || !notesData || !plansData || !challengesData) {
      return {
        prayers: 0,
        notes: 0,
        activePlans: 0,
        activeChallenges: 0,
        publicContent: 0
      };
    }

    const prayerRequests = prayerData.prayerRequests || [];
    const notes = notesData.notes || [];
    const plans = plansData.plans || [];
    const challenges = challengesData.challenges || [];

    return {
      prayers: prayerRequests.length,
      notes: notes.length,
      activePlans: plans.filter(plan => plan?.is_active).length,
      activeChallenges: challenges.filter(challenge => challenge?.is_active).length,
      publicContent: prayerRequests.filter(prayer => prayer && !prayer.is_anonymous).length
    };
  }, [user, prayerData?.prayerRequests, notesData?.notes, plansData?.plans, challengesData?.challenges]);

  // Effect pour la préparation - appelé de manière inconditionnelle
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
    }
  }, [user]);

  // Affichage conditionnel basé sur les états
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-purple-700 mb-2">Connexion en cours...</p>
        <p className="text-gray-600 text-sm">
          Vérification de votre session...<br/>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-purple-600 underline"
          >
            Actualiser si ça prend trop de temps
          </button>
        </p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-blue-700 mb-2">Chargement du tableau de bord...</p>
        <p className="text-gray-600 text-sm">Préparation de votre espace personnel...</p>
      </div>
    );
  }

  const loading = prayerData?.loading || notesData?.loading || plansData?.loading || challengesData?.loading;

  // Actions rapides - design sobre et clean
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
    }
  ];

  // Cartes de navigation principales - design sobre
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
    },
    {
      icon: MessageSquare,
      title: "Communauté",
      description: "Partagez et découvrez ensemble",
      color: "bg-white",
      borderColor: "border-gray-200",
      iconBg: "bg-teal-50",
      iconColor: "text-teal-600",
      route: "community"
    },
    {
      icon: Star,
      title: "Témoignages",
      description: "Histoires de foi inspirantes",
      color: "bg-white",
      borderColor: "border-gray-200",
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-600",
      route: "testimony"
    },
    {
      icon: Compass,
      title: "Découvrir",
      description: "Contenu partagé par la communauté",
      color: "bg-white",
      borderColor: "border-gray-200",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      route: "discover"
    },
    {
      icon: Users,
      title: "Cercles de Prière",
      description: "Prier ensemble en communauté",
      color: "bg-white",
      borderColor: "border-gray-200",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      route: "prayer-circles"
    }
  ];

  const getUserName = () => {
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Ami';
  };

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto min-h-screen bg-gray-50">
      {/* En-tête sobre */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
            <Zap className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Bonjour {getUserName()}
            </h1>
            <p className="text-gray-600">
              Bienvenue dans votre espace spirituel personnel
            </p>
          </div>
          <ModernButton 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('settings')}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Paramètres</span>
          </ModernButton>
        </div>
      </div>

      {/* Quick Actions - design sobre */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className={`transition-all duration-200 rounded-lg p-4 ${action.color} ${action.borderColor} border hover:shadow-md flex flex-col items-center min-h-[100px]`}
              onClick={action.action}
            >
              <div className={`w-10 h-10 mb-2 rounded-lg flex items-center justify-center ${action.color}`}>
                <Icon className={`h-5 w-5 ${action.iconColor}`} />
              </div>
              <div className="font-medium text-sm text-gray-900 text-center mb-1">{action.title}</div>
              <div className="text-xs text-gray-600 text-center">{action.description}</div>
            </button>
          );
        })}
      </div>

      {/* Statistiques */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Votre activité</h2>
          <p className="text-sm text-gray-600">Aperçu de votre parcours spirituel</p>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{stats.prayers}</div>
              <div className="text-sm text-gray-600">Prières</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{stats.notes}</div>
              <div className="text-sm text-gray-600">Notes</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{stats.activeChallenges}</div>
              <div className="text-sm text-gray-600">Défis actifs</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{stats.activePlans}</div>
              <div className="text-sm text-gray-600">Plans actifs</div>
            </div>
          </div>
        )}
      </div>

      {/* Sections principales - design sobre */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {navigationCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-md rounded-lg ${card.color} ${card.borderColor} border`}
              onClick={() => onNavigate(card.route)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.iconBg} border border-gray-100`}>
                  <Icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{card.title}</h3>
                  <p className="text-sm text-gray-600 truncate">{card.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

ModernDashboard.displayName = 'ModernDashboard';

export default ModernDashboard;
