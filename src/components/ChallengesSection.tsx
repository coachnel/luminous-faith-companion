
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Target, Users, Lock, CheckCircle, Flame } from 'lucide-react';
import { useChallenges, useChallengeProgress } from '@/hooks/useChallenges';
import { toast } from 'sonner';

export function ChallengesSection() {
  const { challenges, publicChallenges, loading, createChallenge, markChallengeCompleted } = useChallenges();
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
    } catch (error) {
      toast.error('Erreur lors de la création du défi');
    }
  };

  const handleMarkCompleted = async (challengeId: string) => {
    try {
      await markChallengeCompleted(challengeId);
      toast.success('Défi validé pour aujourd\'hui !');
    } catch (error) {
      toast.error('Erreur lors de la validation');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton de création */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6" />
            Défis personnels
          </h2>
          <p className="text-gray-600">Créez et suivez vos objectifs personnels</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau défi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau défi</DialogTitle>
              <DialogDescription>
                Définissez un objectif personnel à atteindre
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre du défi</Label>
                <Input
                  id="title"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="ex: Prier chaque matin"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (optionnel)</Label>
                <Textarea
                  id="description"
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez votre défi en détail..."
                />
              </div>
              <div>
                <Label htmlFor="target_days">Durée (jours)</Label>
                <Input
                  id="target_days"
                  type="number"
                  value={newChallenge.target_days}
                  onChange={(e) => setNewChallenge(prev => ({ ...prev, target_days: parseInt(e.target.value) || 30 }))}
                  min="1"
                  max="365"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_public"
                  checked={newChallenge.is_public}
                  onCheckedChange={(checked) => setNewChallenge(prev => ({ ...prev, is_public: checked }))}
                />
                <Label htmlFor="is_public" className="flex items-center gap-2">
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

      {/* Mes défis */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mes défis</h3>
        {challenges.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Aucun défi en cours</p>
              <p className="text-sm text-gray-500">Créez votre premier défi personnel !</p>
            </CardContent>
          </Card>
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
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Défis de la communauté
          </h3>
          <div className="grid gap-4">
            {publicChallenges.slice(0, 6).map((challenge) => (
              <Card key={challenge.id} className="border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{challenge.title}</CardTitle>
                    <Badge variant="secondary">
                      <Users className="h-3 w-3 mr-1" />
                      Public
                    </Badge>
                  </div>
                  {challenge.description && (
                    <CardDescription>{challenge.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-gray-600">
                    Durée: {challenge.target_days} jours
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ChallengeCard({ challenge, onMarkCompleted }: { 
  challenge: any; 
  onMarkCompleted: (id: string) => void;
}) {
  const { progress, getStats } = useChallengeProgress(challenge.id);
  const stats = getStats();
  const progressPercentage = Math.round((stats.completedDays / challenge.target_days) * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {challenge.title}
            {challenge.is_public ? <Users className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          </CardTitle>
          <div className="flex items-center gap-2">
            {stats.currentStreak > 0 && (
              <Badge variant="outline" className="text-orange-600">
                <Flame className="h-3 w-3 mr-1" />
                {stats.currentStreak}
              </Badge>
            )}
            <Badge variant="secondary">{progressPercentage}%</Badge>
          </div>
        </div>
        {challenge.description && (
          <CardDescription>{challenge.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progression: {stats.completedDays}/{challenge.target_days} jours</span>
              <span>Série actuelle: {stats.currentStreak}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Record: {stats.longestStreak} jours consécutifs
            </div>
            <Button
              size="sm"
              onClick={() => onMarkCompleted(challenge.id)}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Valider aujourd'hui
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
