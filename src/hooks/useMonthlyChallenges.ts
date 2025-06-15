
import { useState, useEffect } from 'react';

export interface MonthlySuggestedChallenge {
  id: string;
  title: string;
  description: string;
  target_days: number;
  category: string;
  month: string;
  year: number;
  difficulty: 'facile' | 'moyen' | 'difficile';
}

export function useMonthlyChallenges() {
  const [monthlyChallenges, setMonthlyChallenges] = useState<MonthlySuggestedChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  const getCurrentMonthKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const generateChallengesForMonth = (monthKey: string): MonthlySuggestedChallenge[] => {
    const [year, month] = monthKey.split('-');
    const monthNum = parseInt(month);
    
    // Différents défis selon le mois
    const challengesByMonth = {
      1: [ // Janvier - Nouveau départ
        {
          id: 'jan-1',
          title: 'Nouvelle année, nouvelle prière',
          description: 'Commencez l\'année par 15 minutes de prière quotidienne',
          target_days: 31,
          category: 'Prière',
          difficulty: 'facile' as const
        },
        {
          id: 'jan-2',
          title: 'Lecture biblique du Nouveau Testament',
          description: 'Lire un chapitre du Nouveau Testament chaque jour',
          target_days: 31,
          category: 'Lecture',
          difficulty: 'moyen' as const
        }
      ],
      2: [ // Février - Amour et compassion
        {
          id: 'feb-1',
          title: 'Mois de l\'amour divin',
          description: 'Méditer sur l\'amour de Dieu pendant 20 minutes chaque jour',
          target_days: 28,
          category: 'Méditation',
          difficulty: 'moyen' as const
        },
        {
          id: 'feb-2',
          title: 'Actes de bonté quotidiens',
          description: 'Accomplir un acte de bonté chaque jour du mois',
          target_days: 28,
          category: 'Service',
          difficulty: 'facile' as const
        }
      ],
      3: [ // Mars - Carême et jeûne
        {
          id: 'mar-1',
          title: 'Jeûne spirituel de Carême',
          description: 'Jeûner et prier pendant la période du Carême',
          target_days: 40,
          category: 'Jeûne',
          difficulty: 'difficile' as const
        },
        {
          id: 'mar-2',
          title: 'Psaumes quotidiens',
          description: 'Lire et méditer un psaume chaque jour',
          target_days: 31,
          category: 'Lecture',
          difficulty: 'facile' as const
        }
      ],
      // Défis par défaut pour les autres mois
      default: [
        {
          id: 'def-1',
          title: 'Prière matinale',
          description: 'Commencer chaque journée par 10 minutes de prière',
          target_days: 30,
          category: 'Prière',
          difficulty: 'facile' as const
        },
        {
          id: 'def-2',
          title: 'Lecture biblique quotidienne',
          description: 'Lire un chapitre de la Bible chaque jour',
          target_days: 30,
          category: 'Lecture',
          difficulty: 'moyen' as const
        },
        {
          id: 'def-3',
          title: 'Méditation spirituelle',
          description: 'Prendre 15 minutes pour méditer sur la Parole',
          target_days: 30,
          category: 'Méditation',
          difficulty: 'moyen' as const
        }
      ]
    };

    const challenges = challengesByMonth[monthNum as keyof typeof challengesByMonth] || challengesByMonth.default;
    
    return challenges.map(challenge => ({
      ...challenge,
      month: monthKey,
      year: parseInt(year)
    }));
  };

  const loadMonthlyChallenges = () => {
    setLoading(true);
    try {
      const currentMonth = getCurrentMonthKey();
      const storedMonth = localStorage.getItem('current_challenges_month');
      
      // Vérifier si nous sommes dans un nouveau mois
      if (storedMonth !== currentMonth) {
        // Nouveau mois - générer de nouveaux défis
        const newChallenges = generateChallengesForMonth(currentMonth);
        localStorage.setItem('monthly_challenges', JSON.stringify(newChallenges));
        localStorage.setItem('current_challenges_month', currentMonth);
        setMonthlyChallenges(newChallenges);
        
        // Notifier les utilisateurs des nouveaux défis
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('🎯 Nouveaux défis mensuels !', {
            body: 'De nouveaux défis spirituels sont maintenant disponibles.',
            icon: '/icons/icon-192x192.png'
          });
        }
      } else {
        // Même mois - charger les défis existants
        const stored = localStorage.getItem('monthly_challenges');
        if (stored) {
          setMonthlyChallenges(JSON.parse(stored));
        } else {
          const challenges = generateChallengesForMonth(currentMonth);
          localStorage.setItem('monthly_challenges', JSON.stringify(challenges));
          setMonthlyChallenges(challenges);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des défis mensuels:', error);
      // Fallback - générer des défis par défaut
      const currentMonth = getCurrentMonthKey();
      const fallbackChallenges = generateChallengesForMonth(currentMonth);
      setMonthlyChallenges(fallbackChallenges);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonthlyChallenges();
    
    // Vérifier les nouveaux défis chaque heure
    const interval = setInterval(loadMonthlyChallenges, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    monthlyChallenges,
    loading,
    refresh: loadMonthlyChallenges
  };
}
