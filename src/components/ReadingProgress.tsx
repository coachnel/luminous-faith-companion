
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, Target, TrendingUp } from 'lucide-react';
import { useReadingPlanProgress, useBibleReadingProgress, READING_PLANS } from '@/hooks/useReadingProgress';

export function ReadingProgress() {
  const { plans, loading: plansLoading, startPlan, markDayCompleted, getPlanStats } = useReadingPlanProgress();
  const { getOverallStats } = useBibleReadingProgress();
  
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
          Plans de lecture
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
            Choisissez un plan de lecture structuré
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
                    <div className="text-xs text-gray-500">{plan.duration} jours</div>
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
