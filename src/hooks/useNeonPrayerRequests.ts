
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PrayerRequest {
  id: string;
  user_id: string;
  title: string;
  content: string;
  author_name: string;
  is_anonymous: boolean;
  prayer_count: number;
  created_at: string;
  updated_at: string;
}

export function useNeonPrayerRequests() {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPrayerRequests();
    } else {
      setPrayerRequests([]);
      setLoading(false);
    }
  }, [user]);

  const fetchPrayerRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrayerRequests(data || []);
    } catch (error) {
      console.error('Error fetching prayer requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPrayerRequest = async (requestData: Omit<PrayerRequest, 'id' | 'user_id' | 'prayer_count' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .insert([{ ...requestData, user_id: user?.id, prayer_count: 0 }]);

      if (error) throw error;
      await fetchPrayerRequests();
    } catch (error) {
      console.error('Error adding prayer request:', error);
      throw error;
    }
  };

  return { prayerRequests, loading, addPrayerRequest, refetch: fetchPrayerRequests };
}
