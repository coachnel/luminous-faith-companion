
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, User, Target } from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  total_challenges_completed: number;
  current_streak: number;
  longest_streak: number;
  total_days_completed: number;
  profiles: { name: string } | null;
}

interface ChallengeLeaderboardProps {
  leaderboard: LeaderboardEntry[];
  userStats: LeaderboardEntry | null;
  loading: boolean;
}

const ChallengeLeaderboard = ({ leaderboard, userStats, loading }: ChallengeLeaderboardProps) => {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 1:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 2:
        return <Award className="h-4 w-4 text-amber-600" />;
      default:
        return <span className="text-xs font-bold text-gray-500">#{index + 1}</span>;
    }
  };

  if (loading) {
    return (
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Classement des défis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-white/30">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Classement des défis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.length === 0 ? (
            <div className="text-center py-4">
              <Target className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="text-sm text-gray-600">Aucun classement disponible</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => (
              <div 
                key={entry.user_id} 
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  entry.user_id === userStats?.user_id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(index)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-gray-400" />
                    <span className="text-sm font-medium truncate">
                      {entry.profiles?.name || 'Utilisateur anonyme'}
                    </span>
                    {entry.user_id === userStats?.user_id && (
                      <Badge variant="outline" className="text-xs">Vous</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>{entry.total_challenges_completed} défis</span>
                    <span>•</span>
                    <span>{entry.total_days_completed} jours</span>
                    {entry.current_streak > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-orange-600 font-medium">
                          {entry.current_streak} jours consécutifs
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {userStats && !leaderboard.find(entry => entry.user_id === userStats.user_id) && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Votre position :</div>
            <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center w-8 h-8">
                <User className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Vous</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span>{userStats.total_challenges_completed} défis</span>
                  <span>•</span>
                  <span>{userStats.total_days_completed} jours</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChallengeLeaderboard;
