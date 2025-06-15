
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Clock, Plus, Trash2, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useUniversalNotifications } from '@/hooks/useUniversalNotifications';

interface PrayerTime {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  isCustom: boolean;
}

const PrayerTimeSettings = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [newTime, setNewTime] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { sendPrayerReminder, hasPermission, requestPermission } = useUniversalNotifications();

  // Temps de prière par défaut
  const defaultTimes: Omit<PrayerTime, 'id'>[] = [
    { time: '05:30', label: 'Prière du matin', enabled: true, isCustom: false },
    { time: '12:00', label: 'Prière de midi', enabled: true, isCustom: false },
    { time: '18:00', label: 'Prière du soir', enabled: true, isCustom: false },
    { time: '21:00', label: 'Prière de nuit', enabled: true, isCustom: false },
  ];

  useEffect(() => {
    loadPrayerTimes();
  }, [user]);

  const loadPrayerTimes = async () => {
    if (!user) return;

    try {
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('reminder_times')
        .eq('user_id', user.id)
        .single();

      let savedTimes: string[] = [];
      
      if (preferences?.reminder_times && typeof preferences.reminder_times === 'object') {
        const reminderTimes = preferences.reminder_times as Record<string, any>;
        savedTimes = Array.isArray(reminderTimes.prayer) ? reminderTimes.prayer : [];
      }
      
      // Combiner les temps par défaut avec les temps personnalisés
      const allTimes: PrayerTime[] = [
        ...defaultTimes.map((time, index) => ({
          ...time,
          id: `default-${index}`,
          enabled: savedTimes.includes(time.time)
        })),
        ...savedTimes
          .filter((time: string) => !defaultTimes.some(dt => dt.time === time))
          .map((time: string, index: number) => ({
            id: `custom-${index}`,
            time,
            label: `Prière personnalisée`,
            enabled: true,
            isCustom: true
          }))
      ];

      setPrayerTimes(allTimes);
    } catch (error) {
      console.error('Erreur lors du chargement des temps de prière:', error);
    }
  };

  const savePrayerTimes = async (updatedTimes: PrayerTime[]) => {
    if (!user) return;

    try {
      const enabledTimes = updatedTimes
        .filter(time => time.enabled)
        .map(time => time.time);

      const { error } = await supabase
        .from('user_preferences')
        .update({
          reminder_times: {
            prayer: enabledTimes,
            reading: '07:00'
          }
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Programmer les notifications
      scheduleNotifications(enabledTimes);
      
      toast.success('Temps de prière sauvegardés');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const scheduleNotifications = (times: string[]) => {
    if (!hasPermission) return;

    times.forEach(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const prayerTime = new Date();
      prayerTime.setHours(hours, minutes, 0, 0);

      // Si l'heure est déjà passée aujourd'hui, programmer pour demain
      if (prayerTime <= now) {
        prayerTime.setDate(prayerTime.getDate() + 1);
      }

      const delay = prayerTime.getTime() - now.getTime();
      
      setTimeout(() => {
        sendPrayerReminder(time);
      }, delay);
    });
  };

  const togglePrayerTime = async (id: string) => {
    const updatedTimes = prayerTimes.map(time => 
      time.id === id ? { ...time, enabled: !time.enabled } : time
    );
    setPrayerTimes(updatedTimes);
    await savePrayerTimes(updatedTimes);
  };

  const addCustomTime = async () => {
    if (!newTime || !newLabel.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (prayerTimes.some(time => time.time === newTime)) {
      toast.error('Cette heure existe déjà');
      return;
    }

    setLoading(true);

    const newPrayerTime: PrayerTime = {
      id: `custom-${Date.now()}`,
      time: newTime,
      label: newLabel.trim(),
      enabled: true,
      isCustom: true
    };

    const updatedTimes = [...prayerTimes, newPrayerTime];
    setPrayerTimes(updatedTimes);
    await savePrayerTimes(updatedTimes);

    setNewTime('');
    setNewLabel('');
    setLoading(false);
    toast.success('Temps de prière ajouté');
  };

  const removeCustomTime = async (id: string) => {
    const updatedTimes = prayerTimes.filter(time => time.id !== id);
    setPrayerTimes(updatedTimes);
    await savePrayerTimes(updatedTimes);
    toast.success('Temps de prière supprimé');
  };

  const enableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      const enabledTimes = prayerTimes
        .filter(time => time.enabled)
        .map(time => time.time);
      scheduleNotifications(enabledTimes);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <Clock className="h-5 w-5" />
            Temps de prière personnalisés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Activation des notifications */}
          {!hasPermission && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-400 font-medium">
                    Activez les notifications pour recevoir vos rappels de prière
                  </p>
                </div>
                <Button onClick={enableNotifications} size="sm" className="flex-shrink-0">
                  <Bell className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Activer
                </Button>
              </div>
            </div>
          )}

          {/* Liste des temps de prière */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-sm sm:text-base font-medium text-[var(--text-primary)]">
              Vos temps de prière
            </h4>
            {prayerTimes.map((prayerTime) => (
              <div
                key={prayerTime.id}
                className="flex items-center justify-between p-3 sm:p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-default)]"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Switch
                    checked={prayerTime.enabled}
                    onCheckedChange={() => togglePrayerTime(prayerTime.id)}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-medium text-[var(--text-primary)] break-words">
                      {prayerTime.label}
                    </div>
                    <div className="text-[10px] xs:text-xs text-[var(--text-secondary)]">
                      {prayerTime.time}
                    </div>
                  </div>
                </div>
                {prayerTime.isCustom && (
                  <Button
                    onClick={() => removeCustomTime(prayerTime.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Ajouter un temps personnalisé */}
          <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-default)]">
            <h4 className="text-sm sm:text-base font-medium text-[var(--text-primary)] flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un temps personnalisé
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-time" className="text-xs sm:text-sm">Heure</Label>
                <Input
                  id="new-time"
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-label" className="text-xs sm:text-sm">Nom</Label>
                <Input
                  id="new-label"
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Ex: Prière du matin"
                  className="text-xs sm:text-sm"
                />
              </div>
            </div>
            <Button
              onClick={addCustomTime}
              disabled={loading || !newTime || !newLabel.trim()}
              className="w-full gap-2 text-xs sm:text-sm"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              Ajouter ce temps de prière
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrayerTimeSettings;
