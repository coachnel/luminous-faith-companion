
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, BarChart3 } from 'lucide-react';
import { useReadingProgress } from '@/hooks/useNewFeatures';
import ProgressVisualization from './ProgressVisualization';

const EnhancedReadingPlans = () => {
  const { progressData, updateProgress, loading } = useReadingProgress();

  // Fonction pour simuler l'ajout d'un plan (à connecter avec la vraie logique)
  const handleAddPlan = (planName: string, totalDays: number) => {
    updateProgress(planName, totalDays, 0);
  };

  // Plans de lecture disponibles
  const availablePlans = [
    { name: 'Évangiles - 30 jours', days: 30 },
    { name: 'Psaumes - 60 jours', days: 60 },
    { name: 'Bible complète - 365 jours', days: 365 },
    { name: 'Nouveau Testament - 90 jours', days: 90 }
  ];

  return (
    <div className="p-3 sm:p-4 max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* En-tête */}
      <Card className="glass border-white/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Plans de lecture</h1>
              <p className="text-sm text-gray-600 hidden sm:block">Suivez votre progression spirituelle</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Visualisation de la progression */}
      {progressData.length > 0 && (
        <Card className="glass border-white/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Ma progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressVisualization progressData={progressData} loading={loading} />
          </CardContent>
        </Card>
      )}

      {/* Plans disponibles */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="text-base">Plans disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {availablePlans.map((plan) => {
              const isActive = progressData.some(p => p.plan_name === plan.name);
              
              return (
                <div 
                  key={plan.name}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-800">{plan.name}</h3>
                    <p className="text-sm text-gray-600">{plan.days} jours de lecture</p>
                  </div>
                  
                  {isActive ? (
                    <Button variant="outline" size="sm" disabled>
                      En cours
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => handleAddPlan(plan.name, plan.days)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Commencer
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="glass border-white/30 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800 mb-1">Comment ça marche ?</h3>
              <p className="text-sm text-blue-700">
                Choisissez un plan de lecture, suivez votre progression quotidienne et visualisez 
                vos statistiques. Votre progression est automatiquement sauvegardée.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedReadingPlans;
