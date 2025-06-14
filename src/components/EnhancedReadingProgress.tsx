
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
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
      <div className="space-y-4 p-4">
        <div className="animate-pulse bg-[var(--bg-secondary)] h-32 rounded-lg"></div>
        <div className="animate-pulse bg-[var(--bg-secondary)] h-32 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Explication */}
      <ModernCard className="border-[var(--accent-primary)]/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Comment ça marche ?
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Suivez votre progression dans la lecture de la Bible avec des plans structurés. 
              Choisissez un plan adapté à vos objectifs (Bible complète en 1 an, Nouveau Testament en 3 mois, etc.). 
              Validez chaque jour votre lecture pour voir votre avancement et rester motivé dans votre parcours spirituel.
            </p>
          </div>
        </div>
      </ModernCard>

      {/* Progression globale de la Bible */}
      <ModernCard variant="elevated">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Progression globale de la Bible</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Votre avancement dans la lecture de la Bible complète
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-primary)]">Chapitres lus</span>
            <span className="text-2xl font-bold text-[var(--text-primary)]">{overallStats.readChapters}/{overallStats.totalChapters}</span>
          </div>
          <Progress value={overallStats.percentage} className="h-3" />
          <div className="flex justify-between text-sm text-[var(--text-secondary)]">
            <span>{overallStats.percentage}% terminé</span>
            {overallStats.lastRead && (
              <span>Dernier: {overallStats.lastRead.book_name} {overallStats.lastRead.chapter_number}</span>
            )}
          </div>
        </div>
      </ModernCard>

      {/* Plans de lecture actifs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-[var(--text-primary)]">
          <Target className="h-5 w-5" />
          Mes plans de lecture
        </h3>
        
        {plans.filter(p => p.is_active).map((plan) => {
          const stats = getPlanStats(plan);
          return (
            <ModernCard key={plan.id} variant="elevated">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-semibold text-[var(--text-primary)]">{plan.plan_name}</h4>
                <Badge variant="secondary">{stats.percentage}%</Badge>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                {stats.completedDays} / {stats.totalDays} jours terminés
              </p>
              <div className="space-y-4">
                <Progress value={stats.percentage} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--text-secondary)]">
                    {stats.remainingDays} jours restants
                  </span>
                  <ModernButton
                    size="sm"
                    onClick={() => markDayCompleted(plan.id, plan.current_day)}
                    disabled={plan.completed_days.includes(plan.current_day)}
                  >
                    {plan.completed_days.includes(plan.current_day) 
                      ? 'Jour terminé' 
                      : `Marquer jour ${plan.current_day}`
                    }
                  </ModernButton>
                </div>
              </div>
            </ModernCard>
          );
        })}
      </div>

      {/* Démarrer un nouveau plan */}
      <ModernCard variant="elevated">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Démarrer un nouveau plan</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Choisissez un plan de lecture structuré pour organiser votre parcours
            </p>
          </div>
        </div>
        <div className="grid gap-3">
          {READING_PLANS.map((plan) => {
            const isActive = plans.some(p => p.plan_id === plan.id && p.is_active);
            return (
              <div key={plan.id} className="flex items-center justify-between p-3 border border-[var(--border-default)] rounded-lg">
                <div>
                  <div className="font-medium text-[var(--text-primary)]">{plan.name}</div>
                  <div className="text-sm text-[var(--text-secondary)]">{plan.description}</div>
                  <div className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    {plan.duration} jours
                  </div>
                </div>
                <ModernButton
                  size="sm"
                  onClick={() => startPlan(plan.id, plan.name)}
                  disabled={isActive}
                >
                  {isActive ? 'En cours' : 'Commencer'}
                </ModernButton>
              </div>
            );
          })}
        </div>
      </ModernCard>
    </div>
  );
}
