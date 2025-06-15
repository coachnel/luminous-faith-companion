import React, { useState } from 'react';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calendar, CheckCircle, Clock, Star, Users, Trophy, Play } from 'lucide-react';
import { useReadingPlanProgress } from '@/hooks/useReadingProgress';
import { toast } from 'sonner';

interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  duration: number; // en jours
  difficulty: 'facile' | 'moyen' | 'difficile';
  category: 'bible-complete' | 'nouveau-testament' | 'ancien-testament' | 'thematique';
  popular: boolean;
}

const ReadingPlans = () => {
  const { plans, startPlan, getPlanStats } = useReadingPlanProgress();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const readingPlans: ReadingPlan[] = [
    {
      id: 'bible-year',
      title: 'Bible en 1 an',
      description: 'Lisez toute la Bible en une année avec un plan structuré',
      duration: 365,
      difficulty: 'moyen',
      category: 'bible-complete',
      popular: true
    },
    {
      id: 'new-testament-90',
      title: 'Nouveau Testament en 90 jours',
      description: 'Parcourez le Nouveau Testament en 3 mois',
      duration: 90,
      difficulty: 'facile',
      category: 'nouveau-testament',
      popular: true
    },
    {
      id: 'psalms-proverbs',
      title: 'Psaumes et Proverbes',
      description: 'Sagesse quotidienne avec les Psaumes et Proverbes',
      duration: 60,
      difficulty: 'facile',
      category: 'thematique',
      popular: false
    },
    {
      id: 'gospels-30',
      title: 'Les 4 Évangiles en 30 jours',
      description: 'Découvrez la vie de Jésus à travers les quatre Évangiles',
      duration: 30,
      difficulty: 'facile',
      category: 'nouveau-testament',
      popular: true
    },
    {
      id: 'genesis-revelation',
      title: 'De la Genèse à l\'Apocalypse',
      description: 'Un parcours chronologique de toute la Bible',
      duration: 200,
      difficulty: 'difficile',
      category: 'bible-complete',
      popular: false
    }
  ];

  const categories = [
    { id: 'all', label: 'Tous', icon: BookOpen },
    { id: 'bible-complete', label: 'Bible complète', icon: BookOpen },
    { id: 'nouveau-testament', label: 'Nouveau Testament', icon: Star },
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-100 text-green-800 border-green-200';
      case 'moyen': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'difficile': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
        </div>
      </ModernCard>

      {/* Plan actuel */}
      {currentPlan && (
        <ModernCard variant="elevated" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-blue-900 break-words">Plan actuel</h3>
                <p className="text-sm text-blue-700 break-words">{currentPlan.title}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 self-start sm:self-auto">
                <Trophy className="h-3 w-3 mr-1" />
                <span className="text-xs">En cours</span>
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                <span className="text-blue-700">Progression</span>
                <span className="text-blue-900 font-medium">{progress.completedDays}/{currentPlan.duration} jours</span>
              </div>
              <Progress 
                value={(progress.completedDays / currentPlan.duration) * 100} 
                className="h-2"
              />
            </div>
            
            <ModernButton 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
            >
              <Play className="h-4 w-4 mr-2" />
              Continuer la lecture
            </ModernButton>
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
                <ModernButton
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? "primary" : "outline"}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="break-words">{category.label}</span>
                </ModernButton>
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
                    {plan.popular && (
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200 self-start sm:self-auto">
                        <Star className="h-3 w-3 mr-1" />
                        <span className="text-xs">Populaire</span>
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-3 break-words leading-relaxed">{plan.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getDifficultyColor(plan.difficulty)}`}
                    >
                      {plan.difficulty}
                    </Badge>
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
                
                <ModernButton
                  onClick={() => handleJoinPlan(plan.id)}
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-sm w-full sm:w-auto text-xs"
                  disabled={currentPlan?.id === plan.id}
                >
                  {currentPlan?.id === plan.id ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Actuel
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      Commencer
                    </>
                  )}
                </ModernButton>
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
