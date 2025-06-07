
import React, { useState, useEffect } from 'react';
import { Bell, Clock, CheckCircle, Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useUserPreferences } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';

interface CustomAlarm {
  id: string;
  time: string;
  message: string;
  days: string[];
  active: boolean;
  type: 'prayer' | 'reading' | 'custom';
}

const AdvancedNotifications = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [customAlarms, setCustomAlarms] = useState<CustomAlarm[]>([]);
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [newAlarmMessage, setNewAlarmMessage] = useState('');
  const [newAlarmType, setNewAlarmType] = useState<'prayer' | 'reading' | 'custom'>('custom');
  const [selectedDays, setSelectedDays] = useState<string[]>(['1', '2', '3', '4', '5', '6', '0']);

  const daysOfWeek = [
    { value: '1', label: 'Lundi' },
    { value: '2', label: 'Mardi' },
    { value: '3', label: 'Mercredi' },
    { value: '4', label: 'Jeudi' },
    { value: '5', label: 'Vendredi' },
    { value: '6', label: 'Samedi' },
    { value: '0', label: 'Dimanche' },
  ];

  useEffect(() => {
    const savedAlarms = localStorage.getItem('customAlarms');
    if (savedAlarms) {
      setCustomAlarms(JSON.parse(savedAlarms));
    }

    // Demander la permission pour les notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Configurer la vérification périodique des notifications
    const interval = setInterval(checkAndTriggerNotifications, 60000); // Chaque minute
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Sauvegarder les alarmes
    localStorage.setItem('customAlarms', JSON.stringify(customAlarms));
    
    // Configurer les alarmes dans le navigateur
    scheduleNotifications();
  }, [customAlarms]);

  const scheduleNotifications = () => {
    // Cette fonction configure les notifications pour les alarmes actives
    customAlarms.forEach(alarm => {
      if (alarm.active) {
        scheduleAlarmNotification(alarm);
      }
    });
  };

  const scheduleAlarmNotification = (alarm: CustomAlarm) => {
    const now = new Date();
    const [hours, minutes] = alarm.time.split(':').map(Number);
    
    alarm.days.forEach(day => {
      const alarmTime = new Date();
      alarmTime.setHours(hours, minutes, 0, 0);
      
      // Calculer le prochain jour correspondant
      const dayDiff = (parseInt(day) - now.getDay() + 7) % 7;
      alarmTime.setDate(now.getDate() + dayDiff);
      
      // Si l'heure est déjà passée aujourd'hui, programmer pour la semaine prochaine
      if (dayDiff === 0 && alarmTime <= now) {
        alarmTime.setDate(alarmTime.getDate() + 7);
      }
      
      const timeUntilAlarm = alarmTime.getTime() - now.getTime();
      
      if (timeUntilAlarm > 0) {
        setTimeout(() => {
          triggerNotification(alarm);
        }, timeUntilAlarm);
      }
    });
  };

  const triggerNotification = (alarm: CustomAlarm) => {
    // Notification native du navigateur
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`🔔 ${getAlarmTypeIcon(alarm.type)} Rappel`, {
        body: alarm.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
    
    // Notification toast
    toast({
      title: `🔔 ${getAlarmTypeIcon(alarm.type)} Rappel`,
      description: alarm.message,
      duration: 10000,
    });
  };

  const getAlarmTypeIcon = (type: string) => {
    switch (type) {
      case 'prayer': return '🙏';
      case 'reading': return '📖';
      default: return '⏰';
    }
  };

  const checkAndTriggerNotifications = () => {
    // Vérifier les notifications intelligentes
    checkIntelligentNotifications();
    
    // Vérifier les alarmes personnalisées
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = now.getDay().toString();
    
    customAlarms.forEach(alarm => {
      if (alarm.active && alarm.time === currentTime && alarm.days.includes(currentDay)) {
        // Vérifier si cette alarme n'a pas déjà été déclenchée aujourd'hui
        const lastTriggered = localStorage.getItem(`alarm_${alarm.id}_last_triggered`);
        const today = now.toDateString();
        
        if (lastTriggered !== today) {
          triggerNotification(alarm);
          localStorage.setItem(`alarm_${alarm.id}_last_triggered`, today);
        }
      }
    });
  };

  const checkIntelligentNotifications = () => {
    const lastBibleRead = localStorage.getItem('lastBibleRead');
    const lastNotesCheck = localStorage.getItem('lastNotesReminder');
    const today = new Date().toDateString();
    
    // Notification pour la lecture biblique (seulement à 18h)
    const now = new Date();
    if (now.getHours() === 18 && now.getMinutes() === 0) {
      if (!lastBibleRead || lastBibleRead !== today) {
        const daysSinceRead = lastBibleRead ? 
          Math.floor((new Date().getTime() - new Date(lastBibleRead).getTime()) / (1000 * 60 * 60 * 24)) : 1;
        
        if (daysSinceRead >= 1) {
          showIntelligentNotification(
            "📖 Lecture biblique",
            daysSinceRead === 1 ? 
              "Vous n'avez pas lu la Bible aujourd'hui" : 
              `Vous n'avez pas lu la Bible depuis ${daysSinceRead} jours`
          );
        }
      }
    }

    // Notification pour relire les notes (seulement à 10h)
    if (now.getHours() === 10 && now.getMinutes() === 0) {
      if (!lastNotesCheck || lastNotesCheck !== today) {
        const notes = JSON.parse(localStorage.getItem('userNotes') || '[]');
        if (notes.length > 0) {
          showIntelligentNotification(
            "📝 Vos notes spirituelles",
            "N'oubliez pas de relire vos réflexions spirituelles"
          );
          localStorage.setItem('lastNotesReminder', today);
        }
      }
    }
  };

  const showIntelligentNotification = (title: string, message: string) => {
    // Notification toast
    toast({
      title,
      description: message,
      duration: 8000,
    });

    // Notification native si autorisée
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico'
      });
    }
  };

  const addCustomAlarm = () => {
    if (!newAlarmTime || !newAlarmMessage.trim()) {
      toast({
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const newAlarm: CustomAlarm = {
      id: Date.now().toString(),
      time: newAlarmTime,
      message: newAlarmMessage.trim(),
      days: selectedDays,
      active: true,
      type: newAlarmType
    };

    const updatedAlarms = [...customAlarms, newAlarm];
    setCustomAlarms(updatedAlarms);
    
    setNewAlarmTime('');
    setNewAlarmMessage('');
    setNewAlarmType('custom');
    setSelectedDays(['1', '2', '3', '4', '5', '6', '0']);
    
    toast({
      title: "⏰ Alarme créée",
      description: `Rappel programmé pour ${newAlarmTime}`,
    });
  };

  const toggleAlarm = (id: string) => {
    const updatedAlarms = customAlarms.map(alarm =>
      alarm.id === id ? { ...alarm, active: !alarm.active } : alarm
    );
    setCustomAlarms(updatedAlarms);
  };

  const removeAlarm = (id: string) => {
    const updatedAlarms = customAlarms.filter(alarm => alarm.id !== id);
    setCustomAlarms(updatedAlarms);
    
    // Nettoyer le localStorage
    localStorage.removeItem(`alarm_${id}_last_triggered`);
    
    toast({
      description: "Alarme supprimée",
    });
  };

  const toggleDaySelection = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const updateNotificationPreference = async (key: string, value: boolean) => {
    if (!preferences) return;
    
    const newPrefs = {
      ...preferences.notification_preferences,
      [key]: value
    };
    
    try {
      await updatePreferences({
        notification_preferences: newPrefs
      });
      
      toast({
        description: value ? "Notification activée" : "Notification désactivée",
      });
    } catch (error) {
      toast({
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="text-spiritual-600" size={24} />
            Notifications avancées
            <span className="text-sm bg-spiritual-100 text-spiritual-700 px-2 py-1 rounded-full">
              {customAlarms.filter(a => a.active).length} active(s)
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Permission des notifications */}
      {Notification.permission !== 'granted' && (
        <Card className="glass border-white/30 border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Bell className="text-orange-600" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-orange-700">Activer les notifications</h4>
                <p className="text-sm text-gray-600">
                  Autorisez les notifications pour recevoir vos rappels spirituels même quand l'application est fermée
                </p>
              </div>
              <Button 
                onClick={() => Notification.requestPermission()} 
                className="bg-orange-500 hover:bg-orange-600"
              >
                Activer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications intelligentes */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="text-lg">Notifications intelligentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Rappel de lecture biblique</h4>
              <p className="text-sm text-gray-600">Notification à 18h si vous n'avez pas lu la Bible</p>
            </div>
            <Switch
              checked={preferences?.notification_preferences?.dailyVerse || false}
              onCheckedChange={(value) => updateNotificationPreference('dailyVerse', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Rappel de notes</h4>
              <p className="text-sm text-gray-600">Notification à 10h pour relire vos réflexions</p>
            </div>
            <Switch
              checked={preferences?.notification_preferences?.readingReminder || false}
              onCheckedChange={(value) => updateNotificationPreference('readingReminder', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Créer une nouvelle alarme */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="text-lg">Créer une alarme personnalisée</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Heure</label>
              <Input
                type="time"
                value={newAlarmTime}
                onChange={(e) => setNewAlarmTime(e.target.value)}
                className="glass border-white/30"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <Select value={newAlarmType} onValueChange={(value: any) => setNewAlarmType(value)}>
                <SelectTrigger className="glass border-white/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prayer">🙏 Prière</SelectItem>
                  <SelectItem value="reading">📖 Lecture</SelectItem>
                  <SelectItem value="custom">⏰ Personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <Input
              placeholder="Message de rappel..."
              value={newAlarmMessage}
              onChange={(e) => setNewAlarmMessage(e.target.value)}
              className="glass border-white/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Jours de la semaine</label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <Button
                  key={day.value}
                  variant={selectedDays.includes(day.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleDaySelection(day.value)}
                  className={selectedDays.includes(day.value) ? "spiritual-gradient" : ""}
                >
                  {day.label}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={addCustomAlarm}
            className="w-full spiritual-gradient"
            disabled={!newAlarmTime || !newAlarmMessage.trim()}
          >
            <Plus size={18} className="mr-2" />
            Créer l'alarme
          </Button>
        </CardContent>
      </Card>

      {/* Liste des alarmes */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="text-lg">Vos alarmes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {customAlarms.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <Clock className="mx-auto mb-2" size={48} />
              <p>Aucune alarme configurée</p>
              <p className="text-sm">Créez votre première alarme ci-dessus</p>
            </div>
          ) : (
            customAlarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  alarm.active 
                    ? 'bg-white/80 border-spiritual-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {getAlarmTypeIcon(alarm.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-semibold">
                        {alarm.time}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        alarm.active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {alarm.active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {alarm.message}
                    </div>
                    <div className="text-xs text-gray-500">
                      {alarm.days.map(day => daysOfWeek.find(d => d.value === day)?.label).join(', ')}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAlarm(alarm.id)}
                  >
                    {alarm.active ? <CheckCircle size={16} /> : <Clock size={16} />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAlarm(alarm.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedNotifications;
