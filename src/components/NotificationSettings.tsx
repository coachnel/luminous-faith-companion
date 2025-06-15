
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail, Smartphone, TestTube, Settings } from 'lucide-react';
import { useEnhancedNotifications } from '@/hooks/useEnhancedNotifications';
import { toast } from 'sonner';

const NotificationSettings = () => {
  const {
    hasPermission,
    isSupported,
    preferences,
    requestPermission,
    savePreferences,
    testNotifications
  } = useEnhancedNotifications();

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    const newPrefs = { ...preferences, [key]: value };
    savePreferences(newPrefs);
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast.success('Notifications push activées avec succès !');
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Paramètres de notifications
          </CardTitle>
          <CardDescription>
            Configurez comment vous souhaitez recevoir les notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notifications Push */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-blue-500" />
                <div>
                  <Label className="text-base font-medium">Notifications Push</Label>
                  <p className="text-sm text-gray-600">Recevez des notifications dans votre navigateur</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!hasPermission && isSupported && (
                  <Button size="sm" onClick={handleRequestPermission}>
                    Activer
                  </Button>
                )}
                <Switch
                  checked={preferences.pushEnabled && hasPermission}
                  onCheckedChange={(checked) => handlePreferenceChange('pushEnabled', checked)}
                  disabled={!hasPermission}
                />
              </div>
            </div>
            
            {!isSupported && (
              <p className="text-sm text-red-600">
                Les notifications push ne sont pas supportées par votre navigateur
              </p>
            )}
          </div>

          {/* Notifications Email */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-500" />
                <div>
                  <Label className="text-base font-medium">Notifications Email</Label>
                  <p className="text-sm text-gray-600">Recevez des notifications par email</p>
                </div>
              </div>
              <Switch
                checked={preferences.emailEnabled}
                onCheckedChange={(checked) => handlePreferenceChange('emailEnabled', checked)}
              />
            </div>
          </div>

          {/* Types de notifications */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Types de notifications
            </h4>
            
            <div className="space-y-3 ml-6">
              <div className="flex items-center justify-between">
                <Label>Nouveau contenu communautaire</Label>
                <Switch
                  checked={preferences.newContent}
                  onCheckedChange={(checked) => handlePreferenceChange('newContent', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Rappels de défis</Label>
                <Switch
                  checked={preferences.challengeReminders}
                  onCheckedChange={(checked) => handlePreferenceChange('challengeReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Mises à jour communautaires</Label>
                <Switch
                  checked={preferences.communityUpdates}
                  onCheckedChange={(checked) => handlePreferenceChange('communityUpdates', checked)}
                />
              </div>
            </div>
          </div>

          {/* Test des notifications */}
          <div className="border-t pt-4">
            <Button
              onClick={testNotifications}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              Tester les notifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
