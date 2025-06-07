
import React, { useState, useEffect } from 'react';
import { Bell, Clock, CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserPreferences } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';

interface CustomAlarm {
  id: string;
  time: string;
  message: string;
  days: string[];
  active: boolean;
}

const Notifications = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [customAlarms, setCustomAlarms] = useState<CustomAlarm[]>([]);
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [newAlarmMessage, setNewAlarmMessage] = useState('');

  useEffect(() => {
    const savedAlarms = localStorage.getItem('customAlarms');
    if (savedAlarms) {
      setCustomAlarms(JSON.parse(savedAlarms));
    }

    // Vérifier les notifications intelligentes
    checkIntelligentNotifications();
    
    // Configurer la vérification périodique
    const interval = setInterval(checkIntelligentNotifications, 60000); // Toutes les minutes
    
    return () => clearInterval(interval);
  }, []);

  const checkIntelligentNotifications = () => {
    const lastBibleRead = localStorage.getItem('lastBibleRead');
    const lastNotesCheck = localStorage.getItem('lastNotesReminder');
    const today = new Date().toDateString();
    
    // Notification pour la lecture biblique
    if (!lastBibleRead || lastBibleRead !== today) {
      const daysSinceRead = lastBibleRead ? 
        Math.floor((new Date().getTime() - new Date(lastBibleRead).getTime()) / (1000 * 60 * 60 * 24)) : 1;
      
      if (daysSinceRead >= 1) {
        showNotification(
          "📖 Lecture biblique",
          daysSinceRead === 1 ? 
            "Vous n'avez pas lu la Bible aujourd'hui" : 
            `Vous n'avez pas lu la Bible depuis ${daysSinceRead} jours`
        );
      }
    }

    // Notification pour relire les notes
    if (!lastNotesCheck || lastNotesCheck !== today) {
      const notes = JSON.parse(localStorage.getItem('userNotes') || '[]');
      if (notes.length > 0) {
        showNotification(
          "📝 Vos notes",
          "N'oubliez pas de relire vos réflexions spirituelles"
        );
        localStorage.setItem('lastNotesReminder', today);
      }
    }
  };

  const showNotification = (title: string, message: string) => {
    // Notification toast
    toast({
      title,
      description: message,
      duration: 5000,
    });

    // Notification native si autorisée
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico'
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "✅ Notifications activées",
          description: "Vous recevrez maintenant des rappels spirituels",
        });
      }
    }
  };

  const addCustomAlarm = () => {
    if (!newAlarmTime || !newAlarmMessage) {
      toast({
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const newAlarm: CustomAlarm = {
      id: Date.now().toString(),
      time: newAlarmTime,
      message: newAlarmMessage,
      days: ['1', '2', '3', '4', '5', '6', '0'], // Tous les jours par défaut
      active: true
    };

    const updatedAlarms = [...customAlarms, newAlarm];
    setCustomAlarms(updatedAlarms);
    localStorage.setItem('customAlarms', JSON.stringify(updatedAlarms));
    
    setNewAlarmTime('');
    setNewAlarmMessage('');
    
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
    localStorage.setItem('customAlarms', JSON.stringify(updatedAlarms));
  };

  const removeAlarm = (id: string) => {
    const updatedAlarms = customAlarms.filter(alarm => alarm.id !== id);
    setCustomAlarms(updatedAlarms);
    localStorage.setItem('customAlarms', JSON.stringify(updatedAlarms));
    
    toast({
      description: "Alarme supprimée",
    });
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
            Notifications & Rappels
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Demande de permission */}
      {Notification.permission !== 'granted' && (
        <Card className="glass border-white/30 border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Bell className="text-orange-600" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-orange-700">Activer les notifications</h4>
                <p className="text-sm text-gray-600">Autorisez les notifications pour recevoir vos rappels spirituels</p>
              </div>
              <Button onClick={requestNotificationPermission} className="bg-orange-500 hover:bg-orange-600">
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
              <p className="text-sm text-gray-600">Vous rappelle si vous n'avez pas lu la Bible</p>
            </div>
            <Button
              variant={preferences?.notification_preferences?.dailyVerse ? "default" : "outline"}
              onClick={() => updateNotificationPreference('dailyVerse', !preferences?.notification_preferences?.dailyVerse)}
            >
              {preferences?.notification_preferences?.dailyVerse ? 'Activé' : 'Désactivé'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Rappel de prière</h4>
              <p className="text-sm text-gray-600">Moments de prière programmés</p>
            </div>
            <Button
              variant={preferences?.notification_preferences?.prayerReminder ? "default" : "outline"}
              onClick={() => updateNotificationPreference('prayerReminder', !preferences?.notification_preferences?.prayerReminder)}
            >
              {preferences?.notification_preferences?.prayerReminder ? 'Activé' : 'Désactivé'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Rappel de notes</h4>
              <p className="text-sm text-gray-600">Vous encourage à relire vos réflexions</p>
            </div>
            <Button
              variant={preferences?.notification_preferences?.readingReminder ? "default" : "outline"}
              onClick={() => updateNotificationPreference('readingReminder', !preferences?.notification_preferences?.readingReminder)}
            >
              {preferences?.notification_preferences?.readingReminder ? 'Activé' : 'Désactivé'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alarmes personnalisées */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="text-lg">Alarmes personnalisées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="time"
              placeholder="Heure"
              value={newAlarmTime}
              onChange={(e) => setNewAlarmTime(e.target.value)}
              className="glass border-white/30"
            />
            <Input
              placeholder="Message de rappel"
              value={newAlarmMessage}
              onChange={(e) => setNewAlarmMessage(e.target.value)}
              className="glass border-white/30"
            />
            <Button onClick={addCustomAlarm} className="spiritual-gradient">
              <Plus size={18} className="mr-2" />
              Ajouter
            </Button>
          </div>

          <div className="space-y-3">
            {customAlarms.map((alarm) => (
              <div key={alarm.id} className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-white/30">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-spiritual-600" />
                  <div>
                    <div className="font-medium">{alarm.time}</div>
                    <div className="text-sm text-gray-600">{alarm.message}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={alarm.active ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAlarm(alarm.id)}
                  >
                    {alarm.active ? <CheckCircle size={16} /> : <Clock size={16} />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeAlarm(alarm.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {customAlarms.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              <Clock className="mx-auto mb-2" size={48} />
              <p>Aucune alarme personnalisée</p>
              <p className="text-sm">Créez des rappels pour vos moments spirituels</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
