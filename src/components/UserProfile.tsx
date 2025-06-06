
import React from 'react';
import { User, Settings, BarChart3, Heart, Book, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { UserProfile as UserProfileType } from '../types';

interface UserProfileProps {
  profile: UserProfileType;
  onUpdateProfile: (updates: Partial<UserProfileType>) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ profile, onUpdateProfile }) => {
  const handleNotificationToggle = (type: keyof UserProfileType['preferences']['notifications'], value: boolean) => {
    onUpdateProfile({
      preferences: {
        ...profile.preferences,
        notifications: {
          ...profile.preferences.notifications,
          [type]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full spiritual-gradient flex items-center justify-center">
            <User size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold glow-text">{profile.name}</h2>
            <p className="text-gray-600">Membre depuis aujourd'hui</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="verse-card">
          <CardContent className="p-4 text-center">
            <Book className="mx-auto mb-2 text-spiritual-600" size={24} />
            <div className="text-2xl font-bold">{profile.stats.versesRead}</div>
            <div className="text-sm text-gray-600">Versets lus</div>
          </CardContent>
        </Card>

        <Card className="verse-card">
          <CardContent className="p-4 text-center">
            <Heart className="mx-auto mb-2 text-red-500" size={24} />
            <div className="text-2xl font-bold">{profile.favoriteVerses.length}</div>
            <div className="text-sm text-gray-600">Favoris</div>
          </CardContent>
        </Card>

        <Card className="verse-card">
          <CardContent className="p-4 text-center">
            <Calendar className="mx-auto mb-2 text-green-500" size={24} />
            <div className="text-2xl font-bold">{profile.stats.daysActive}</div>
            <div className="text-sm text-gray-600">Jours actifs</div>
          </CardContent>
        </Card>

        <Card className="verse-card">
          <CardContent className="p-4 text-center">
            <BarChart3 className="mx-auto mb-2 text-blue-500" size={24} />
            <div className="text-2xl font-bold">{profile.stats.notesWritten}</div>
            <div className="text-sm text-gray-600">Notes écrites</div>
          </CardContent>
        </Card>
      </div>

      <Card className="verse-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
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
              checked={profile.preferences.notifications.dailyVerse}
              onCheckedChange={(value) => handleNotificationToggle('dailyVerse', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Rappels de prière</p>
              <p className="text-sm text-gray-600">Notifications pour vos heures de prière</p>
            </div>
            <Switch
              checked={profile.preferences.notifications.prayerReminder}
              onCheckedChange={(value) => handleNotificationToggle('prayerReminder', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Rappels de lecture</p>
              <p className="text-sm text-gray-600">Encouragement à lire la Bible</p>
            </div>
            <Switch
              checked={profile.preferences.notifications.readingReminder}
              onCheckedChange={(value) => handleNotificationToggle('readingReminder', value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="verse-card">
        <CardHeader>
          <CardTitle>Version de la Bible</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Version actuelle: <span className="font-semibold">{profile.preferences.bibleVersion}</span></p>
          <p className="text-sm text-gray-500 mt-2">Plus de versions seront bientôt disponibles</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
