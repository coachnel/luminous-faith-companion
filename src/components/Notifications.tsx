
import React, { useState, useEffect } from 'react';
import { Bell, Clock, CheckCircle, Plus, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Vérifier l'état des permissions de notification
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }

    const savedAlarms = localStorage.getItem('customAlarms');
    if (savedAlarms) {
      setCustomAlarms(JSON.parse(savedAlarms));
    }

    // Démarrer le système de vérification des notifications
    startNotificationSystem();
    
    const interval = setInterval(checkNotifications, 60000); // Vérifier toutes les minutes
    
    return () => clearInterval(interval);
  }, []);

  const startNotificationSystem = () => {
    console.log('📱 Système de notifications démarré');
    checkNotifications();
  };

  const checkNotifications = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const today = now.getDay(); // 0 = dimanche, 1 = lundi, etc.

    // Vérifier les alarmes personnalisées
    customAlarms.forEach(alarm => {
      if (alarm.active && alarm.time === currentTime && alarm.days.includes(today.toString())) {
        showNotification('⏰ Rappel', alarm.message);
      }
    });

    // Vérifier les notifications intelligentes
    checkIntelligentNotifications();
  };

  const checkIntelligentNotifications = () => {
    const lastBibleRead = localStorage.getItem('lastBibleRead');
    const lastNotesCheck = localStorage.getItem('lastNotesReminder');
    const today = new Date().toDateString();
    
    // Notification pour la lecture biblique (une fois par jour)
    if (preferences?.notification_preferences?.dailyVerse && (!lastBibleRead || lastBibleRead !== today)) {
      const now = new Date();
      if (now.getHours() === 8 && now.getMinutes() === 0) { // 8h00
        showNotification(
          "📖 Verset du jour",
          "Découvrez votre verset quotidien pour nourrir votre âme"
        );
      }
    }

    // Notification pour relire les notes
    if (preferences?.notification_preferences?.readingReminder && (!lastNotesCheck || lastNotesCheck !== today)) {
      const notes = JSON.parse(localStorage.getItem('userNotes') || '[]');
      if (notes.length > 0) {
        const now = new Date();
        if (now.getHours() === 19 && now.getMinutes() === 0) { // 19h00
          showNotification(
            "📝 Vos notes spirituelles",
            "Prenez un moment pour relire vos réflexions"
          );
          localStorage.setItem('lastNotesReminder', today);
        }
      }
    }

    // Rappels de prière
    if (preferences?.notification_preferences?.prayerReminder) {
      const prayerTimes = ['08:00', '12:00', '20:00'];
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      if (prayerTimes.includes(currentTime)) {
        showNotification(
          "🙏 Moment de prière",
          "Prenez un instant pour vous recueillir et prier"
        );
      }
    }
  };

  const showNotification = (title: string, message: string) => {
    // Notification toast (toujours visible)
    toast({
      title,
      description: message,
      duration: 5000,
    });

    // Notification native si autorisée
    if (hasPermission && 'Notification' in window) {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      } catch (error) {
        console.warn('Erreur lors de l\'affichage de la notification:', error);
      }
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setHasPermission(permission === 'granted');
        
        if (permission === 'granted') {
          toast({
            title: "✅ Notifications activées",
            description: "Vous recevrez maintenant des rappels spirituels",
          });
          
          // Test de notification
          showNotification('🎉 Notifications activées', 'Vos rappels spirituels sont maintenant opérationnels');
        } else {
          toast({
            title: "ℹ️ Notifications refusées",
            description: "Vous pouvez les activer dans les paramètres de votre navigateur",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Erreur lors de la demande de permission:', error);
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
    
    const alarm = updatedAlarms.find(a => a.id === id);
    toast({
      description: alarm?.active ? "Alarme activée" : "Alarme désactivée",
    });
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
      <Card className="glass border-white/30 bg-white/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BellRing className="text-spiritual-600" size={24} />
            Notifications & Rappels
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Statut du système de notifications */}
      <Card className="glass border-white/30 bg-white/90">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${hasPermission ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <div className="flex-1">
              <h4 className="font-medium">
                {hasPermission ? '✅ Système actif' : '❌ Système inactif'}
              </h4>
              <p className="text-sm text-gray-600">
                {hasPermission 
                  ? 'Les notifications fonctionnent correctement' 
                  : 'Cliquez pour activer les notifications'}
              </p>
            </div>
            {!hasPermission && (
              <Button onClick={requestNotificationPermission} className="bg-green-500 hover:bg-green-600">
                Activer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications intelligentes */}
      <Card className="glass border-white/30 bg-white/90">
        <CardHeader>
          <CardTitle className="text-lg">Notifications intelligentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Verset du jour (8h00)</h4>
              <p className="text-sm text-gray-600">Notification quotidienne avec votre verset</p>
            </div>
            <Button
              variant={preferences?.notification_preferences?.dailyVerse ? "default" : "outline"}
              onClick={() => updateNotificationPreference('dailyVerse', !preferences?.notification_preferences?.dailyVerse)}
              className={preferences?.notification_preferences?.dailyVerse ? "bg-green-500" : ""}
            >
              {preferences?.notification_preferences?.dailyVerse ? 'Activé' : 'Désactivé'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Rappels de prière (8h, 12h, 20h)</h4>
              <p className="text-sm text-gray-600">Moments de prière programmés</p>
            </div>
            <Button
              variant={preferences?.notification_preferences?.prayerReminder ? "default" : "outline"}
              onClick={() => updateNotificationPreference('prayerReminder', !preferences?.notification_preferences?.prayerReminder)}
              className={preferences?.notification_preferences?.prayerReminder ? "bg-green-500" : ""}
            >
              {preferences?.notification_preferences?.prayerReminder ? 'Activé' : 'Désactivé'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Rappel de notes (19h00)</h4>
              <p className="text-sm text-gray-600">Encouragement à relire vos réflexions</p>
            </div>
            <Button
              variant={preferences?.notification_preferences?.readingReminder ? "default" : "outline"}
              onClick={() => updateNotificationPreference('readingReminder', !preferences?.notification_preferences?.readingReminder)}
              className={preferences?.notification_preferences?.readingReminder ? "bg-green-500" : ""}
            >
              {preferences?.notification_preferences?.readingReminder ? 'Activé' : 'Désactivé'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alarmes personnalisées */}
      <Card className="glass border-white/30 bg-white/90">
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
              className="glass border-white/30 bg-white/90"
            />
            <Input
              placeholder="Message de rappel"
              value={newAlarmMessage}
              onChange={(e) => setNewAlarmMessage(e.target.value)}
              className="glass border-white/30 bg-white/90"
            />
            <Button onClick={addCustomAlarm} className="spiritual-gradient">
              <Plus size={18} className="mr-2" />
              Ajouter
            </Button>
          </div>

          <div className="space-y-3">
            {customAlarms.map((alarm) => (
              <div key={alarm.id} className="flex items-center justify-between p-3 rounded-lg bg-white/70 border border-white/30">
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
                    className={alarm.active ? "bg-green-500" : ""}
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
