
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Target, Users, Lock, CheckCircle, Flame, Info, Calendar, Trophy, TrendingUp } from 'lucide-react';
import { useSupabaseChallenges, useSupabaseChallengeProgress } from '@/hooks/useSupabaseChallenges';
import { toast } from 'sonner';

export function EnhancedChallengesSection() {
  const { challenges, publicChallenges, loading, createChallenge, markChallengeCompleted, refetch } = useSupabaseChallenges();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    is_public: false,
    target_days: 30
  });

  const handleCreateChallenge = async () => {
    try {
      if (!newChallenge.title.trim()) {
        toast.error('Le titre du défi est requis');
        return;
      }

      await createChallenge(newChallenge);
      setIsCreateOpen(false);
      setNewChallenge({ title: '', description: '', is_public: false, target_days: 30 });
      toast.success('Défi créé avec succès !');
      refetch();
    } catch (error) {
      toast.error('Erreur lors de la création du défi');
    }
  };

  const handleMarkCompleted = async (challengeId: string) => {
    try {
      await markChallengeCompleted(challengeId);
      toast.success('Défi validé pour aujourd\'hui !');
      refetch();
    } catch (error) {
      toast.error('Erreur lors de la validation');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="animate-pulse bg-[var(--bg-secondary)] h-32 rounded-lg"></div>
        <div className="animate-pulse bg-[var(--bg-secondary)] h-32 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* En-tête avec bouton de création */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-[var(--text-primary)]">
            <Target className="h-6 w-6" />
            Défis spirituels
          </h2>
          <p className="text-[var(--text-secondary)]">Créez et suivez vos objectifs spirituels</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <ModernButton>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau défi
            </ModernButton>
          </DialogTrigger>
          <DialogContent className="bg-[var(--bg-card)] border-[var(--border-default)]">
            <DialogHeader>
              <DialogTitle className="text-[var(--text-primary)]">Créer un nouveau défi</DialogTitle>
              <DialogDescription className="text-[var(--text-secondary)]">
                Définissez un objectif spirituel personnel à atteindre
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-[var(--text-primary)]">Titre du défi</Label>
                <Input
                  id="title"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="ex: Prier chaque matin pendant 21 jours"
                  className="bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-[var(--text-primary)]">Description (optionnel)</Label>
                <Textarea
                  id="description"
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez votre défi en détail..."
                  className="bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <Label htmlFor="target_days" className="text-[var(--text-primary)]">Durée (jours)</Label>
                <Input
                  id="target_days"
                  type="number"
                  value={newChallenge.target_days}
                  onChange={(e) => setNewChallenge(prev => ({ ...prev, target_days: parseInt(e.target.value) || 30 }))}
                  min="1"
                  max="365"
                  className="bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-primary)]"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_public"
                  checked={newChallenge.is_public}
                  onCheckedChange={(checked) => setNewChallenge(prev => ({ ...prev, is_public: checked }))}
                />
                <Label htmlFor="is_public" className="flex items-center gap-2 text-[var(--text-primary)]">
                  {newChallenge.is_public ? <Users className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  {newChallenge.is_public ? 'Partager avec la communauté' : 'Garder privé'}
                </Label>
              </div>
              <div className="flex gap-2 pt-4">
                <ModernButton onClick={handleCreateChallenge} className="flex-1">
                  Créer le défi
                </ModernButton>
                <ModernButton variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Annuler
                </ModernButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mes défis */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Mes défis</h3>
        {challenges.length === 0 ? (
          <ModernCard>
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto text-[var(--text-secondary)] mb-4" />
              <p className="text-[var(--text-secondary)]">Aucun défi en cours</p>
              <p className="text-sm text-[var(--text-secondary)]">Créez votre premier défi spirituel !</p>
            </div>
          </ModernCard>
        ) : (
          challenges.map((challenge) => (
            <ChallengeCard 
              key={challenge.id} 
              challenge={challenge} 
              onMarkCompleted={handleMarkCompleted}
            />
          ))
        )}
      </div>

      {/* Défis de la communauté */}
      {publicChallenges.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-[var(--text-primary)]">
            <Users className="h-5 w-5" />
            Défis de la communauté
          </h3>
          <div className="grid gap-4">
            {publicChallenges.slice(0, 6).map((challenge) => (
              <CommunityChallenge key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}

      {/* Explication */}
      <ModernCard className="border-[var(--accent-primary)]/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Comment ça marche ?
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Créez des défis spirituels personnels (exemple : "Prier chaque matin pendant 30 jours"). 
              Choisissez de les garder privés ou de les partager avec la communauté pour encourager d'autres personnes. 
              Validez chaque jour votre progression pour maintenir votre motivation et voir votre croissance spirituelle.
              Suivez la progression globale des défis communautaires pour vous inspirer mutuellement.
            </p>
          </div>
        </div>
      </ModernCard>
    </div>
  );
}

function ChallengeCard({ challenge, onMarkCompleted }: { 
  challenge: any; 
  onMarkCompleted: (id: string) => void;
}) {
  const { progress, getStats } = useSupabaseChallengeProgress(challenge.id);
  const stats = getStats();
  const progressPercentage = Math.round((stats.completedDays / challenge.target_days) * 100);
  const today = new Date().toISOString().split('T')[0];
  const completedToday = progress.some(p => p.completed_date === today);

  return (
    <ModernCard>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold flex items-center gap-2 text-[var(--text-primary)]">
          {challenge.title}
          {challenge.is_public ? <Users className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
        </h4>
        <div className="flex items-center gap-2">
          {stats.currentStreak > 0 && (
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              <Flame className="h-3 w-3 mr-1" />
              {stats.currentStreak}
            </Badge>
          )}
          <Badge variant="secondary" className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
            {progressPercentage}%
          </Badge>
        </div>
      </div>
      {challenge.description && (
        <p className="text-sm text-[var(--text-secondary)] mb-4">{challenge.description}</p>
      )}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2 text-[var(--text-secondary)]">
            <span>Progression: {stats.completedDays}/{challenge.target_days} jours</span>
            <span>Série actuelle: {stats.currentStreak}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        {challenge.is_public && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-700 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Progression communautaire</span>
            </div>
            <p className="text-xs text-blue-600">
              D'autres personnes suivent ce défi ! Votre progression inspire la communauté.
            </p>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            Record: {stats.longestStreak} jours consécutifs
          </div>
          <ModernButton
            size="sm"
            onClick={() => onMarkCompleted(challenge.id)}
            disabled={completedToday}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {completedToday ? 'Terminé aujourd\'hui' : 'Valider aujourd\'hui'}
          </ModernButton>
        </div>
      </div>
    </ModernCard>
  );
}

function CommunityChallenge({ challenge }: { challenge: any }) {
  return (
    <ModernCard className="border-[var(--accent-primary)]/20">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-[var(--text-primary)]">{challenge.title}</h4>
        <Badge variant="secondary" className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
          <Users className="h-3 w-3 mr-1" />
          Public
        </Badge>
      </div>
      {challenge.description && (
        <p className="text-sm text-[var(--text-secondary)] mb-3">{challenge.description}</p>
      )}
      <div className="flex justify-between items-center">
        <div className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Durée: {challenge.target_days} jours
        </div>
        <ModernButton size="sm" variant="outline">
          Rejoindre ce défi
        </ModernButton>
      </div>
    </ModernCard>
  );
}
