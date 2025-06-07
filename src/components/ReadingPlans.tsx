
import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, CheckCircle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { readingPlans } from '@/data/bibleData';
import { toast } from '@/hooks/use-toast';

interface UserProgress {
  planId: string;
  currentDay: number;
  completedDays: number[];
  startDate: string;
}

const ReadingPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    const savedProgress = localStorage.getItem('readingPlanProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  const startPlan = (planId: string) => {
    const newProgress: UserProgress = {
      planId,
      currentDay: 1,
      completedDays: [],
      startDate: new Date().toISOString()
    };
    
    setUserProgress(newProgress);
    setSelectedPlan(planId);
    localStorage.setItem('readingPlanProgress', JSON.stringify(newProgress));
    
    toast({
      title: "📖 Plan de lecture démarré",
      description: "Votre parcours spirituel commence aujourd'hui !",
    });
  };

  const markDayComplete = (day: number) => {
    if (!userProgress) return;
    
    const updatedProgress = {
      ...userProgress,
      completedDays: [...userProgress.completedDays, day].sort((a, b) => a - b),
      currentDay: Math.max(userProgress.currentDay, day + 1)
    };
    
    setUserProgress(updatedProgress);
    localStorage.setItem('readingPlanProgress', JSON.stringify(updatedProgress));
    
    toast({
      title: "✅ Lecture terminée",
      description: `Jour ${day} complété avec succès !`,
    });
  };

  const resetPlan = () => {
    setUserProgress(null);
    setSelectedPlan('');
    localStorage.removeItem('readingPlanProgress');
    
    toast({
      description: "Plan de lecture réinitialisé",
    });
  };

  const getCurrentPlan = () => {
    if (!userProgress) return null;
    return readingPlans.find(plan => plan.id === userProgress.planId);
  };

  const getProgressPercentage = () => {
    if (!userProgress) return 0;
    const plan = getCurrentPlan();
    if (!plan) return 0;
    return (userProgress.completedDays.length / plan.duration) * 100;
  };

  const currentPlan = getCurrentPlan();

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="text-spiritual-600" size={24} />
            Plans de lecture biblique
          </CardTitle>
        </CardHeader>
      </Card>

      {!userProgress ? (
        // Sélection d'un plan
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center mb-4">Choisissez votre plan de lecture</h3>
          
          {readingPlans.map((plan) => (
            <Card key={plan.id} className="glass border-white/30 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-spiritual-700 mb-2">
                      {plan.name}
                    </h4>
                    <p className="text-gray-600 mb-3">{plan.description}</p>
                    <div className="flex items-center gap-2 text-sm text-spiritual-600">
                      <Target size={16} />
                      <span>{plan.duration} jours</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => startPlan(plan.id)}
                    className="spiritual-gradient ml-4"
                  >
                    Commencer
                  </Button>
                </div>
                
                {/* Aperçu des premiers jours */}
                <div className="border-t pt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Aperçu des premiers jours :</h5>
                  <div className="space-y-2">
                    {plan.schedule.slice(0, 3).map((scheduleItem) => (
                      <div key={scheduleItem.day} className="text-sm text-gray-600">
                        <span className="font-medium">Jour {scheduleItem.day}:</span> {scheduleItem.books.join(', ')}
                        {scheduleItem.chapters && ` (chapitres ${scheduleItem.chapters.join(', ')})`}
                      </div>
                    ))}
                    {plan.schedule.length > 3 && (
                      <div className="text-sm text-gray-500 italic">
                        ... et {plan.schedule.length - 3} autres jours
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Plan en cours
        <div className="space-y-4">
          {currentPlan && (
            <>
              {/* Progression actuelle */}
              <Card className="glass border-white/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-spiritual-700">
                      {currentPlan.name}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetPlan}
                      className="text-red-600 hover:text-red-700"
                    >
                      Réinitialiser
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progression</span>
                        <span>{userProgress.completedDays.length} / {currentPlan.duration} jours</span>
                      </div>
                      <Progress value={getProgressPercentage()} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-spiritual-600">
                          {userProgress.completedDays.length}
                        </div>
                        <div className="text-sm text-gray-600">Jours complétés</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-spiritual-600">
                          {userProgress.currentDay}
                        </div>
                        <div className="text-sm text-gray-600">Jour actuel</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-spiritual-600">
                          {Math.round(getProgressPercentage())}%
                        </div>
                        <div className="text-sm text-gray-600">Terminé</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Planning de lecture */}
              <Card className="glass border-white/30">
                <CardHeader>
                  <CardTitle className="text-lg">Planning de lecture</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentPlan.schedule.slice(0, 10).map((scheduleItem) => {
                    const isCompleted = userProgress.completedDays.includes(scheduleItem.day);
                    const isCurrent = scheduleItem.day === userProgress.currentDay;
                    
                    return (
                      <div
                        key={scheduleItem.day}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                          isCompleted
                            ? 'bg-green-50 border-green-200'
                            : isCurrent
                            ? 'bg-spiritual-50 border-spiritual-200'
                            : 'bg-white/50 border-white/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : isCurrent
                              ? 'bg-spiritual-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle size={16} />
                            ) : (
                              <span className="text-sm font-medium">{scheduleItem.day}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              Jour {scheduleItem.day}
                            </div>
                            <div className="text-sm text-gray-600">
                              {scheduleItem.books.join(', ')}
                              {scheduleItem.chapters && ` (chapitres ${scheduleItem.chapters.join(', ')})`}
                            </div>
                          </div>
                        </div>
                        
                        {!isCompleted && scheduleItem.day <= userProgress.currentDay && (
                          <Button
                            size="sm"
                            onClick={() => markDayComplete(scheduleItem.day)}
                            className="spiritual-gradient"
                          >
                            Marquer terminé
                          </Button>
                        )}
                      </div>
                    );
                  })}
                  
                  {currentPlan.schedule.length > 10 && (
                    <div className="text-center pt-4">
                      <p className="text-sm text-gray-600">
                        ... et {currentPlan.schedule.length - 10} autres jours à découvrir
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadingPlans;
