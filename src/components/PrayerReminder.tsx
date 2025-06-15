import React, { useState, useEffect } from 'react';
import { Clock, Bell, CheckCircle, Heart, Calendar, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getRandomEncouragement } from '../data/bibleVerses';

interface PrayerReminderProps {
  reminderTimes: string[];
  onPrayerCompleted: () => void;
}

const PrayerReminder: React.FC<PrayerReminderProps> = ({ reminderTimes, onPrayerCompleted }) => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todaysPrayers, setTodaysPrayers] = useState<string[]>([]);
  const [encouragement, setEncouragement] = useState('');
  const [actualReminderTimes, setActualReminderTimes] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    loadActualReminderTimes();
    loadTodaysPrayers();
    setEncouragement(getRandomEncouragement());

    return () => clearInterval(timer);
  }, [user]);

  const loadActualReminderTimes = async () => {
    if (!user) {
      setActualReminderTimes(reminderTimes);
      return;
    }

    try {
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('reminder_times')
        .eq('user_id', user.id)
        .single();

      if (preferences?.reminder_times && typeof preferences.reminder_times === 'object') {
        const reminderTimesData = preferences.reminder_times as Record<string, any>;
        const savedTimes = Array.isArray(reminderTimesData.prayer) ? reminderTimesData.prayer : [];
        
        if (savedTimes.length > 0) {
          setActualReminderTimes(savedTimes);
        } else {
          setActualReminderTimes(reminderTimes);
        }
      } else {
        setActualReminderTimes(reminderTimes);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des temps de prière:', error);
      setActualReminderTimes(reminderTimes);
    }
  };

  const loadTodaysPrayers = () => {
    const today = new Date().toDateString();
    const savedPrayers = localStorage.getItem(`prayers-${today}`);
    if (savedPrayers) {
      setTodaysPrayers(JSON.parse(savedPrayers));
    }
  };

  const markPrayerCompleted = async (time: string) => {
    const today = new Date().toDateString();
    const updated = [...todaysPrayers, time];
    setTodaysPrayers(updated);
    localStorage.setItem(`prayers-${today}`, JSON.stringify(updated));
    
    // Sauvegarder aussi en base de données si connecté
    if (user) {
      try {
        const { error } = await supabase
          .from('user_preferences')
          .update({
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        if (!error) {
          toast.success('🙏 Prière enregistrée avec succès !');
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
    } else {
      toast.success('🙏 Prière marquée comme accomplie !');
    }
    
    onPrayerCompleted();
  };

  const isTimeForPrayer = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = currentTime;
    const prayerTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    const timeDiff = Math.abs(now.getTime() - prayerTime.getTime());
    return timeDiff < 30 * 60 * 1000; // 30 minutes window
  };

  const upcomingPrayer = actualReminderTimes.find(time => 
    !todaysPrayers.includes(time) && isTimeForPrayer(time)
  );

  const completedCount = todaysPrayers.length;
  const totalPrayers = actualReminderTimes.length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Statistiques du jour */}
      <Card className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)] text-sm sm:text-base">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
            Progression du jour
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-[var(--text-secondary)]">Prières accomplies</span>
            <Badge variant={completedCount === totalPrayers ? "default" : "secondary"} className="text-xs">
              {completedCount}/{totalPrayers}
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${totalPrayers > 0 ? (completedCount / totalPrayers) * 100 : 0}%` }}
            />
          </div>
          {completedCount === totalPrayers && totalPrayers > 0 && (
            <p className="text-xs sm:text-sm text-green-600 font-medium text-center">
              🎉 Félicitations ! Toutes vos prières du jour sont accomplies !
            </p>
          )}
        </CardContent>
      </Card>

      {/* Rappel urgent */}
      {upcomingPrayer && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Bell className="text-blue-600 h-5 w-5" />
              <div>
                <p className="text-blue-700 font-medium text-sm sm:text-base">
                  Il est temps de prier ! 🙏
                </p>
                <p className="text-xs sm:text-sm text-blue-600">{upcomingPrayer}</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 italic">{encouragement}</p>
            <Button
              onClick={() => markPrayerCompleted(upcomingPrayer)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm"
              size="sm"
            >
              <CheckCircle size={14} className="mr-2" />
              J'ai prié
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Liste des temps de prière */}
      <Card className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[var(--text-primary)] text-sm sm:text-base">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              Vos temps de prière
            </CardTitle>
            <span className="text-xs text-[var(--text-secondary)]">
              {new Date().toLocaleDateString('fr-FR')}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          {actualReminderTimes.length === 0 ? (
            <div className="text-center py-6">
              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">Aucun temps de prière configuré</p>
              <p className="text-xs text-gray-500">
                Allez dans l'onglet "Horaires" pour personnaliser vos rappels de prière
              </p>
            </div>
          ) : (
            actualReminderTimes.map((time, index) => {
              const isCompleted = todaysPrayers.includes(time);
              const isPending = isTimeForPrayer(time) && !isCompleted;
              
              return (
                <div
                  key={`${time}-${index}`}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all border ${
                    isCompleted
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : isPending
                      ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      isCompleted ? 'bg-green-500' : isPending ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <div>
                      <span className="font-medium text-xs sm:text-sm">{time}</span>
                      {isPending && (
                        <p className="text-xs text-blue-600">En cours</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markPrayerCompleted(time)}
                        className="text-xs h-7 px-2"
                      >
                        Marquer
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Encouragement */}
      {!upcomingPrayer && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <Heart className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-purple-700 italic">{encouragement}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrayerReminder;
