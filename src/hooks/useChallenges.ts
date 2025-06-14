import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useSupabaseChallenges, useSupabaseChallengeProgress } from '@/integrations/supabase/hooks';

export interface Challenge {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_days: number;
  is_public: boolean;
  shared_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ChallengeProgress {
  id: string;
  challenge_id: string;
  user_id: string;
  completed_date: string;
  created_at: string;
}

export function useChallenges() {
  const { challenges, publicChallenges, loading, createChallenge: createSupabaseChallenge, markChallengeCompleted: markSupabaseCompleted, refetch } = useSupabaseChallenges();

  const createChallenge = async (challengeData: Omit<Challenge, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    await createSupabaseChallenge(challengeData);
  };

  const markChallengeCompleted = async (challengeId: string) => {
    await markSupabaseCompleted(challengeId);
  };

  // Adapter les interfaces pour la compatibilité
  const adaptedChallenges = challenges.map(c => ({
    id: c.id,
    user_id: c.user_id,
    title: c.title,
    description: c.description,
    target_days: c.target_days,
    is_public: c.is_public,
    created_at: c.created_at,
    updated_at: c.updated_at
  }));

  const adaptedPublicChallenges = publicChallenges.map(c => ({
    id: c.id,
    user_id: c.user_id,
    title: c.title,
    description: c.description,
    target_days: c.target_days,
    is_public: c.is_public,
    created_at: c.created_at,
    updated_at: c.updated_at
  }));

  return {
    challenges: adaptedChallenges,
    publicChallenges: adaptedPublicChallenges,
    loading,
    createChallenge,
    markChallengeCompleted,
    refetch,
    // Fonctions temporairement non implémentées
    updateChallenge: async () => {},
    deleteChallenge: async () => {}
  };
}

export function useChallengeProgress(challengeId: string) {
  return useSupabaseChallengeProgress(challengeId);
}
