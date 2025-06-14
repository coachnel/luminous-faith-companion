
import { useEffect } from 'react';
import { useAuth } from './useAuth';

export const useChallengeCleanup = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const cleanupExpiredChallenges = () => {
      try {
        // Nettoyer les défis personnels expirés
        const userChallenges = localStorage.getItem(`challenges_${user.id}`);
        if (userChallenges) {
          const challenges = JSON.parse(userChallenges);
          const now = new Date();
          
          const activeChallenges = challenges.filter((challenge: any) => {
            const createdAt = new Date(challenge.created_at);
            const expirationDate = new Date(createdAt);
            expirationDate.setDate(expirationDate.getDate() + challenge.target_days);
            
            return expirationDate > now;
          });
          
          if (activeChallenges.length !== challenges.length) {
            localStorage.setItem(`challenges_${user.id}`, JSON.stringify(activeChallenges));
            console.log(`🧹 Nettoyage: ${challenges.length - activeChallenges.length} défi(s) expiré(s) supprimé(s)`);
          }
        }

        // Nettoyer les défis publics expirés
        const publicChallenges = localStorage.getItem('public_challenges');
        if (publicChallenges) {
          const challenges = JSON.parse(publicChallenges);
          const now = new Date();
          
          const activeChallenges = challenges.filter((challenge: any) => {
            const createdAt = new Date(challenge.created_at);
            const expirationDate = new Date(createdAt);
            expirationDate.setDate(expirationDate.getDate() + challenge.target_days);
            
            return expirationDate > now;
          });
          
          if (activeChallenges.length !== challenges.length) {
            localStorage.setItem('public_challenges', JSON.stringify(activeChallenges));
            console.log(`🧹 Nettoyage public: ${challenges.length - activeChallenges.length} défi(s) expiré(s) supprimé(s)`);
          }
        }

        // Nettoyer les progressions des défis supprimés
        cleanupOrphanedProgress();
        
      } catch (error) {
        console.error('Erreur lors du nettoyage des défis:', error);
      }
    };

    const cleanupOrphanedProgress = () => {
      try {
        const userChallenges = localStorage.getItem(`challenges_${user.id}`);
        if (!userChallenges) return;
        
        const challenges = JSON.parse(userChallenges);
        const activeChallengeIds = challenges.map((c: any) => c.id);
        
        // Parcourir toutes les clés de localStorage pour trouver les progressions
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('challenge_progress_')) {
            const challengeId = key.replace('challenge_progress_', '');
            if (!activeChallengeIds.includes(challengeId)) {
              localStorage.removeItem(key);
              console.log(`🧹 Progression orpheline supprimée: ${challengeId}`);
            }
          }
        });
      } catch (error) {
        console.error('Erreur lors du nettoyage des progressions:', error);
      }
    };

    // Nettoyage initial
    cleanupExpiredChallenges();

    // Nettoyage quotidien à minuit
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      cleanupExpiredChallenges();
      
      // Programmer un nettoyage quotidien
      const interval = setInterval(cleanupExpiredChallenges, 24 * 60 * 60 * 1000);
      
      return () => clearInterval(interval);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, [user]);

  return null;
};
