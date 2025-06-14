
import React, { useState } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, CheckCircle, Clock, Calendar, Trophy, Info, Edit3, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNeonData } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

const DailyChallenges = () => {
  const { user } = useAuth();
  const { challenges, addChallenge, updateChallenge, deleteChallenge } = useNeonData();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<string | null>(null);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    target_value: 1,
    current_value: 0,
    unit: '',
    due_date: ''
  });
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    target_value: 1,
    current_value: 0,
    unit: '',
    due_date: ''
  });

  const createChallenge = async () => {
    if (!newChallenge.title.trim()) {
      toast.error('Veuillez donner un titre à votre défi');
      return;
    }

    try {
      await addChallenge({
        title: newChallenge.title,
        description: newChallenge.description,
        target_value: newChallenge.target_value,
        current_value: 0,
        unit: newChallenge.unit,
        due_date: newChallenge.due_date || null,
        is_completed: false
      });

      setNewChallenge({
        title: '',
        description: '',
        target_value: 1,
        current_value: 0,
        unit: '',
        due_date: ''
      });
      setShowCreateForm(false);
      toast.success('Défi créé !');
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  const startEdit = (challenge: any) => {
    setEditingChallenge(challenge.id);
    setEditData({
      title: challenge.title,
      description: challenge.description || '',
      target_value: challenge.target_value,
      current_value: challenge.current_value,
      unit: challenge.unit || '',
      due_date: challenge.due_date ? challenge.due_date.split('T')[0] : ''
    });
  };

  const saveEdit = async () => {
    if (!editData.title.trim()) {
      toast.error('Veuillez donner un titre à votre défi');
      return;
    }

    try {
      await updateChallenge(editingChallenge!, {
        title: editData.title,
        description: editData.description,
        target_value: editData.target_value,
        current_value: editData.current_value,
        unit: editData.unit,
        due_date: editData.due_date || null,
        is_completed: editData.current_value >= editData.target_value
      });

      setEditingChallenge(null);
      setEditData({
        title: '',
        description: '',
        target_value: 1,
        current_value: 0,
        unit: '',
        due_date: ''
      });
      toast.success('Défi mis à jour !');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const cancelEdit = () => {
    setEditingChallenge(null);
    setEditData({
      title: '',
      description: '',
      target_value: 1,
      current_value: 0,
      unit: '',
      due_date: ''
    });
  };

  const handleProgress = async (challengeId: string, currentValue: number, targetValue: number) => {
    const newValue = Math.min(currentValue + 1, targetValue);
    const isCompleted = newValue >= targetValue;

    try {
      await updateChallenge(challengeId, {
        current_value: newValue,
        is_completed: isCompleted
      });

      if (isCompleted) {
        toast.success('🎉 Défi terminé ! Félicitations !');
      } else {
        toast.success('Progression mise à jour !');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce défi ?')) {
      try {
        await deleteChallenge(challengeId);
        toast.success('Défi supprimé !');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const activeChallenges = challenges.filter(c => !c.is_completed);
  const completedChallenges = challenges.filter(c => c.is_completed);

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
            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Défis</h1>
            <p className="text-sm text-[var(--text-secondary)] break-words">
              Créez et suivez vos objectifs personnels
            </p>
          </div>
        </div>
      </ModernCard>

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <ModernCard className="p-4 text-center bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{challenges.length}</div>
          <div className="text-sm text-blue-700">Total</div>
        </ModernCard>
        <ModernCard className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="text-2xl font-bold text-green-600">{completedChallenges.length}</div>
          <div className="text-sm text-green-700">Terminés</div>
        </ModernCard>
        <ModernCard className="p-4 text-center bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{activeChallenges.length}</div>
          <div className="text-sm text-orange-700">En cours</div>
        </ModernCard>
      </div>

      {/* Actions principales */}
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
            <span className="whitespace-nowrap">Nouveau défi</span>
          </ModernButton>
        </div>

        {/* Formulaire de création */}
        {showCreateForm && (
          <ModernCard className="mb-6 p-4 bg-[var(--bg-secondary)] border-[var(--border-default)]">
            <div className="space-y-4">
              <h4 className="font-semibold text-[var(--text-primary)]">Nouveau défi</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Titre du défi
                  </label>
                  <input
                    type="text"
                    value={newChallenge.title}
                    onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                    placeholder="Ex: Lire 30 minutes par jour"
                    className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Objectif
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newChallenge.target_value}
                      onChange={(e) => setNewChallenge({...newChallenge, target_value: parseInt(e.target.value) || 1})}
                      min="1"
                      className="flex-1 p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)]"
                    />
                    <input
                      type="text"
                      value={newChallenge.unit}
                      onChange={(e) => setNewChallenge({...newChallenge, unit: e.target.value})}
                      placeholder="jours"
                      className="w-20 p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Description (optionnel)
                </label>
                <textarea
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                  placeholder="Décrivez votre défi..."
                  className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Date limite (optionnel)
                </label>
                <input
                  type="date"
                  value={newChallenge.due_date}
                  onChange={(e) => setNewChallenge({...newChallenge, due_date: e.target.value})}
                  className="w-full sm:w-auto p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <ModernButton 
                  onClick={createChallenge}
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

        {/* Liste des défis */}
        {challenges.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-[var(--text-secondary)] mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Aucun défi</h4>
            <p className="text-[var(--text-secondary)] mb-4">Créez votre premier défi pour commencer</p>
            <ModernButton onClick={() => setShowCreateForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Créer un défi</span>
            </ModernButton>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Défis en cours */}
            {activeChallenges.length > 0 && (
              <>
                <h4 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Défis en cours ({activeChallenges.length})
                </h4>
                {activeChallenges.map((challenge) => (
                  <ModernCard key={challenge.id} className="p-4 bg-[var(--bg-secondary)] border-[var(--border-default)]">
                    {editingChallenge === challenge.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) => setEditData({...editData, title: e.target.value})}
                          className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] font-semibold"
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={editData.current_value}
                            onChange={(e) => setEditData({...editData, current_value: parseInt(e.target.value) || 0})}
                            className="flex-1 p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)]"
                          />
                          <span className="flex items-center px-3">sur</span>
                          <input
                            type="number"
                            value={editData.target_value}
                            onChange={(e) => setEditData({...editData, target_value: parseInt(e.target.value) || 1})}
                            className="flex-1 p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)]"
                          />
                          <input
                            type="text"
                            value={editData.unit}
                            onChange={(e) => setEditData({...editData, unit: e.target.value})}
                            placeholder="unité"
                            className="w-20 p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)]"
                          />
                        </div>
                        <div className="flex gap-2">
                          <ModernButton onClick={saveEdit} size="sm" className="gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>Sauvegarder</span>
                          </ModernButton>
                          <ModernButton onClick={cancelEdit} size="sm" variant="outline" className="gap-2">
                            <X className="h-4 w-4" />
                            <span>Annuler</span>
                          </ModernButton>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-[var(--text-primary)] break-words">{challenge.title}</h4>
                            {challenge.description && (
                              <p className="text-sm text-[var(--text-secondary)] mt-1 break-words">{challenge.description}</p>
                            )}
                          </div>
                          <Badge variant="secondary" className="flex items-center gap-1 flex-shrink-0">
                            <Clock className="h-3 w-3" />
                            En cours
                          </Badge>
                        </div>

                        {/* Progression */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Progression</span>
                            <span className="font-medium text-[var(--text-primary)]">
                              {challenge.current_value}/{challenge.target_value} {challenge.unit}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[var(--accent-primary)] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getProgressPercentage(challenge.current_value, challenge.target_value)}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[var(--border-default)]">
                          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(challenge.created_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                            {challenge.due_date && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>Jusqu'au {new Date(challenge.due_date).toLocaleDateString('fr-FR')}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <ModernButton
                              onClick={() => handleProgress(challenge.id, challenge.current_value, challenge.target_value)}
                              disabled={challenge.current_value >= challenge.target_value}
                              size="sm"
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              <span>+1</span>
                            </ModernButton>
                            <ModernButton
                              onClick={() => startEdit(challenge)}
                              size="sm"
                              variant="outline"
                              className="gap-2"
                            >
                              <Edit3 className="h-4 w-4" />
                              <span className="hidden sm:inline">Modifier</span>
                            </ModernButton>
                            <ModernButton
                              onClick={() => handleDeleteChallenge(challenge.id)}
                              size="sm"
                              variant="ghost"
                              className="gap-2 text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                              <span className="hidden sm:inline">Supprimer</span>
                            </ModernButton>
                          </div>
                        </div>
                      </div>
                    )}
                  </ModernCard>
                ))}
              </>
            )}

            {/* Défis terminés */}
            {completedChallenges.length > 0 && (
              <>
                <h4 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mt-6">
                  <Trophy className="h-4 w-4" />
                  Défis terminés ({completedChallenges.length})
                </h4>
                {completedChallenges.map((challenge) => (
                  <ModernCard key={challenge.id} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-green-800 break-words">{challenge.title}</h4>
                          {challenge.description && (
                            <p className="text-sm text-green-700 mt-1 break-words">{challenge.description}</p>
                          )}
                        </div>
                        <Badge variant="default" className="flex items-center gap-1 flex-shrink-0 bg-green-600">
                          <Trophy className="h-3 w-3" />
                          Terminé
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-700">Objectif atteint</span>
                        <span className="font-medium text-green-800">
                          {challenge.target_value}/{challenge.target_value} {challenge.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-green-700">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Créé le {new Date(challenge.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                  </ModernCard>
                ))}
              </>
            )}
          </div>
        )}
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
              Créez des défis personnalisés pour vous motiver et suivre vos objectifs. 
              Définissez un titre, un objectif chiffré (ex: 30 jours), une unité de mesure et optionnellement une date limite. 
              Suivez votre progression en cliquant sur "+1" à chaque étape accomplie. 
              Vos défis terminés sont conservés comme trophées de vos accomplissements.
            </p>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default DailyChallenges;
