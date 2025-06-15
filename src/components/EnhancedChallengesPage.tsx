
import React from 'react';
import DailyChallenges from './DailyChallenges';
import ChallengeLeaderboard from './ChallengeLeaderboard';
import { useChallengeLeaderboard } from '@/hooks/useNewFeatures';

const EnhancedChallengesPage = () => {
  const { leaderboard, userStats, updateUserStats, loading } = useChallengeLeaderboard();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Composant des défis existant */}
      <DailyChallenges />
      
      {/* Nouveau leaderboard */}
      <div className="p-3 sm:p-4 max-w-4xl mx-auto">
        <ChallengeLeaderboard 
          leaderboard={leaderboard}
          userStats={userStats}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default EnhancedChallengesPage;
