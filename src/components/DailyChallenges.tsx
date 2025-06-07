
import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, BookOpen, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { getDailyChallenge } from '@/data/bibleData';
import { toast } from '@/hooks/use-toast';

interface ChallengeCompletion {
  date: string;
  challenge: string;
  reflection: string;
  completed: boolean;
}

const DailyChallenges = () => {
  const [todayChallenge, setTodayChallenge] = useState('');
  const [reflection, setReflection] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<ChallengeCompletion[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const challenge = getDailyChallenge();
    setTodayChallenge(challenge);

    // Charger les défis complétés
    const saved = localStorage.getItem('completedChallenges');
    if (saved) {
      const completed = JSON.parse(saved);
      setCompletedChallenges(completed);
      
      // Vérifier si le défi d'aujourd'hui est complété
      const todayCompletion = completed.find((c: ChallengeCompletion) => c.date === today);
      if (todayCompletion) {
        setIsCompleted(true);
        setReflection(todayCompletion.reflection);
      }
      
      // Calculer la série
      calculateStreak(completed);
    }
  }, []);

  const calculateStreak = (completed: ChallengeCompletion[]) => {
    const today = new Date();
    let currentStreak = 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateString = checkDate.toDateString();
      
      const hasCompletion = completed.some(c => c.date === dateString && c.completed);
      
      if (hasCompletion) {
        currentStreak++;
      } else if (i === 0) {
        // Si aujourd'hui n'est pas complété, on commence à 0
        break;
      } else {
        // Si un jour dans la série n'est pas complété, on s'arrête
        break;
      }
    }
    
    setStreak(currentStreak);
  };

  const completeChallenge = () => {
    if (!reflection.trim()) {
      toast({
        description: "Veuillez écrire une réflexion avant de valider",
        variant: "destructive",
      });
      return;
    }

    const today = new Date().toDateString();
    const completion: ChallengeCompletion = {
      date: today,
      challenge: todayChallenge,
      reflection: reflection.trim(),
      completed: true
    };

    // Mettre à jour la liste des défis complétés
    const updated = completedChallenges.filter(c => c.date !== today);
    updated.push(completion);
    
    setCompletedChallenges(updated);
    setIsCompleted(true);
    localStorage.setItem('completedChallenges', JSON.stringify(updated));
    
    // Recalculer la série
    calculateStreak(updated);
    
    toast({
      title: "🎯 Défi complété !",
      description: "Votre réflexion a été sauvegardée. Continuez ainsi !",
    });
  };

  const getRecentChallenges = () => {
    const recent = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      
      const completion = completedChallenges.find(c => c.date === dateString);
      recent.push({
        date: dateString,
        displayDate: date.toLocaleDateString('fr-FR'),
        completion
      });
    }
    
    return recent;
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="text-spiritual-600" size={24} />
            Défis spirituels quotidiens
            {streak > 0 && (
              <span className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                🔥 {streak} jour(s)
              </span>
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Défi du jour */}
      <Card className="glass border-white/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-spiritual-500/10 to-heavenly-500/10"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-spiritual-100 flex items-center justify-center">
              <BookOpen className="text-spiritual-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-spiritual-700">
                Défi du jour
              </h3>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <div className="bg-white/50 rounded-lg p-4 mb-4">
            <p className="text-lg text-gray-700 leading-relaxed">
              {todayChallenge}
            </p>
          </div>

          {!isCompleted ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre réflexion :
                </label>
                <Textarea
                  placeholder="Partagez vos pensées, ce que vous avez appris, ou comment ce défi vous a touché..."
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="glass border-white/30 min-h-[120px]"
                />
              </div>
              
              <Button
                onClick={completeChallenge}
                className="w-full spiritual-gradient"
                disabled={!reflection.trim()}
              >
                <CheckCircle size={18} className="mr-2" />
                Valider le défi
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="font-medium text-green-800">Défi complété !</span>
                </div>
                <p className="text-green-700">
                  Votre réflexion : "{reflection}"
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass border-white/30">
          <CardContent className="p-4 text-center">
            <Target className="mx-auto mb-2 text-spiritual-600" size={24} />
            <div className="text-lg font-bold text-spiritual-700">{completedChallenges.length}</div>
            <div className="text-sm text-gray-600">Défis complétés</div>
          </CardContent>
        </Card>

        <Card className="glass border-white/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">🔥</div>
            <div className="text-lg font-bold text-spiritual-700">{streak}</div>
            <div className="text-sm text-gray-600">Jours consécutifs</div>
          </CardContent>
        </Card>

        <Card className="glass border-white/30">
          <CardContent className="p-4 text-center">
            <PenTool className="mx-auto mb-2 text-purple-600" size={24} />
            <div className="text-lg font-bold text-spiritual-700">
              {completedChallenges.filter(c => c.reflection.length > 50).length}
            </div>
            <div className="text-sm text-gray-600">Réflexions riches</div>
          </CardContent>
        </Card>

        <Card className="glass border-white/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">⭐</div>
            <div className="text-lg font-bold text-spiritual-700">
              {Math.floor(completedChallenges.length / 7)}
            </div>
            <div className="text-sm text-gray-600">Semaines actives</div>
          </CardContent>
        </Card>
      </div>

      {/* Historique récent */}
      {completedChallenges.length > 0 && (
        <Card className="glass border-white/30">
          <CardHeader>
            <CardTitle className="text-lg">Historique récent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {getRecentChallenges().map((item, index) => (
              <div
                key={item.date}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  item.completion
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.completion
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {item.completion ? (
                      <CheckCircle size={16} />
                    ) : (
                      <span className="text-xs">✕</span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{item.displayDate}</div>
                    {item.completion && (
                      <div className="text-sm text-gray-600 max-w-md truncate">
                        "{item.completion.reflection}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DailyChallenges;
