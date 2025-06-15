
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle, Calendar, Trophy, Info, Plus } from 'lucide-react';
import { useSupabaseChallenges, useSupabaseChallengeProgress } from '@/hooks/useSupabaseChallenges';
import { toast } from 'sonner';

const DailyChallenges = () => {
  const { challenges, publicChallenges, loading, markChallengeCompleted } = useSupabaseChallenges();

  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      await markChallengeCompleted(challengeId);
      toast.success('Défi validé pour aujourd\'hui !');
    } catch (error) {
      toast.error('Erreur lors de la validation');
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
            <Button 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => window.location.href = '/challenges'}
            >
              <Plus className="h-4 w-4" />
              Créer un défi
            </Button>
          </div>
        </CardHeader>
      </Card>

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
              />
            ))}
          </div>
        </div>
      )}

      {/* Explication */}
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
                Créez vos propres défis ou rejoignez ceux de la communauté. 
                Validez vos actions chaque jour pour construire des séries et suivre votre progression. 
                Partagez vos défis avec la communauté pour encourager d'autres personnes dans leur cheminement spirituel.
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
          
          {showCommunityProgress && (
            <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
              <span className="font-medium">Défi public</span> - D'autres personnes suivent aussi ce défi !
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

function PublicChallengeCard({ challenge }: { challenge: any }) {
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
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Durée: {challenge.target_days} jours
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.location.href = '/challenges'}
          >
            Rejoindre
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default DailyChallenges;
