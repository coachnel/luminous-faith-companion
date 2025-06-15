
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Heart, PenTool, Target, BookOpen, TrendingUp } from 'lucide-react';

interface CommunityStats {
  total_prayers: number;
  total_notes: number;
  total_challenges: number;
  total_plans_completed: number;
  active_users: number;
}

interface CommunityStatsCardProps {
  stats: CommunityStats | null;
  loading: boolean;
}

const CommunityStatsCard = ({ stats, loading }: CommunityStatsCardProps) => {
  if (loading) {
    return (
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Statistiques de la communauté
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  const statsItems = [
    {
      icon: Heart,
      label: 'Prières',
      value: stats.total_prayers,
      color: 'text-red-500'
    },
    {
      icon: PenTool,
      label: 'Notes',
      value: stats.total_notes,
      color: 'text-green-500'
    },
    {
      icon: Target,
      label: 'Défis',
      value: stats.total_challenges,
      color: 'text-orange-500'
    },
    {
      icon: BookOpen,
      label: 'Plans terminés',
      value: stats.total_plans_completed,
      color: 'text-blue-500'
    }
  ];

  return (
    <Card className="glass border-white/30">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Statistiques du mois
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {statsItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div className="text-lg font-bold text-gray-800 mb-1">
                {item.value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">
                {item.label}
              </div>
            </div>
          ))}
        </div>
        
        {stats.active_users > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              {stats.active_users} utilisateurs actifs ce mois
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityStatsCard;
