
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calendar, TrendingUp } from 'lucide-react';

interface ProgressData {
  plan_name: string;
  total_days: number;
  completed_days: number;
  completion_percentage: number;
  created_at: string;
}

interface ProgressVisualizationProps {
  progressData: ProgressData[];
  loading: boolean;
}

const ProgressVisualization = ({ progressData, loading }: ProgressVisualizationProps) => {
  if (loading) {
    return (
      <Card className="glass border-white/30">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (progressData.length === 0) {
    return (
      <Card className="glass border-white/30">
        <CardContent className="p-6 text-center">
          <BookOpen className="mx-auto mb-3 text-gray-400" size={32} />
          <p className="text-gray-600 text-sm">Aucun plan de lecture en cours</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {progressData.map((progress) => (
        <Card key={progress.plan_name} className="glass border-white/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              {progress.plan_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {progress.completed_days}/{progress.total_days} jours
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {Math.round(progress.completion_percentage)}%
                </span>
              </div>
              
              <Progress 
                value={progress.completion_percentage} 
                className="h-2"
              />
              
              <div className="text-xs text-gray-500">
                Commencé le {new Date(progress.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProgressVisualization;
