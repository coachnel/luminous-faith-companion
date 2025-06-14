
import React, { useState } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Play, CheckCircle, Clock, Target, Plus, Book, Info, X } from 'lucide-react';
import { useReadingPlanProgress, READING_PLANS } from '@/hooks/useReadingProgress';
import { toast } from 'sonner';

// Données bibliques pour les plans
const BIBLE_READINGS = {
  'bible-1-year': [
    { day: 1, passages: ['Genèse 1-3', 'Matthieu 1'] },
    { day: 2, passages: ['Genèse 4-7', 'Matthieu 2'] },
    { day: 3, passages: ['Genèse 8-11', 'Matthieu 3'] },
    // ... plus de données
  ],
  'new-testament-90': [
    { day: 1, passages: ['Matthieu 1-2'] },
    { day: 2, passages: ['Matthieu 3-4'] },
    { day: 3, passages: ['Matthieu 5-7'] },
    // ... plus de données
  ],
  'psalms-month': [
    { day: 1, passages: ['Psaume 1-5'] },
    { day: 2, passages: ['Psaume 6-10'] },
    { day: 3, passages: ['Psaume 11-15'] },
    // ... plus de données
  ]
};

const ReadingPlans = () => {
  const { plans, startPlan, cancelPlan, markDayCompleted, getPlanStats, loading } = useReadingPlanProgress();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customPlan, setCustomPlan] = useState({
    name: '',
    duration: 30,
    description: ''
  });

  const handleStartPlan = async (planId: string) => {
    const plan = READING_PLANS.find(p => p.id === planId);
    if (!plan) return;

    try {
      await startPlan(planId, plan.name);
      toast.success(`Plan "${plan.name}" démarré !`);
    } catch (error) {
      toast.error('Erreur lors du démarrage du plan');
    }
  };

  const handleCancelPlan = async (planId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ce plan de lecture ?')) {
      try {
        await cancelPlan(planId);
        toast.success('Plan de lecture annulé');
      } catch (error) {
        toast.error('Erreur lors de l\'annulation du plan');
      }
    }
  };

  const handleMarkDay = async (planId: string, day: number) => {
    try {
      await markDayCompleted(planId, day);
      toast.success(`Jour ${day + 1} marqué comme terminé !`);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const createCustomPlan = () => {
    if (!customPlan.name.trim()) {
      toast.error('Veuillez donner un nom à votre plan');
      return;
    }

    // Pour l'instant, on simule la création d'un plan personnalisé
    toast.success('Plan personnalisé créé ! (Fonctionnalité en développement)');
    setShowCustomForm(false);
    setCustomPlan({ name: '', duration: 30, description: '' });
  };

  const getReadingForDay = (planId: string, day: number) => {
    const readings = BIBLE_READINGS[planId as keyof typeof BIBLE_READINGS];
    if (!readings || !readings[day - 1]) {
      return [`Lecture du jour ${day}`];
    }
    return readings[day - 1].passages;
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Chargement des plans...</p>
      </div>
    );
  }

  return (
    <div 
      className="p-4 space-y-6 max-w-4xl mx-auto min-h-screen"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* En-tête */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-primary)' }}
          >
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Plans de lecture</h1>
            <p className="text-sm text-[var(--text-secondary)] break-words">
              Suivez votre progression dans la lecture
            </p>
          </div>
        </div>
      </ModernCard>

      {/* Plans actifs */}
      {plans.filter(p => p.is_active).length > 0 && (
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Plans actifs</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {plans.filter(p => p.is_active).length} plan(s) en cours
            </p>
          </div>

          <div className="space-y-4">
            {plans.filter(p => p.is_active).map((plan) => {
              const stats = getPlanStats(plan);
              return (
                <ModernCard key={plan.id} className="p-4 bg-[var(--bg-secondary)] border-[var(--border-default)]">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)]">{plan.plan_name}</h4>
                        <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mt-1">
                          <span>Jour {plan.current_day}/{stats.totalDays}</span>
                          <span>{stats.percentage}% terminé</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="flex items-center gap-1 flex-shrink-0">
                          <Target className="h-3 w-3" />
                          En cours
                        </Badge>
                        <ModernButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelPlan(plan.id)}
                          className="gap-1 text-red-600 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                          Annuler
                        </ModernButton>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[var(--accent-primary)] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>

                    {/* Lecture du jour */}
                    <div className="p-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border-default)]">
                      <div className="flex items-center gap-2 mb-2">
                        <Book className="h-4 w-4 text-[var(--accent-primary)]" />
                        <span className="font-medium text-[var(--text-primary)]">Lecture du jour {plan.current_day}</span>
                      </div>
                      <div className="space-y-1">
                        {getReadingForDay(plan.plan_id, plan.current_day).map((passage, index) => (
                          <div key={index} className="text-sm text-[var(--text-secondary)]">
                            📖 {passage}
                          </div>
                        ))}
                      </div>
                      <ModernButton
                        onClick={() => handleMarkDay(plan.id, plan.current_day - 1)}
                        disabled={plan.completed_days.includes(plan.current_day - 1)}
                        size="sm"
                        className="mt-3 gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        {plan.completed_days.includes(plan.current_day - 1) ? 'Terminé' : 'Marquer comme lu'}
                      </ModernButton>
                    </div>
                  </div>
                </ModernCard>
              );
            })}
          </div>
        </ModernCard>
      )}

      {/* Plans disponibles */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Plans disponibles</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Choisissez un plan de lecture pour commencer
            </p>
          </div>
          <ModernButton 
            onClick={() => setShowCustomForm(!showCustomForm)} 
            variant="outline" 
            className="gap-2 flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span className="whitespace-nowrap">Plan personnalisé</span>
          </ModernButton>
        </div>

        {/* Formulaire plan personnalisé */}
        {showCustomForm && (
          <ModernCard className="mb-6 p-4 bg-[var(--bg-secondary)] border-[var(--border-default)]">
            <div className="space-y-4">
              <h4 className="font-semibold text-[var(--text-primary)]">Créer un plan personnalisé</h4>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Nom du plan
                </label>
                <input
                  type="text"
                  value={customPlan.name}
                  onChange={(e) => setCustomPlan({...customPlan, name: e.target.value})}
                  placeholder="Ex: Mon plan personnel..."
                  className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Durée (jours)
                </label>
                <input
                  type="number"
                  value={customPlan.duration}
                  onChange={(e) => setCustomPlan({...customPlan, duration: parseInt(e.target.value) || 30})}
                  min="7"
                  max="365"
                  className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <ModernButton 
                  onClick={createCustomPlan}
                  disabled={!customPlan.name.trim()}
                  className="flex-1"
                >
                  Créer le plan
                </ModernButton>
                <ModernButton 
                  onClick={() => setShowCustomForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </ModernButton>
              </div>
            </div>
          </ModernCard>
        )}

        {/* Liste des plans prédéfinis */}
        <div className="grid gap-4">
          {READING_PLANS.map((plan) => {
            const isActive = plans.some(p => p.plan_id === plan.id && p.is_active);
            
            return (
              <ModernCard key={plan.id} className="p-4 bg-[var(--bg-secondary)] border-[var(--border-default)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-[var(--text-primary)]">{plan.name}</h4>
                      {isActive && (
                        <Badge variant="default" className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          Actif
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-2">{plan.description}</p>
                    <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{plan.duration} jours</span>
                      </div>
                    </div>
                  </div>
                  
                  <ModernButton
                    onClick={() => handleStartPlan(plan.id)}
                    disabled={isActive}
                    className="gap-2 flex-shrink-0"
                  >
                    <Play className="h-4 w-4" />
                    <span className="whitespace-nowrap">{isActive ? 'Déjà actif' : 'Démarrer'}</span>
                  </ModernButton>
                </div>
              </ModernCard>
            );
          })}
        </div>
      </ModernCard>

      {/* Comment ça marche */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Comment ça marche ?
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Choisissez un plan de lecture prédéfini ou créez le vôtre. 
              Chaque jour, vous recevrez des passages à lire selon votre plan. 
              Marquez vos lectures comme terminées pour suivre votre progression. 
              Les textes bibliques sont intégrés directement dans les plans, vous n'avez pas besoin d'accéder à une autre section. 
              Votre progression est sauvegardée automatiquement. Vous pouvez annuler un plan actif à tout moment.
            </p>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default ReadingPlans;
