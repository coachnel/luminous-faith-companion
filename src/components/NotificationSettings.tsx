
import React from 'react';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, BellRing, Check, X } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

const NotificationSettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [hasPermission, setHasPermission] = React.useState(false);
  const [isSupported, setIsSupported] = React.useState(false);

  React.useEffect(() => {
    // Vérifier le support des notifications
    if ('Notification' in window) {
      setIsSupported(true);
      setHasPermission(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Les notifications ne sont pas supportées par ce navigateur');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      
      setHasPermission(granted);
      
      if (granted) {
        toast.success('Notifications activées avec succès !');
        // Test de notification
        setTimeout(() => {
          new Notification('🎉 Notifications activées !', {
            body: 'Vos rappels spirituels sont maintenant opérationnels',
            icon: '/icons/icon-192x192.png'
          });
        }, 1000);
      } else {
        toast.error('Permission refusée. Vous pouvez l\'activer dans les paramètres de votre navigateur');
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      toast.error('Impossible d\'activer les notifications');
    }
  };

  const updateNotificationPreference = async (key: string, value: boolean) => {
    if (!preferences) return;
    
    try {
      await updatePreferences({
        notification_preferences: {
          ...preferences.notification_preferences,
          [key]: value
        }
      });
      
      toast.success(value ? 'Notification activée' : 'Notification désactivée');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const testNotification = () => {
    if (!hasPermission) {
      toast.error('Veuillez d\'abord activer les notifications');
      return;
    }

    new Notification('🔔 Test de notification', {
      body: 'Votre système de notifications fonctionne parfaitement !',
      icon: '/icons/icon-192x192.png'
    });
    toast.success('Notification de test envoyée');
  };

  return (
    <div className="space-y-6">
      {/* Statut du système */}
      <ModernCard variant="elevated">
        <div className="flex items-center gap-4">
          <div 
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              hasPermission ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {hasPermission ? (
              <Check className="h-6 w-6 text-green-600" />
            ) : (
              <X className="h-6 w-6 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--text-primary)]">
              {hasPermission ? 'Notifications activées' : 'Notifications désactivées'}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {hasPermission 
                ? 'Vous recevrez des rappels spirituels' 
                : isSupported 
                  ? 'Cliquez pour activer les notifications'
                  : 'Les notifications ne sont pas supportées'
              }
            </p>
          </div>
          {!hasPermission && isSupported && (
            <ModernButton onClick={requestPermission}>
              <BellRing className="h-4 w-4 mr-2" />
              Activer
            </ModernButton>
          )}
        </div>
      </ModernCard>

      {/* Paramètres des notifications */}
      {hasPermission && (
        <ModernCard variant="elevated">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">Préférences de notifications</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Personnalisez vos rappels spirituels
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-[var(--text-primary)]">
                  Verset du jour (8h00)
                </Label>
                <p className="text-sm text-[var(--text-secondary)]">
                  Recevez une inspiration quotidienne chaque matin
                </p>
              </div>
              <Switch
                checked={preferences?.notification_preferences?.dailyVerse || false}
                onCheckedChange={(checked) => updateNotificationPreference('dailyVerse', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-[var(--text-primary)]">
                  Rappels de prière (8h, 12h, 20h)
                </Label>
                <p className="text-sm text-[var(--text-secondary)]">
                  Moments de prière programmés dans la journée
                </p>
              </div>
              <Switch
                checked={preferences?.notification_preferences?.prayerReminder || false}
                onCheckedChange={(checked) => updateNotificationPreference('prayerReminder', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-[var(--text-primary)]">
                  Rappel de lecture (19h00)
                </Label>
                <p className="text-sm text-[var(--text-secondary)]">
                  Encouragement à lire votre plan quotidien
                </p>
              </div>
              <Switch
                checked={preferences?.notification_preferences?.readingReminder || false}
                onCheckedChange={(checked) => updateNotificationPreference('readingReminder', checked)}
              />
            </div>

            <div className="pt-4 border-t border-[var(--border-default)]">
              <ModernButton variant="outline" onClick={testNotification} className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                Tester les notifications
              </ModernButton>
            </div>
          </div>
        </ModernCard>
      )}
    </div>
  );
};

export default NotificationSettings;
