
import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Target, Plus, Clock, Users, Calendar, Trophy, Info } from 'lucide-react';
import { useSupabaseChallenges } from '@/hooks/useSupabaseChallenges';
import { toast } from 'sonner';

const DailyChallenges = () => {
  const { 
    challenges, 
    publicChallenges, 
    loading, 
    createChallenge, 
    markChallengeCompleted, 
    refetch 
  } = useSupabaseChallenges();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_days: 7,
    is_public: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Veuillez donner un titre au défi');
      return;
    }

    try {
      await createChallenge(formData);
      toast.success('Défi créé avec succès !');
      setIsDialogOpen(false);
      setFormData({ title: '', description: '', target_days: 7, is_public: false });
    } catch (error) {
      toast.error('Erreur lors de la création du défi');
    }
  };

  const handleComplete = async (challengeId: string) => {
    try {
      await markChallengeCompleted(challengeId);
      toast.success('Défi marqué comme terminé !');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Chargement des défis...</p>
      </div>
    );
  }

  const activeChallenges = challenges.filter(c => c.is_active);
  const completedChallenges = challenges.filter(c => !c.is_active);

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
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Défis quotidiens</h1>
            <p className="text-sm text-[var(--text-secondary)] break-words">
              Créez et relevez des défis personnels
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <ModernButton className="gap-2 flex-shrink-0">
                <Plus className="h-4 w-4" />
                <span className="whitespace-nowrap">Nouveau défi</span>
              </ModernButton>
            </DialogTrigger>
            <DialogContent className="bg-[var(--bg-card)] max-w-md">
              <DialogHeader>
                <DialogTitle className="text-[var(--text-primary)]">Créer un nouveau défi</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Titre du défi *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Lire 10 minutes par jour..."
                    className="border-[var(--border-default)] bg-[var(--bg-secondary)]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez votre défi..."
                    className="border-[var(--border-default)] bg-[var(--bg-secondary)]"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Durée (jours)
                  </label>
                  <Input
                    type="number"
                    value={formData.target_days}
                    onChange={(e) => setFormData({ ...formData, target_days: parseInt(e.target.value) || 7 })}
                    min="1"
                    max="365"
                    className="border-[var(--border-default)] bg-[var(--bg-secondary)]"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_public"
                    checked={formData.is_public}
                    onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="is_public" className="text-sm text-[var(--text-primary)]">
                    Partager avec la communauté
                  </label>
                </div>
                
                <div className="flex gap-2">
                  <ModernButton type="submit" className="flex-1">
                    Créer le défi
                  </ModernButton>
                  <ModernButton 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Annuler
                  </ModernButton>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </ModernCard>

      {/* Défis actifs */}
      {activeChallenges.length > 0 && (
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Défis actifs</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {activeChallenges.length} défi(s) en cours
            </p>
          </div>

          <div className="space-y-4">
            {activeChallenges.map((challenge) => (
              <ModernCard key={challenge.id} className="p-4 bg-[var(--bg-secondary)] border-[var(--border-default)]">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-[var(--text-primary)]">{challenge.title}</h4>
                      {challenge.description && (
                        <p className="text-sm text-[var(--text-secondary)] mt-1">{challenge.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="default" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {challenge.target_days} jours
                      </Badge>
                      {challenge.is_public && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Public
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--text-secondary)]">
                      Commencé le {new Date(challenge.created_at).toLocaleDateString()}
                    </span>
                    <ModernButton
                      onClick={() => handleComplete(challenge.id)}
                      size="sm"
                      className="gap-2"
                    >
                      <Trophy className="h-4 w-4" />
                      Marquer terminé
                    </ModernButton>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        </ModernCard>
      )}

      {/* Défis de la communauté */}
      {publicChallenges.length > 0 && (
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Défis de la communauté</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Découvrez les défis partagés par d'autres utilisateurs
            </p>
          </div>

          <div className="space-y-4">
            {publicChallenges.slice(0, 5).map((challenge) => (
              <ModernCard key={challenge.id} className="p-4 bg-[var(--bg-secondary)] border-[var(--border-default)]">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">{challenge.title}</h4>
                    {challenge.description && (
                      <p className="text-sm text-[var(--text-secondary)] mt-1">{challenge.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{challenge.target_days} jours</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(challenge.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
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
              Créez des défis personnels pour vous motiver dans votre croissance. 
              Définissez un objectif, une durée, et suivez vos progrès. 
              Vous pouvez garder vos défis privés ou les partager avec la communauté pour inspirer d'autres utilisateurs. 
              Marquez vos défis comme terminés une fois accomplis pour célébrer vos réussites.
            </p>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default DailyChallenges;
