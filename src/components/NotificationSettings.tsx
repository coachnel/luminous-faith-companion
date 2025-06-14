
import React from 'react';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, BellRing, Check, X, AlertCircle } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useSupabaseData';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { toast } from 'sonner';

const NotificationSettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { 
    hasPermission, 
    isSupported, 
    requestPermission, 
    testNotification,
    isLoading 
  } = useNotificationSystem();

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
      console.error('Error updating notification preference:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleTestNotification = () => {
    if (!hasPermission) {
      toast.error('Veuillez d\'abord activer les notifications');
      return;
    }
    testNotification();
  };

  return (
    <div className="space-y-6">
      {/* Statut du système */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex items-center gap-4">
          <div 
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
              hasPermission ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
            }`}
          >
            {hasPermission ? (
              <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
            ) : (
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--text-primary)] truncate">
              {hasPermission ? 'Notifications activées' : 'Notifications désactivées'}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] break-words">
              {hasPermission 
                ? 'Vous recevrez des rappels' 
                : isSupported 
                  ? 'Cliquez pour activer les notifications'
                  : 'Les notifications ne sont pas supportées'
              }
            </p>
          </div>
          {!hasPermission && isSupported && (
            <ModernButton 
              onClick={requestPermission}
              disabled={isLoading}
              className="flex-shrink-0"
            >
              <BellRing className="h-4 w-4 mr-2" />
              {isLoading ? 'Activation...' : 'Activer'}
            </ModernButton>
          )}
        </div>
      </ModernCard>

      {/* Avertissement si pas de support */}
      {!isSupported && (
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[var(--text-primary)]">Support limité</h3>
              <p className="text-sm text-[var(--text-secondary)] break-words">
                Votre navigateur ne supporte pas les notifications push. Utilisez un navigateur moderne pour une meilleure expérience.
              </p>
            </div>
          </div>
        </ModernCard>
      )}

      {/* Paramètres des notifications */}
      {hasPermission && (
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--accent-primary)' }}
            >
              <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] truncate">Préférences de notifications</h3>
              <p className="text-sm text-[var(--text-secondary)] truncate">
                Personnalisez vos rappels
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Label className="text-base font-medium text-[var(--text-primary)] block">
                  Verset du jour (8h00)
                </Label>
                <p className="text-sm text-[var(--text-secondary)] break-words">
                  Recevez une inspiration quotidienne chaque matin
                </p>
              </div>
              <Switch
                checked={preferences?.notification_preferences?.dailyVerse || false}
                onCheckedChange={(checked) => updateNotificationPreference('dailyVerse', checked)}
                className="flex-shrink-0"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Label className="text-base font-medium text-[var(--text-primary)] block">
                  Rappels de prière (8h, 12h, 20h)
                </Label>
                <p className="text-sm text-[var(--text-secondary)] break-words">
                  Moments de prière programmés dans la journée
                </p>
              </div>
              <Switch
                checked={preferences?.notification_preferences?.prayerReminder || false}
                onCheckedChange={(checked) => updateNotificationPreference('prayerReminder', checked)}
                className="flex-shrink-0"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Label className="text-base font-medium text-[var(--text-primary)] block">
                  Rappel de lecture (19h00)
                </Label>
                <p className="text-sm text-[var(--text-secondary)] break-words">
                  Encouragement à lire votre plan quotidien
                </p>
              </div>
              <Switch
                checked={preferences?.notification_preferences?.readingReminder || false}
                onCheckedChange={(checked) => updateNotificationPreference('readingReminder', checked)}
                className="flex-shrink-0"
              />
            </div>

            <div className="pt-4 border-t border-[var(--border-default)]">
              <ModernButton variant="outline" onClick={handleTestNotification} className="w-full">
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
