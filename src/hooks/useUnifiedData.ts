
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { getDataSource } from '@/lib/dataRouter';
import type { Database } from '@/integrations/supabase/types';

type TableNames = keyof Database['public']['Tables'];

interface UnifiedDataOptions {
  table: TableNames;
  enableRealtime?: boolean;
  fallbackToLocal?: boolean;
}

export function useUnifiedData<T>({ table, enableRealtime = false, fallbackToLocal = true }: UnifiedDataOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const dataSource = getDataSource(table);

  const fetchFromSupabase = useCallback(async () => {
    if (!user) return [];
    
    try {
      const { data: result, error } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return result || [];
    } catch (err) {
      console.error(`Error fetching from Supabase (${table}):`, err);
      throw err;
    }
  }, [table, user]);

  const fetchFromLocal = useCallback(() => {
    if (!user) return [];
    
    try {
      const stored = localStorage.getItem(`${table}_${user.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error(`Error fetching from localStorage (${table}):`, err);
      return [];
    }
  }, [table, user]);

  const saveToLocal = useCallback((data: T[]) => {
    if (!user) return;
    
    try {
      localStorage.setItem(`${table}_${user.id}`, JSON.stringify(data));
    } catch (err) {
      console.error(`Error saving to localStorage (${table}):`, err);
    }
  }, [table, user]);

  const fetchData = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      
      if (dataSource === 'supabase') {
        try {
          const result = await fetchFromSupabase();
          setData(result as T[]);
        } catch (err) {
          if (fallbackToLocal) {
            console.log(`Falling back to localStorage for ${table}`);
            const localData = fetchFromLocal();
            setData(localData as T[]);
          } else {
            throw err;
          }
        }
      } else {
        // Neon or localStorage
        const localData = fetchFromLocal();
        setData(localData as T[]);
      }
    } catch (err) {
      console.error(`Error fetching data for ${table}:`, err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, [table, user, dataSource, fallbackToLocal, fetchFromSupabase, fetchFromLocal]);

  const saveData = useCallback(async (newData: T[]) => {
    if (!user) return;

    try {
      if (dataSource === 'supabase') {
        // Pour les données Supabase, on utilise les hooks spécialisés
        // Cette fonction est principalement pour la synchronisation
        saveToLocal(newData);
      } else {
        // Pour Neon/localStorage, on sauvegarde localement
        saveToLocal(newData);
      }
      
      setData(newData);
    } catch (err) {
      console.error(`Error saving data for ${table}:`, err);
      throw err;
    }
  }, [table, user, dataSource, saveToLocal]);

  useEffect(() => {
    fetchData();

    if (enableRealtime && dataSource === 'supabase' && user) {
      const channel = supabase
        .channel(`${table}_changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [fetchData, enableRealtime, table, dataSource, user]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    saveData
  };
}
