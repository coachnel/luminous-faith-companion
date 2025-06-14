
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, BellRing, Check, X } from 'lucide-react';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { useUserPreferences } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

const NotificationSettings = () => {
  const { permission, requestPermission, sendNotification } = useNotificationSystem();
  const { preferences, updatePreferences } = useUserPreferences();

  const handlePermissionRequest = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast.success('Notifications activées avec succès !');
      // Test de notification
      setTimeout(() => {
        sendNotification(
          '🎉 Notifications activées !',
          { body: 'Vos rappels spirituels sont maintenant opérationnels' }
        );
      }, 1000);
    } else {
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
    sendNotification(
      '🔔 Test de notification',
      { body: 'Votre système de notifications fonctionne parfaitement !' }
    );
    toast.success('Notification de test envoyée');
  };

  return (
    <div className="space-y-6">
      {/* Statut du système */}
      <ModernCard variant="elevated">
        <div className="flex items-center gap-4">
          <div 
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              permission.granted ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {permission.granted ? (
              <Check className="h-6 w-6 text-green-600" />
            ) : (
              <X className="h-6 w-6 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--text-primary)]">
              {permission.granted ? 'Notifications activées' : 'Notifications désactivées'}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {permission.granted 
                ? 'Vous recevrez des rappels spirituels' 
                : permission.error || 'Cliquez pour activer les notifications'
              }
            </p>
          </div>
          {!permission.granted && permission.supported && (
            <ModernButton onClick={handlePermissionRequest}>
              <BellRing className="h-4 w-4 mr-2" />
              Activer
            </ModernButton>
          )}
        </div>
      </ModernCard>

      {/* Paramètres des notifications */}
      {permission.granted && (
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
