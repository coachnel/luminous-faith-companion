
import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Calendar, BookOpen, Target, Clock, Play, Pause, RotateCcw, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const ReadingPlans = () => {
  const [activePlan, setActivePlan] = useState(null);
  const [customPlan, setCustomPlan] = useState({ title: '', duration: 30, books: [] });
  const [showCustomForm, setShowCustomForm] = useState(false);

  const predefinedPlans = [
    {
      id: 1,
      title: 'Bible en 1 an',
      duration: 365,
      description: 'Lecture complète de la Bible en 365 jours',
      dailyChapters: 3,
      testaments: ['Ancien', 'Nouveau'],
      difficulty: 'Intermédiaire'
    },
    {
      id: 2,
      title: 'Nouveau Testament en 3 mois',
      duration: 90,
      description: 'Découverte complète du Nouveau Testament',
      dailyChapters: 3,
      testaments: ['Nouveau'],
      difficulty: 'Facile'
    },
    {
      id: 3,
      title: 'Psaumes et Proverbes',
      duration: 60,
      description: 'Sagesse et louange quotidiennes',
      dailyChapters: 2,
      testaments: ['Ancien'],
      difficulty: 'Facile'
    },
    {
      id: 4,
      title: 'Évangiles intensif',
      duration: 30,
      description: 'Immersion dans la vie de Jésus',
      dailyChapters: 3,
      testaments: ['Nouveau'],
      difficulty: 'Facile'
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('activeReadingPlan');
    if (saved) {
      setActivePlan(JSON.parse(saved));
    }
  }, []);

  const startPlan = (plan) => {
    const planWithProgress = {
      ...plan,
      startDate: new Date().toISOString(),
      currentDay: 1,
      completedDays: [],
      progress: 0
    };
    
    setActivePlan(planWithProgress);
    localStorage.setItem('activeReadingPlan', JSON.stringify(planWithProgress));
    toast.success(`Plan "${plan.title}" démarré !`);
  };

  const pausePlan = () => {
    if (activePlan) {
      const updatedPlan = { ...activePlan, paused: true };
      setActivePlan(updatedPlan);
      localStorage.setItem('activeReadingPlan', JSON.stringify(updatedPlan));
      toast.info('Plan mis en pause');
    }
  };

  const resumePlan = () => {
    if (activePlan) {
      const updatedPlan = { ...activePlan, paused: false };
      setActivePlan(updatedPlan);
      localStorage.setItem('activeReadingPlan', JSON.stringify(updatedPlan));
      toast.success('Plan repris !');
    }
  };

  const resetPlan = () => {
    setActivePlan(null);
    localStorage.removeItem('activeReadingPlan');
    toast.info('Plan réinitialisé');
  };

  const createCustomPlan = () => {
    if (!customPlan.title.trim()) {
      toast.error('Veuillez saisir un titre pour votre plan');
      return;
    }

    const newPlan = {
      id: Date.now(),
      title: customPlan.title,
      duration: customPlan.duration,
      description: `Plan personnalisé de ${customPlan.duration} jours`,
      dailyChapters: Math.ceil(66 / customPlan.duration),
      testaments: ['Ancien', 'Nouveau'],
      difficulty: 'Personnalisé',
      custom: true
    };

    startPlan(newPlan);
    setShowCustomForm(false);
    setCustomPlan({ title: '', duration: 30, books: [] });
  };

  const getDaysRemaining = () => {
    if (!activePlan) return 0;
    return activePlan.duration - activePlan.currentDay + 1;
  };

  const getProgressPercentage = () => {
    if (!activePlan) return 0;
    return Math.round((activePlan.currentDay / activePlan.duration) * 100);
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto min-h-screen" style={{ background: 'var(--bg-primary)' }}>
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
              Organisez votre parcours de lecture
            </p>
          </div>
        </div>
      </ModernCard>

      {/* Plan actif */}
      {activePlan && (
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] break-words">{activePlan.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] break-words">{activePlan.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {activePlan.paused ? (
                  <ModernButton onClick={resumePlan} size="sm" className="gap-2">
                    <Play className="h-4 w-4" />
                    <span className="hidden sm:inline">Reprendre</span>
                  </ModernButton>
                ) : (
                  <ModernButton onClick={pausePlan} variant="outline" size="sm" className="gap-2">
                    <Pause className="h-4 w-4" />
                    <span className="hidden sm:inline">Pause</span>
                  </ModernButton>
                )}
                <ModernButton onClick={resetPlan} variant="outline" size="sm" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">Reset</span>
                </ModernButton>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm text-[var(--text-secondary)]">Progression</span>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  Jour {activePlan.currentDay} / {activePlan.duration}
                </span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[var(--text-secondary)]">
                <span>{getProgressPercentage()}% terminé</span>
                <span>{getDaysRemaining()} jours restants</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[var(--border-default)]">
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--text-primary)]">{activePlan.currentDay}</div>
                <div className="text-xs text-[var(--text-secondary)]">Jour actuel</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--text-primary)]">{activePlan.dailyChapters}</div>
                <div className="text-xs text-[var(--text-secondary)]">Chapitres/jour</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--text-primary)]">{activePlan.completedDays?.length || 0}</div>
                <div className="text-xs text-[var(--text-secondary)]">Jours terminés</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--text-primary)]">{getDaysRemaining()}</div>
                <div className="text-xs text-[var(--text-secondary)]">Jours restants</div>
              </div>
            </div>
          </div>
        </ModernCard>
      )}

      {/* Plans prédéfinis */}
      {!activePlan && (
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Plans recommandés</h3>
            <p className="text-sm text-[var(--text-secondary)]">Choisissez un plan adapté à vos objectifs</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {predefinedPlans.map((plan) => (
              <ModernCard key={plan.id} className="p-4 bg-[var(--bg-secondary)] border-[var(--border-default)]">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-[var(--text-primary)] break-words">{plan.title}</h4>
                      <p className="text-sm text-[var(--text-secondary)] break-words">{plan.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        plan.difficulty === 'Facile' ? 'bg-green-100 text-green-700' :
                        plan.difficulty === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {plan.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{plan.duration} jours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{plan.dailyChapters}/jour</span>
                    </div>
                  </div>

                  <ModernButton onClick={() => startPlan(plan)} className="w-full gap-2">
                    <Target className="h-4 w-4" />
                    <span>Démarrer le plan</span>
                  </ModernButton>
                </div>
              </ModernCard>
            ))}
          </div>
        </ModernCard>
      )}

      {/* Plan personnalisé */}
      {!activePlan && (
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Créer un plan personnalisé</h3>
            <p className="text-sm text-[var(--text-secondary)]">Adaptez votre plan à vos besoins</p>
          </div>

          {!showCustomForm ? (
            <ModernButton onClick={() => setShowCustomForm(true)} variant="outline" className="w-full sm:w-auto gap-2">
              <Target className="h-4 w-4" />
              <span>Nouveau plan</span>
            </ModernButton>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Titre du plan
                </label>
                <input
                  type="text"
                  value={customPlan.title}
                  onChange={(e) => setCustomPlan({...customPlan, title: e.target.value})}
                  placeholder="Mon plan personnalisé"
                  className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)]"
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
                  className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <ModernButton onClick={createCustomPlan} className="flex-1 gap-2">
                  <Target className="h-4 w-4" />
                  <span>Créer le plan</span>
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
          )}
        </ModernCard>
      )}

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
              Choisissez un plan de lecture adapté à vos objectifs et votre rythme. 
              Chaque plan vous propose un nombre de chapitres à lire quotidiennement. 
              Vous pouvez mettre en pause, reprendre ou réinitialiser votre plan à tout moment. 
              Votre progression est automatiquement sauvegardée et vous pouvez suivre 
              votre avancement en temps réel.
            </p>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default ReadingPlans;
