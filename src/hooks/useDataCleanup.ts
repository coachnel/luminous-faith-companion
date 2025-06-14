
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useDataCleanup = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const cleanup = async () => {
      try {
        // Nettoyer les contenus de découverte de plus de 7 jours
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Nettoyer les demandes de prière anciennes (mais garder celles de l'utilisateur)
        await supabase
          .from('prayer_requests')
          .delete()
          .lt('created_at', sevenDaysAgo.toISOString())
          .neq('user_id', user.id);

        console.log('Nettoyage automatique effectué');
      } catch (error) {
        console.error('Erreur lors du nettoyage automatique:', error);
      }
    };

    // Effectuer le nettoyage au démarrage (une fois par session)
    const timer = setTimeout(cleanup, 5000);

    return () => clearTimeout(timer);
  }, [user]);
};
