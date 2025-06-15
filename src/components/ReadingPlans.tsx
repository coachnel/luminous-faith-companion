
import React, { useState } from 'react';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calendar, CheckCircle, Clock, Users, Trophy, Play, Settings, Plus } from 'lucide-react';
import { useReadingPlanProgress, READING_PLANS } from '@/hooks/useReadingProgress';
import { toast } from 'sonner';
import CustomReadingPlan from './CustomReadingPlan';

interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: 'bible-complete' | 'nouveau-testament' | 'ancien-testament' | 'thematique';
}

const ReadingPlans = () => {
  const { plans, startPlan, getPlanStats } = useReadingPlanProgress();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCustomPlans, setShowCustomPlans] = useState(false);

  const readingPlans: ReadingPlan[] = [
    {
      id: 'bible-year',
      title: 'Bible en 1 an',
      description: 'Lisez toute la Bible en une année avec un plan structuré',
      duration: 365,
      category: 'bible-complete'
    },
    {
      id: 'new-testament-90',
      title: 'Nouveau Testament en 90 jours',
      description: 'Parcourez le Nouveau Testament en 3 mois',
      duration: 90,
      category: 'nouveau-testament'
    },
    {
      id: 'psalms-proverbs',
      title: 'Psaumes et Proverbes',
      description: 'Sagesse quotidienne avec les Psaumes et Proverbes',
      duration: 60,
      category: 'thematique'
    },
    {
      id: 'gospels-30',
      title: 'Les 4 Évangiles en 30 jours',
      description: 'Découvrez la vie de Jésus à travers les quatre Évangiles',
      duration: 30,
      category: 'nouveau-testament'
    },
    {
      id: 'genesis-revelation',
      title: 'De la Genèse à l\'Apocalypse',
      description: 'Un parcours chronologique de toute la Bible',
      duration: 200,
      category: 'bible-complete'
    }
  ];

  const categories = [
    { id: 'all', label: 'Tous', icon: BookOpen },
    { id: 'bible-complete', label: 'Bible complète', icon: BookOpen },
    { id: 'nouveau-testament', label: 'Nouveau Testament', icon: Calendar },
    { id: 'ancien-testament', label: 'Ancien Testament', icon: Calendar },
    { id: 'thematique', label: 'Thématiques', icon: Users }
  ];

  const filteredPlans = selectedCategory === 'all' 
    ? readingPlans 
    : readingPlans.filter(plan => plan.category === selectedCategory);

  const currentPlan = plans.find(plan => plan.is_active);
  const progress = currentPlan ? getPlanStats(currentPlan) : { completedDays: 0 };

  const handleJoinPlan = (planId: string) => {
    const planData = readingPlans.find(p => p.id === planId);
    if (planData) {
      startPlan(planId, planData.title);
      toast.success('🎉 Plan de lecture rejoint avec succès !');
    }
  };

  const getPlanDuration = (planId: string) => {
    const readingPlan = readingPlans.find(p => p.id === planId);
    const hookPlan = READING_PLANS.find(p => p.id === planId);
    return readingPlan?.duration || hookPlan?.duration || 365;
  };

  if (showCustomPlans) {
    return (
      <div className="p-3 sm:p-4 space-y-4 sm:space-y-6 max-w-4xl mx-auto min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => setShowCustomPlans(false)}
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
              >
                ← Retour aux plans
              </button>
            </div>
          </div>
        </ModernCard>
        <CustomReadingPlan />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6 max-w-4xl mx-auto min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* En-tête */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent-primary)' }}
            >
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] break-words">Plans de lecture</h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] break-words">Structurez votre étude biblique quotidienne</p>
            </div>
          </div>
          <button
            onClick={() => setShowCustomPlans(true)}
            className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Créer un plan personnalisé
          </button>
        </div>
      </ModernCard>

      {/* Plan actuel */}
      {currentPlan && (
        <ModernCard variant="elevated" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-blue-900 break-words">Plan actuel</h3>
                <p className="text-sm text-blue-700 break-words">{currentPlan.plan_name}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 self-start sm:self-auto">
                <Trophy className="h-3 w-3 mr-1" />
                <span className="text-xs">En cours</span>
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                <span className="text-blue-700">Progression</span>
                <span className="text-blue-900 font-medium">{progress.completedDays}/{getPlanDuration(currentPlan.plan_id)} jours</span>
              </div>
              <Progress 
                value={(progress.completedDays / getPlanDuration(currentPlan.plan_id)) * 100} 
                className="h-2"
              />
            </div>
            
            <button 
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 w-full sm:w-auto"
            >
              <Play className="h-4 w-4" />
              Continuer la lecture
            </button>
          </div>
        </ModernCard>
      )}

      {/* Filtres par catégorie */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">Catégories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="break-words">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </ModernCard>

      {/* Liste des plans */}
      <div className="space-y-4">
        {filteredPlans.map((plan) => (
          <ModernCard 
            key={plan.id} 
            className="bg-[var(--bg-card)] border-[var(--border-default)] hover:shadow-md transition-all"
          >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className="font-semibold text-[var(--text-primary)] text-sm sm:text-base break-words">{plan.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-3 break-words leading-relaxed">{plan.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {plan.duration} jours
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--border-default)]">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span>~15 min/jour</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 flex-shrink-0" />
                    <span>Communauté</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleJoinPlan(plan.id)}
                  disabled={currentPlan?.plan_id === plan.id}
                  className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 w-full sm:w-auto"
                >
                  {currentPlan?.plan_id === plan.id ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Actuel
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3" />
                      Commencer
                    </>
                  )}
                </button>
              </div>
            </div>
          </ModernCard>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <ModernCard className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="text-center py-6 sm:py-8">
            <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-[var(--text-secondary)] mx-auto mb-4" />
            <h4 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-2">Aucun plan trouvé</h4>
            <p className="text-[var(--text-secondary)] text-sm px-4">Essayez une autre catégorie pour découvrir d'autres plans de lecture</p>
          </div>
        </ModernCard>
      )}
    </div>
  );
};

export default ReadingPlans;
