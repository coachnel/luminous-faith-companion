import React from 'react';
import { User, Bell, Globe, Info, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useUserPreferences } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';

const SettingsApp = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { preferences, updatePreferences } = useUserPreferences();

  const handleNotificationToggle = async (type: string, value: boolean) => {
    if (!preferences) return;
    
    try {
      await updatePreferences({
        notification_preferences: {
          ...preferences.notification_preferences,
          [type]: value,
        },
      });
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
        description: "Langue mise à jour",
      });
    } catch (error) {
      toast({
        description: "Erreur lors de la mise à jour",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Profile Section */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full spiritual-gradient flex items-center justify-center">
              <span className="text-white text-xl">
                {profile?.name?.charAt(0)?.toUpperCase() || '👤'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{profile?.name || 'Utilisateur'}</h3>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe size={20} />
            Langue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={preferences?.language || 'fr'} 
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="glass border-white/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-white/30 backdrop-blur-md">
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Verset du jour</p>
              <p className="text-sm text-gray-600">Recevoir le verset quotidien</p>
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
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={20} />
            À propos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Compagnon spirituel v1.0</p>
            <p>Une application pour accompagner votre parcours spirituel</p>
            <p>Développé par Nel Brunel MANKOU pour la communauté chrétienne</p>
          </div>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card className="glass border-white/30 border-red-200">
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
