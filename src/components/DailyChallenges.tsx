
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Target, Plus, Calendar, Users, Trophy, CheckCircle, Clock, Share2, Info, Sparkles } from 'lucide-react';
import { useMonthlyChallenges } from '@/hooks/useMonthlyChallenges';
import { useChallenges } from '@/hooks/useChallenges';
import { useCommunityContent } from '@/hooks/useCommunityContent';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseChallengeProgress } from '@/hooks/useSupabaseChallenges';
import { toast } from 'sonner';

const DailyChallenges = () => {
  const { user } = useAuth();
  const { monthlyChallenges, loading: suggestedLoading } = useMonthlyChallenges();
  const { challenges, createChallenge, markChallengeCompleted, loading } = useChallenges();
  const { publishContent } = useCommunityContent();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    targetDays: 30,
    isPublic: false
  });

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChallenge.title.trim()) {
      toast.error('Veuillez donner un titre à votre défi');
      return;
    }

    try {
      const challengeData = {
        title: newChallenge.title,
        description: newChallenge.description,
        target_days: newChallenge.targetDays,
        is_public: newChallenge.isPublic
      };

      await createChallenge(challengeData);

      // Si le défi est public, le publier dans la communauté
      if (newChallenge.isPublic) {
        try {
          await publishContent({
            type: 'challenge' as any,
            title: newChallenge.title,
            content: newChallenge.description,
            is_public: true,
          });
        } catch (error) {
          console.warn('Erreur lors de la publication du défi dans la communauté:', error);
        }
      }

      setNewChallenge({ title: '', description: '', targetDays: 30, isPublic: false });
      setIsDialogOpen(false);
      toast.success('🎯 Défi créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création du défi:', error);
      toast.error('Erreur lors de la création du défi');
    }
  };

  const handleJoinSuggestedChallenge = async (challenge: any) => {
    try {
      const challengeData = {
        title: challenge.title,
        description: challenge.description,
        target_days: challenge.target_days || 30,
        is_public: false
      };

      await createChallenge(challengeData);
      toast.success(`🎯 Vous avez rejoint le défi "${challenge.title}" !`);
    } catch (error) {
      console.error('Erreur lors de la participation au défi:', error);
      toast.error('Erreur lors de la participation au défi');
    }
  };

  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      await markChallengeCompleted(challengeId);
      toast.success('✅ Jour validé ! Continuez votre belle progression !');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la validation');
    }
  };

  const handleShareChallenge = async (challenge: any) => {
    const shareText = `🎯 Je relève le défi "${challenge.title}" sur Compagnon Spirituel ! Rejoignez-moi dans cette aventure spirituelle 🙏`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: challenge.title,
          text: shareText,
        });
        toast.success('Défi partagé avec succès !');
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success('Lien copié dans le presse-papiers !');
      } catch (error) {
        toast.error('Erreur lors du partage');
      }
    }
  };

  // Composant pour afficher un défi avec sa progression
  const ChallengeWithProgress = ({ challenge }: { challenge: any }) => {
    const { progress, getStats } = useSupabaseChallengeProgress(challenge.id);
    const stats = getStats();
    const progressPercentage = Math.round((stats.completedDays / challenge.target_days) * 100);
    const isCompleted = progressPercentage >= 100;

    return (
      <ModernCard key={challenge.id} className="p-3 sm:p-4 bg-[var(--bg-secondary)] border-[var(--border-default)]">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h3 className="font-semibold text-[var(--text-primary)] text-sm sm:text-base break-words">{challenge.title}</h3>
                {isCompleted && (
                  <Badge className="bg-green-100 text-green-700 border-green-200 self-start sm:self-auto">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span className="text-xs">Terminé</span>
                  </Badge>
                )}
              </div>
              {challenge.description && (
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-2 break-words">{challenge.description}</p>
              )}
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span>{stats.completedDays || 0}/{challenge.target_days} jours</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span>{progressPercentage}% terminé</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <ModernButton
                onClick={() => handleShareChallenge(challenge)}
                size="sm"
                variant="ghost"
                className="gap-1 p-2"
              >
                <Share2 className="h-3 w-3" />
                <span className="hidden sm:inline text-xs">Partager</span>
              </ModernButton>
              
              {!isCompleted && (
                <ModernButton
                  onClick={() => handleCompleteChallenge(challenge.id)}
                  size="sm"
                  variant="primary"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-sm text-xs px-2 py-1 sm:px-3 sm:py-2"
                >
                  <span className="whitespace-nowrap">Valider</span>
                </ModernButton>
              )}
            </div>
          </div>
          
          {/* Barre de progression */}
          <div className="space-y-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </ModernCard>
    );
  };

  return (
    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6 max-w-4xl mx-auto min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* En-tête */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent-primary)' }}
            >
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] break-words">Défis spirituels</h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] break-words">Grandissez dans votre foi jour après jour</p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <ModernButton 
                variant="primary" 
                className="gap-2 w-full sm:w-auto flex-shrink-0"
                onClick={() => setNewChallenge({ title: '', description: '', targetDays: 30, isPublic: false })}
              >
                <Plus className="h-4 w-4" />
                <span className="whitespace-nowrap">Créer un défi</span>
              </ModernButton>
            </DialogTrigger>
            
            <DialogContent className="max-w-md mx-3 sm:mx-auto">
              <DialogHeader>
                <DialogTitle>Créer un nouveau défi</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleCreateChallenge} className="space-y-4">
                <div>
                  <Label>Titre du défi *</Label>
                  <Input
                    value={newChallenge.title}
                    onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                    placeholder="Ex: Lire la Bible 15 minutes par jour"
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newChallenge.description}
                    onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                    placeholder="Décrivez votre défi..."
                    rows={3}
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <Label>Durée (jours)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={newChallenge.targetDays}
                    onChange={(e) => setNewChallenge({ ...newChallenge, targetDays: parseInt(e.target.value) || 30 })}
                    className="text-sm"
                  />
                </div>

                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <Switch
                    id="share-challenge"
                    checked={newChallenge.isPublic}
                    onCheckedChange={(checked) => setNewChallenge({ ...newChallenge, isPublic: checked })}
                  />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="share-challenge" className="text-sm font-medium cursor-pointer break-words">
                      Partager avec la communauté
                    </Label>
                    <p className="text-xs text-gray-600 mt-1 break-words">
                      Permettre aux autres de découvrir et rejoindre votre défi
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <ModernButton type="submit" variant="primary" className="flex-1" disabled={loading}>
                    Créer le défi
                  </ModernButton>
                  <ModernButton 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Annuler
                  </ModernButton>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </ModernCard>

      {/* Défis suggérés */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] break-words">Défis suggérés ce mois-ci</h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] break-words">Défis adaptés à la période spirituelle actuelle</p>
          </div>
        </div>

        {suggestedLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 sm:h-32 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {monthlyChallenges.map((challenge, index) => (
              <ModernCard key={index} className="p-3 sm:p-4 bg-[var(--bg-secondary)] border-[var(--border-default)] hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-1 text-sm sm:text-base break-words">{challenge.title}</h3>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed break-words">{challenge.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[var(--border-default)]">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span>{challenge.target_days} jours</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 flex-shrink-0" />
                        <span>Communauté</span>
                      </div>
                    </div>
                    
                    <ModernButton
                      onClick={() => handleJoinSuggestedChallenge(challenge)}
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-sm transition-all duration-200 w-full sm:w-auto text-xs px-3 py-1"
                    >
                      Rejoindre
                    </ModernButton>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        )}
      </ModernCard>

      {/* Mes défis */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] break-words">Mes défis actifs</h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] break-words">Suivez votre progression spirituelle</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 sm:h-24 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <Target className="h-10 w-10 sm:h-12 sm:w-12 text-[var(--text-secondary)] mx-auto mb-4" />
            <h4 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-2">Aucun défi actif</h4>
            <p className="text-[var(--text-secondary)] mb-4 text-sm px-4">Commencez votre parcours spirituel en créant ou rejoignant un défi</p>
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <ChallengeWithProgress key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
      </ModernCard>

      {/* Comment ça marche */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
            <Info className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-2">
              Comment ça marche ?
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              <p className="break-words">
                <strong>Créez vos défis :</strong> Définissez vos objectifs spirituels personnels et partagez-les avec la communauté si vous le souhaitez.
              </p>
              <p className="break-words">
                <strong>Rejoignez les défis suggérés :</strong> Découvrez chaque mois de nouveaux défis adaptés à la période spirituelle actuelle.
              </p>
              <p className="break-words">
                <strong>Validez votre progression :</strong> Chaque jour, validez votre participation pour suivre votre croissance spirituelle.
              </p>
              <p className="break-words">
                <strong>Partagez vos réussites :</strong> Inspirez les autres en partageant vos défis et votre progression.
              </p>
            </div>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default DailyChallenges;
