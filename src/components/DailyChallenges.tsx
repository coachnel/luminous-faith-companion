
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Target, CheckCircle, Calendar, Trophy, Info, Plus, Users, Lock } from 'lucide-react';
import { useSupabaseChallenges, useSupabaseChallengeProgress } from '@/hooks/useSupabaseChallenges';
import { toast } from 'sonner';

const DailyChallenges = () => {
  const { challenges, publicChallenges, loading, createChallenge, markChallengeCompleted, refetch } = useSupabaseChallenges();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    is_public: false,
    target_days: 30
  });

  // Défis automatiques proposés par défaut
  const suggestedChallenges = [
    {
      id: 'auto-1',
      title: 'Prier chaque matin pendant 21 jours',
      description: 'Commencez votre journée par une prière de 10 minutes',
      target_days: 21,
      is_public: true,
      category: 'Prière'
    },
    {
      id: 'auto-2',
      title: 'Lire un chapitre de la Bible quotidiennement',
      description: 'Découvrez la Parole de Dieu chaque jour pendant un mois',
      target_days: 30,
      is_public: true,
      category: 'Lecture'
    },
    {
      id: 'auto-3',
      title: 'Méditer 15 minutes par jour',
      description: 'Prenez du temps pour la méditation spirituelle',
      target_days: 14,
      is_public: true,
      category: 'Méditation'
    }
  ];

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

  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      await markChallengeCompleted(challengeId);
      toast.success('Défi validé pour aujourd\'hui !');
      refetch();
    } catch (error) {
      toast.error('Erreur lors de la validation');
    }
  };

  const handleJoinSuggestedChallenge = async (suggestedChallenge: any) => {
    try {
      await createChallenge({
        title: suggestedChallenge.title,
        description: suggestedChallenge.description,
        target_days: suggestedChallenge.target_days,
        is_public: true
      });
      toast.success('Vous avez rejoint le défi !');
      refetch();
    } catch (error) {
      toast.error('Erreur lors de l\'inscription au défi');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-3 sm:p-4 max-w-4xl mx-auto">
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 max-w-4xl mx-auto">
      {/* En-tête */}
      <Card className="glass border-white/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">Défis quotidiens</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Maintenez votre discipline spirituelle</p>
              </div>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Créer un défi
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-gray-200">
                <DialogHeader>
                  <DialogTitle className="text-gray-800">Créer un nouveau défi</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Définissez un objectif spirituel personnel à atteindre
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-gray-800">Titre du défi</Label>
                    <Input
                      id="title"
                      value={newChallenge.title}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="ex: Prier chaque matin pendant 21 jours"
                      className="bg-white border-gray-300 text-gray-800"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-gray-800">Description (optionnel)</Label>
                    <Textarea
                      id="description"
                      value={newChallenge.description}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez votre défi en détail..."
                      className="bg-white border-gray-300 text-gray-800"
                    />
                  </div>
                  <div>
                    <Label htmlFor="target_days" className="text-gray-800">Durée (jours)</Label>
                    <Input
                      id="target_days"
                      type="number"
                      value={newChallenge.target_days}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, target_days: parseInt(e.target.value) || 30 }))}
                      min="1"
                      max="365"
                      className="bg-white border-gray-300 text-gray-800"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_public"
                      checked={newChallenge.is_public}
                      onCheckedChange={(checked) => setNewChallenge(prev => ({ ...prev, is_public: checked }))}
                    />
                    <Label htmlFor="is_public" className="flex items-center gap-2 text-gray-800">
                      {newChallenge.is_public ? <Users className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      {newChallenge.is_public ? 'Partager avec la communauté' : 'Garder privé'}
                    </Label>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateChallenge} className="flex-1">
                      Créer le défi
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Défis suggérés automatiquement */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Défis suggérés</h2>
        <div className="grid gap-4">
          {suggestedChallenges.map((challenge) => (
            <Card key={challenge.id} className="glass border-blue-200/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    {challenge.title}
                  </CardTitle>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    {challenge.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {challenge.description && (
                  <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Durée: {challenge.target_days} jours
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleJoinSuggestedChallenge(challenge)}
                  >
                    Rejoindre ce défi
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Défis personnels actifs */}
      {challenges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Mes défis</h2>
          <div className="grid gap-4">
            {challenges.slice(0, 3).map((challenge) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                onMarkCompleted={handleCompleteChallenge}
                showCommunityProgress={challenge.is_public}
              />
            ))}
          </div>
        </div>
      )}

      {/* Défis de la communauté */}
      {publicChallenges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Défis de la communauté</h2>
          <div className="grid gap-4">
            {publicChallenges.slice(0, 3).map((challenge) => (
              <PublicChallengeCard 
                key={challenge.id} 
                challenge={challenge}
                onJoin={() => handleJoinSuggestedChallenge({
                  title: challenge.title,
                  description: challenge.description,
                  target_days: challenge.target_days
                })}
              />
            ))}
          </div>
        </div>
      )}

      {/* Explication - maintenant en bas */}
      <Card className="glass border-[var(--accent-primary)]/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
              <Info className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Comment ça marche ?
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Relevez des défis spirituels quotidiens pour maintenir votre croissance personnelle. 
                Choisissez parmi nos défis suggérés ou créez vos propres défis personnalisés. 
                Validez vos actions chaque jour pour construire des séries et suivre votre progression. 
                Partagez vos défis avec la communauté pour encourager d'autres personnes dans leur cheminement spirituel et voir la progression globale.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function ChallengeCard({ challenge, onMarkCompleted, showCommunityProgress }: { 
  challenge: any; 
  onMarkCompleted: (id: string) => void;
  showCommunityProgress: boolean;
}) {
  const { progress, getStats } = useSupabaseChallengeProgress(challenge.id);
  const stats = getStats();
  const progressPercentage = Math.round((stats.completedDays / challenge.target_days) * 100);
  const today = new Date().toISOString().split('T')[0];
  const completedToday = progress.some(p => p.completed_date === today);

  // Simulation de la progression communautaire si c'est un défi public
  const communityProgress = showCommunityProgress ? {
    totalParticipants: Math.floor(Math.random() * 50) + 10,
    averageProgress: Math.floor(Math.random() * 80) + 20
  } : null;

  return (
    <Card className="glass border-white/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-orange-500" />
            {challenge.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {stats.currentStreak > 0 && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                <Trophy className="h-3 w-3 mr-1" />
                {stats.currentStreak}
              </Badge>
            )}
            <Badge variant={completedToday ? "default" : "secondary"}>
              {progressPercentage}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {challenge.description && (
          <p className="text-sm text-gray-600 mb-4">{challenge.description}</p>
        )}
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progression: {stats.completedDays}/{challenge.target_days} jours</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Série: {stats.currentStreak} jours
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          {showCommunityProgress && communityProgress && (
            <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
              <span className="font-medium">Défi communautaire</span> - {communityProgress.totalParticipants} participants, 
              progression moyenne: {communityProgress.averageProgress}%
            </div>
          )}
          
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => onMarkCompleted(challenge.id)}
              disabled={completedToday}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {completedToday ? "Terminé aujourd'hui" : "Valider"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PublicChallengeCard({ challenge, onJoin }: { challenge: any; onJoin: () => void }) {
  // Simulation de statistiques communautaires
  const communityStats = {
    totalParticipants: Math.floor(Math.random() * 100) + 20,
    averageProgress: Math.floor(Math.random() * 70) + 30,
    completionRate: Math.floor(Math.random() * 40) + 60
  };

  return (
    <Card className="glass border-blue-200/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            {challenge.title}
          </CardTitle>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Communauté
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {challenge.description && (
          <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
        )}
        
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-xs text-blue-700 mb-1">
              <span className="font-medium">Progression communautaire</span>
            </div>
            <div className="text-xs text-blue-600 space-y-1">
              <div>👥 {communityStats.totalParticipants} participants</div>
              <div>📊 Progression moyenne: {communityStats.averageProgress}%</div>
              <div>✅ Taux de réussite: {communityStats.completionRate}%</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Durée: {challenge.target_days} jours
            </div>
            <Button 
              size="sm" 
              onClick={onJoin}
            >
              Rejoindre
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DailyChallenges;
