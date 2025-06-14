
import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Target, Plus, Check, RotateCcw, Trophy, Calendar, Flame, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  type: 'reading' | 'prayer' | 'reflection' | 'community';
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

const DailyChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    target: 7,
    type: 'reading',
    difficulty: 'easy'
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  const challengeTypes = [
    { id: 'reading', label: 'Lecture', icon: '📖' },
    { id: 'prayer', label: 'Prière', icon: '🙏' },
    { id: 'reflection', label: 'Réflexion', icon: '💭' },
    { id: 'community', label: 'Communauté', icon: '👥' }
  ];

  const predefinedChallenges = [
    {
      title: 'Lecture quotidienne',
      description: 'Lire au moins un chapitre par jour',
      target: 7,
      type: 'reading',
      difficulty: 'easy'
    },
    {
      title: 'Moment de prière',
      description: 'Prendre un temps de prière chaque jour',
      target: 7,
      type: 'prayer',
      difficulty: 'easy'
    },
    {
      title: 'Méditation des versets',
      description: 'Méditer sur un verset inspirant',
      target: 5,
      type: 'reflection',
      difficulty: 'medium'
    },
    {
      title: 'Partage communautaire',
      description: 'Partager une intention de prière',
      target: 3,
      type: 'community',
      difficulty: 'medium'
    }
  ];

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = () => {
    const saved = localStorage.getItem('dailyChallenges');
    if (saved) {
      setChallenges(JSON.parse(saved));
    }
  };

  const saveChallenges = (updatedChallenges: Challenge[]) => {
    setChallenges(updatedChallenges);
    localStorage.setItem('dailyChallenges', JSON.stringify(updatedChallenges));
  };

  const createChallenge = (challengeData: any) => {
    const newChal: Challenge = {
      id: Date.now().toString(),
      ...challengeData,
      current: 0,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updated = [...challenges, newChal];
    saveChallenges(updated);
    setShowCreateForm(false);
    setNewChallenge({
      title: '',
      description: '',
      target: 7,
      type: 'reading',
      difficulty: 'easy'
    });
    toast.success('Nouveau défi créé !');
  };

  const incrementProgress = (challengeId: string) => {
    const updated = challenges.map(challenge => {
      if (challenge.id === challengeId && !challenge.completed) {
        const newCurrent = challenge.current + 1;
        const isCompleted = newCurrent >= challenge.target;
        
        if (isCompleted) {
          toast.success(`Défi "${challenge.title}" terminé ! 🎉`);
        }
        
        return {
          ...challenge,
          current: newCurrent,
          completed: isCompleted,
          completedAt: isCompleted ? new Date().toISOString() : undefined
        };
      }
      return challenge;
    });
    
    saveChallenges(updated);
  };

  const resetChallenge = (challengeId: string) => {
    const updated = challenges.map(challenge => {
      if (challenge.id === challengeId) {
        return {
          ...challenge,
          current: 0,
          completed: false,
          completedAt: undefined
        };
      }
      return challenge;
    });
    
    saveChallenges(updated);
    toast.info('Défi réinitialisé');
  };

  const deleteChallenge = (challengeId: string) => {
    const updated = challenges.filter(challenge => challenge.id !== challengeId);
    saveChallenges(updated);
    toast.info('Défi supprimé');
  };

  const getProgressPercentage = (challenge: Challenge) => {
    return Math.min((challenge.current / challenge.target) * 100, 100);
  };

  const getCompletedChallenges = () => {
    return challenges.filter(c => c.completed).length;
  };

  const getActiveStreaks = () => {
    return challenges.filter(c => !c.completed && c.current > 0).length;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    const typeObj = challengeTypes.find(t => t.id === type);
    return typeObj?.icon || '🎯';
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
            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Défis quotidiens</h1>
            <p className="text-sm text-[var(--text-secondary)] break-words">
              Fixez-vous des objectifs et suivez vos progrès
            </p>
          </div>
        </div>
      </ModernCard>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4">
        <ModernCard className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="text-2xl font-bold text-green-600">{getCompletedChallenges()}</div>
          <div className="text-sm text-green-700">Terminés</div>
        </ModernCard>
        <ModernCard className="p-4 text-center bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{challenges.length - getCompletedChallenges()}</div>
          <div className="text-sm text-blue-700">En cours</div>
        </ModernCard>
        <ModernCard className="p-4 text-center bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{getActiveStreaks()}</div>
          <div className="text-sm text-orange-700">Série active</div>
        </ModernCard>
      </div>

      {/* Défis actifs */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Mes défis</h3>
            <p className="text-sm text-[var(--text-secondary)]">{challenges.length} défi(s) créé(s)</p>
          </div>
          <ModernButton 
            onClick={() => setShowCreateForm(!showCreateForm)} 
            className="gap-2 flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau défi</span>
          </ModernButton>
        </div>

        {challenges.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-[var(--text-secondary)] mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Aucun défi créé</h4>
            <p className="text-[var(--text-secondary)] mb-4">Commencez par créer votre premier défi</p>
            <ModernButton onClick={() => setShowCreateForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Créer un défi</span>
            </ModernButton>
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <ModernCard key={challenge.id} className="p-4 bg-[var(--bg-secondary)] border-[var(--border-default)]">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getTypeIcon(challenge.type)}</span>
                        <h4 className="font-semibold text-[var(--text-primary)] break-words">{challenge.title}</h4>
                        {challenge.completed && <Trophy className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] break-words">{challenge.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty === 'easy' ? 'Facile' : 
                         challenge.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="text-sm text-[var(--text-secondary)]">
                        Progression: {challenge.current} / {challenge.target}
                      </span>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {Math.round(getProgressPercentage(challenge))}%
                      </span>
                    </div>
                    <Progress value={getProgressPercentage(challenge)} className="h-2" />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {!challenge.completed && (
                      <ModernButton 
                        onClick={() => incrementProgress(challenge.id)}
                        size="sm"
                        className="gap-2 flex-1"
                      >
                        <Check className="h-4 w-4" />
                        <span>Marquer accompli</span>
                      </ModernButton>
                    )}
                    <ModernButton 
                      onClick={() => resetChallenge(challenge.id)}
                      variant="outline"
                      size="sm"
                      className="gap-2 flex-1"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Réinitialiser</span>
                    </ModernButton>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        )}
      </ModernCard>

      {/* Formulaire de création */}
      {showCreateForm && (
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Créer un nouveau défi</h3>
            
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Titre du défi
                </label>
                <input
                  type="text"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                  placeholder="Ex: Lire un chapitre par jour"
                  className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Description
                </label>
                <textarea
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                  placeholder="Décrivez votre objectif..."
                  className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Objectif (jours)
                  </label>
                  <input
                    type="number"
                    value={newChallenge.target}
                    onChange={(e) => setNewChallenge({...newChallenge, target: parseInt(e.target.value) || 1})}
                    min="1"
                    max="365"
                    className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Type
                  </label>
                  <select
                    value={newChallenge.type}
                    onChange={(e) => setNewChallenge({...newChallenge, type: e.target.value})}
                    className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  >
                    {challengeTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Difficulté
                  </label>
                  <select
                    value={newChallenge.difficulty}
                    onChange={(e) => setNewChallenge({...newChallenge, difficulty: e.target.value})}
                    className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  >
                    <option value="easy">Facile</option>
                    <option value="medium">Moyen</option>
                    <option value="hard">Difficile</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <ModernButton 
                onClick={() => createChallenge(newChallenge)}
                disabled={!newChallenge.title.trim()}
                className="flex-1 gap-2"
              >
                <Target className="h-4 w-4" />
                <span>Créer le défi</span>
              </ModernButton>
              <ModernButton 
                onClick={() => setShowCreateForm(false)}
                variant="outline"
                className="flex-1"
              >
                Annuler
              </ModernButton>
            </div>
          </div>
        </ModernCard>
      )}

      {/* Défis suggérés */}
      {challenges.length === 0 && (
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Défis suggérés</h3>
            <p className="text-sm text-[var(--text-secondary)]">Commencez avec ces défis populaires</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {predefinedChallenges.map((challenge, index) => (
              <ModernCard key={index} className="p-3 bg-[var(--bg-secondary)] border-[var(--border-default)]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span>{getTypeIcon(challenge.type)}</span>
                    <h4 className="font-medium text-[var(--text-primary)] break-words">{challenge.title}</h4>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] break-words">{challenge.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">{challenge.target} jours</span>
                    <ModernButton 
                      onClick={() => createChallenge(challenge)}
                      size="sm"
                      variant="outline"
                      className="gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Ajouter</span>
                    </ModernButton>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
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
              Créez des défis personnalisés pour améliorer votre pratique quotidienne. 
              Définissez un objectif (nombre de jours), choisissez le type et la difficulté. 
              Marquez vos progrès chaque jour et suivez votre évolution. 
              Vous pouvez réinitialiser ou modifier vos défis à tout moment. 
              Les statistiques vous aident à visualiser vos accomplissements.
            </p>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default DailyChallenges;
