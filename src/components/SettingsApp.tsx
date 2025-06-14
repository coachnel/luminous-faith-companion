
import React from 'react';
import { User, Bell, Globe, Info, LogOut } from 'lucide-react';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useUserPreferences } from '@/hooks/useSupabaseData';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/translations';
import { ThemeToggle } from './ThemeToggle';
import { ThemeSettings } from './ThemeSettings';
import ProfilePhoto from './ProfilePhoto';

const SettingsApp = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { preferences, updatePreferences } = useUserPreferences();
  const { scheduleDailyReminders } = useNotifications();
  const { t } = useTranslation(preferences?.language || 'fr');

  const handleNotificationToggle = async (type: string, value: boolean) => {
    if (!preferences) return;
    
    try {
      await updatePreferences({
        notification_preferences: {
          ...preferences.notification_preferences,
          [type]: value,
        },
      });
      
      if (value) {
        scheduleDailyReminders();
      }
      
      toast({
        description: "Préférences mises à jour",
      });
    } catch (error) {
      toast({
        description: "Erreur lors de la mise à jour",
        variant: "destructive",
      });
    }
  };

  const handleLanguageChange = async (language: string) => {
    if (!preferences) return;
    
    try {
      await updatePreferences({
        language: language,
      });
      toast({
        description: "Langue mise à jour - Rechargez la page pour voir les changements",
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast({
        description: "Erreur lors de la mise à jour",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header avec toggle de thème */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Paramètres</h1>
          <p className="text-[var(--text-secondary)]">Personnalisez votre expérience</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Photo de profil */}
      <ProfilePhoto />

      {/* Profile Section */}
      <ModernCard variant="elevated" className="animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{t('profile')}</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-[var(--text-tertiary)] font-medium">Nom</p>
            <p className="text-[var(--text-primary)]">{profile?.name || 'Non défini'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[var(--text-tertiary)] font-medium">Email</p>
            <p className="text-[var(--text-primary)] truncate">{user?.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[var(--text-tertiary)] font-medium">Membre depuis</p>
            <p className="text-[var(--text-primary)]">
              {new Date(profile?.created_at || '').toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[var(--text-tertiary)] font-medium">Dernière connexion</p>
            <p className="text-[var(--text-primary)]">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </ModernCard>

      {/* Paramètres de thème */}
      <ThemeSettings />

      {/* Language */}
      <ModernCard variant="elevated" className="animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{t('language')}</h3>
        </div>
        
        <Select 
          value={preferences?.language || 'fr'} 
          onValueChange={handleLanguageChange}
        >
          <SelectTrigger className="bg-[var(--bg-secondary)] border-[var(--border-default)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[var(--bg-card)] border-[var(--border-default)]">
            <SelectItem value="fr">🇫🇷 Français</SelectItem>
            <SelectItem value="en">🇺🇸 English</SelectItem>
            <SelectItem value="es">🇪🇸 Español</SelectItem>
            <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-[var(--text-tertiary)] mt-2">
          La page se rechargera automatiquement pour appliquer la nouvelle langue
        </p>
      </ModernCard>

      {/* Notifications */}
      <ModernCard variant="elevated" className="animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-warning)] flex items-center justify-center">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{t('notifications')}</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-xl">
            <div>
              <p className="font-medium text-[var(--text-primary)]">Verset du jour</p>
              <p className="text-sm text-[var(--text-secondary)]">Recevoir le verset quotidien (7h00)</p>
            </div>
            <Switch
              checked={preferences?.notification_preferences?.dailyVerse || false}
              onCheckedChange={(value) => handleNotificationToggle('dailyVerse', value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-xl">
            <div>
              <p className="font-medium text-[var(--text-primary)]">Rappels de prière</p>
              <p className="text-sm text-[var(--text-secondary)]">Notifications pour vos heures de prière</p>
            </div>
            <Switch
              checked={preferences?.notification_preferences?.prayerReminder || false}
              onCheckedChange={(value) => handleNotificationToggle('prayerReminder', value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-xl">
            <div>
              <p className="font-medium text-[var(--text-primary)]">Rappels de lecture</p>
              <p className="text-sm text-[var(--text-secondary)]">Encouragement à lire la Bible</p>
            </div>
            <Switch
              checked={preferences?.notification_preferences?.readingReminder || false}
              onCheckedChange={(value) => handleNotificationToggle('readingReminder', value)}
            />
          </div>
        </div>
      </ModernCard>

      {/* About */}
      <ModernCard variant="glass" className="animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-secondary)] flex items-center justify-center">
            <Info className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">À propos</h3>
        </div>
        
        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
          <p className="font-medium text-[var(--text-primary)]">Compagnon spirituel v2.0</p>
          <p>Une application complète pour accompagner votre parcours spirituel</p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <p>✅ Bible complète (73 livres)</p>
            <p>✅ Notes enrichies avec partage</p>
            <p>✅ Notifications en temps réel</p>
            <p>✅ Interface multilingue</p>
          </div>
          <p className="text-xs text-[var(--accent-success)] font-medium mt-3">
            🚀 Application modernisée avec thèmes dynamiques
          </p>
        </div>
      </ModernCard>

      {/* Sign Out */}
      <ModernCard variant="outlined" className="border-red-200 animate-slide-up">
        <ModernButton
          onClick={signOut}
          variant="primary"
          className="w-full bg-red-500 hover:bg-red-600"
        >
          <LogOut size={18} className="mr-2" />
          Se déconnecter
        </ModernButton>
      </ModernCard>
    </div>
  );
};

export default SettingsApp;
