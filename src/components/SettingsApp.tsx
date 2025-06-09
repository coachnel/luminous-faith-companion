
import React from 'react';
import { User, Bell, Globe, Info, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useUserPreferences } from '@/hooks/useSupabaseData';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/translations';
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
      
      // Recharger la page après un délai pour appliquer la nouvelle langue
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
    <div className="p-4 space-y-4">
      {/* Photo de profil */}
      <ProfilePhoto />

      {/* Profile Section */}
      <Card className="glass border-white/30 bg-white/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            {t('profile')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Nom</p>
              <p className="font-medium">{profile?.name || 'Non défini'}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Membre depuis</p>
              <p className="font-medium">
                {new Date(profile?.created_at || '').toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Dernière connexion</p>
              <p className="font-medium">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card className="glass border-white/30 bg-white/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe size={20} />
            {t('language')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={preferences?.language || 'fr'} 
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="glass border-white/30 bg-white/90">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-white/30 backdrop-blur-md bg-white/95">
              <SelectItem value="fr">🇫🇷 Français</SelectItem>
              <SelectItem value="en">🇺🇸 English</SelectItem>
              <SelectItem value="es">🇪🇸 Español</SelectItem>
              <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-2">
            La page se rechargera automatiquement pour appliquer la nouvelle langue
          </p>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="glass border-white/30 bg-white/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} />
            {t('notifications')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Verset du jour</p>
              <p className="text-sm text-gray-600">Recevoir le verset quotidien (7h00)</p>
            </div>
            <Switch
              checked={preferences?.notification_preferences?.dailyVerse || false}
              onCheckedChange={(value) => handleNotificationToggle('dailyVerse', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Rappels de prière</p>
              <p className="text-sm text-gray-600">Notifications pour vos heures de prière</p>
            </div>
            <Switch
              checked={preferences?.notification_preferences?.prayerReminder || false}
              onCheckedChange={(value) => handleNotificationToggle('prayerReminder', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Rappels de lecture</p>
              <p className="text-sm text-gray-600">Encouragement à lire la Bible</p>
            </div>
            <Switch
              checked={preferences?.notification_preferences?.readingReminder || false}
              onCheckedChange={(value) => handleNotificationToggle('readingReminder', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="glass border-white/30 bg-white/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={20} />
            À propos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Compagnon spirituel v2.0</p>
            <p>Une application complète pour accompagner votre parcours spirituel</p>
            <p>✅ Bible complète (73 livres)</p>
            <p>✅ Notes enrichies avec partage</p>
            <p>✅ Notifications en temps réel</p>
            <p>✅ Interface multilingue</p>
            <p className="text-xs text-green-600 font-medium">🚀 Application stabilisée et déployée</p>
          </div>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card className="glass border-white/30 border-red-200 bg-white/90">
        <CardContent className="p-4">
          <Button
            onClick={signOut}
            variant="destructive"
            className="w-full"
          >
            <LogOut size={18} className="mr-2" />
            Se déconnecter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsApp;
