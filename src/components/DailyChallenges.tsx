
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Target, Plus, Edit, Trash, Calendar, Clock, CheckCircle, Users, Globe, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  targetDays: number;
  isPublic: boolean;
  createdAt: string;
  completedDays: string[];
  isActive: boolean;
}

const DailyChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDays: 7,
    isPublic: false
  });

  useEffect(() => {
    const savedChallenges = localStorage.getItem('dailyChallenges');
    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges));
    }
  }, []);

  const saveChallenges = (challengesToSave: Challenge[]) => {
    setChallenges(challengesToSave);
    localStorage.setItem('dailyChallenges', JSON.stringify(challengesToSave));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        description: "Veuillez donner un titre à votre défi",
        variant: "destructive",
      });
      return;
    }

    if (editingChallenge) {
      const updatedChallenges = challenges.map(challenge =>
        challenge.id === editingChallenge.id
          ? {
              ...challenge,
              title: formData.title,
              description: formData.description,
              targetDays: formData.targetDays,
              isPublic: formData.isPublic
            }
          : challenge
      );
      saveChallenges(updatedChallenges);
      toast({
        title: "Défi modifié",
        description: "Votre défi a été mis à jour avec succès",
      });
    } else {
      const newChallenge: Challenge = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        targetDays: formData.targetDays,
        isPublic: formData.isPublic,
        createdAt: new Date().toISOString(),
        completedDays: [],
        isActive: true
      };
      
      saveChallenges([newChallenge, ...challenges]);
      toast({
        title: "🎯 Défi créé",
        description: `Votre défi a été créé${formData.isPublic ? ' et partagé avec la communauté' : ''}`,
      });
    }

    setFormData({ title: '', description: '', targetDays: 7, isPublic: false });
    setEditingChallenge(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setFormData({
      title: challenge.title,
      description: challenge.description,
      targetDays: challenge.targetDays,
      isPublic: challenge.isPublic
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (challengeId: string) => {
    const updatedChallenges = challenges.filter(challenge => challenge.id !== challengeId);
    saveChallenges(updatedChallenges);
    toast({
      description: "Défi supprimé",
    });
  };

  const markDayCompleted = (challengeId: string) => {
    const today = new Date().toDateString();
    const updatedChallenges = challenges.map(challenge => {
      if (challenge.id === challengeId) {
        if (challenge.completedDays.includes(today)) {
          return {
            ...challenge,
            completedDays: challenge.completedDays.filter(day => day !== today)
          };
        } else {
          return {
            ...challenge,
            completedDays: [...challenge.completedDays, today]
          };
        }
      }
      return challenge;
    });
    saveChallenges(updatedChallenges);
    
    const challenge = challenges.find(c => c.id === challengeId);
    const isCompleting = !challenge?.completedDays.includes(today);
    
    toast({
      title: isCompleting ? "🎉 Jour validé !" : "Validation annulée",
      description: isCompleting 
        ? "Félicitations pour votre persévérance !" 
        : "La validation du jour a été annulée",
    });
  };

  const activeChallenges = challenges.filter(c => c.isActive);
  const completedChallenges = challenges.filter(c => !c.isActive);

  const getChallengeProgress = (challenge: Challenge) => {
    const progress = (challenge.completedDays.length / challenge.targetDays) * 100;
    return Math.min(progress, 100);
  };

  const isTodayCompleted = (challenge: Challenge) => {
    const today = new Date().toDateString();
    return challenge.completedDays.includes(today);
  };

  return (
    <div className="p-3 sm:p-4 max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* En-tête mobile optimisé */}
      <Card className="glass border-white/30">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">Défis quotidiens</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Créez et relevez vos défis personnels</p>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    setEditingChallenge(null);
                    setFormData({ title: '', description: '', targetDays: 7, isPublic: false });
                  }}
                  className="w-full sm:w-auto"
                >
                  <Plus size={16} className="mr-2" />
                  <span className="sm:hidden">Nouveau défi</span>
                  <span className="hidden sm:inline">Créer un défi</span>
                </Button>
              </DialogTrigger>
              
              <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-base sm:text-lg">
                    {editingChallenge ? 'Modifier le défi' : 'Créer un nouveau défi'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Titre du défi *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ex: Prier 10 minutes par jour"
                      className="border-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Décrivez votre défi..."
                      className="border-gray-300 min-h-[100px]"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Durée (jours)</label>
                    <Input
                      type="number"
                      value={formData.targetDays}
                      onChange={(e) => setFormData({ ...formData, targetDays: parseInt(e.target.value) || 7 })}
                      min="1"
                      max="365"
                      className="border-gray-300"
                    />
                  </div>

                  <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                    <Switch
                      id="share-challenge"
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                    />
                    <div className="flex-1">
                      <Label htmlFor="share-challenge" className="text-sm font-medium cursor-pointer">
                        Partager avec la communauté
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        Inspirer d'autres personnes avec votre défi
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="submit" className="flex-1">
                      {editingChallenge ? 'Modifier' : 'Créer'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Défis actifs */}
      {activeChallenges.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 px-1">Défis en cours</h2>
          {activeChallenges.map((challenge) => {
            const progress = getChallengeProgress(challenge);
            const todayCompleted = isTodayCompleted(challenge);
            
            return (
              <Card key={challenge.id} className="glass border-white/30 hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-3">
                    {/* En-tête du défi */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-1">
                            {challenge.title}
                          </h3>
                          {challenge.isPublic ? (
                            <Globe className="h-4 w-4 text-blue-500 flex-shrink-0" title="Public" />
                          ) : (
                            <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" title="Privé" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(challenge.createdAt).toLocaleDateString('fr-FR')}</span>
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          <span>{challenge.targetDays} jours</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(challenge)}>
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(challenge.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Description */}
                    {challenge.description && (
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 break-words">
                        {challenge.description}
                      </p>
                    )}
                    
                    {/* Progression */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Progression</span>
                        <span className="font-medium text-gray-800">
                          {challenge.completedDays.length}/{challenge.targetDays} jours
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        {Math.round(progress)}% terminé
                      </div>
                    </div>
                    
                    {/* Bouton d'action */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        {progress >= 100 ? 'Défi terminé !' : `${challenge.targetDays - challenge.completedDays.length} jours restants`}
                      </div>
                      <Button
                        onClick={() => markDayCompleted(challenge.id)}
                        variant={todayCompleted ? "default" : "outline"}
                        size="sm"
                        className={`gap-2 ${todayCompleted ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        disabled={progress >= 100}
                      >
                        <CheckCircle size={14} />
                        <span className="text-xs">
                          {todayCompleted ? 'Fait !' : "Aujourd'hui"}
                        </span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Message si aucun défi actif */}
      {activeChallenges.length === 0 && (
        <Card className="glass border-white/30">
          <CardContent className="p-6 sm:p-8 text-center">
            <Target className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 mb-2">Aucun défi actif</p>
            <p className="text-sm text-gray-500">
              Créez votre premier défi pour commencer votre parcours spirituel
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DailyChallenges;
