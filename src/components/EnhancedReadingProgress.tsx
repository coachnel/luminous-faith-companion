
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, Target, TrendingUp, Info } from 'lucide-react';
import { useSupabaseReadingPlanProgress, useSupabaseBibleReadingProgress, READING_PLANS } from '@/hooks/useSupabaseReadingProgress';

export function EnhancedReadingProgress() {
  const { plans, loading: plansLoading, startPlan, markDayCompleted, getPlanStats } = useSupabaseReadingPlanProgress();
  const { getOverallStats } = useSupabaseBibleReadingProgress();
  
  const overallStats = getOverallStats();

  if (plansLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Explication */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600" />
            Comment ça marche ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">
            Suivez votre progression dans la lecture de la Bible avec des plans structurés. 
            Choisissez un plan adapté à vos objectifs (Bible complète en 1 an, Nouveau Testament en 3 mois, etc.). 
            Validez chaque jour votre lecture pour voir votre avancement et rester motivé dans votre parcours spirituel.
          </p>
        </CardContent>
      </Card>

      {/* Progression globale de la Bible */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Progression globale de la Bible
          </CardTitle>
          <CardDescription>
            Votre avancement dans la lecture de la Bible complète
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Chapitres lus</span>
              <span className="text-2xl font-bold">{overallStats.readChapters}/{overallStats.totalChapters}</span>
            </div>
            <Progress value={overallStats.percentage} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{overallStats.percentage}% terminé</span>
              {overallStats.lastRead && (
                <span>Dernier: {overallStats.lastRead.book_name} {overallStats.lastRead.chapter_number}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans de lecture actifs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5" />
          Mes plans de lecture
        </h3>
        
        {plans.filter(p => p.is_active).map((plan) => {
          const stats = getPlanStats(plan);
          return (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{plan.plan_name}</CardTitle>
                  <Badge variant="secondary">{stats.percentage}%</Badge>
                </div>
                <CardDescription>
                  {stats.completedDays} / {stats.totalDays} jours terminés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={stats.percentage} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {stats.remainingDays} jours restants
                    </span>
                    <Button
                      size="sm"
                      onClick={() => markDayCompleted(plan.id, plan.current_day)}
                      disabled={plan.completed_days.includes(plan.current_day)}
                    >
                      {plan.completed_days.includes(plan.current_day) 
                        ? 'Jour terminé' 
                        : `Marquer jour ${plan.current_day}`
                      }
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Démarrer un nouveau plan */}
      <Card>
        <CardHeader>
          <CardTitle>Démarrer un nouveau plan</CardTitle>
          <CardDescription>
            Choisissez un plan de lecture structuré pour organiser votre parcours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {READING_PLANS.map((plan) => {
              const isActive = plans.some(p => p.plan_id === plan.id && p.is_active);
              return (
                <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-sm text-gray-600">{plan.description}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {plan.duration} jours
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => startPlan(plan.id, plan.name)}
                    disabled={isActive}
                  >
                    {isActive ? 'En cours' : 'Commencer'}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
