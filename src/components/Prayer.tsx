
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Clock, Users, Settings as SettingsIcon } from 'lucide-react';
import PrayerReminder from './PrayerReminder';
import PrayerSharing from './PrayerSharing';
import PrayerTimeSettings from './PrayerTimeSettings';

const Prayer = () => {
  const [activeTab, setActiveTab] = useState('prayer');

  const defaultReminderTimes = ['06:00', '12:00', '18:00', '21:00'];

  const handlePrayerCompleted = () => {
    console.log('Prière complétée');
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 max-w-4xl mx-auto min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* En-tête moderne unifié */}
      <div className="bg-[var(--bg-card)] border-[var(--border-default)] rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--accent-primary)' }}
          >
            <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text-primary)] break-words">
              Prière
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] break-words">
              Votre espace de communion et de partage
            </p>
          </div>
        </div>
      </div>

      {/* Onglets modernes */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[var(--bg-card)] border-[var(--border-default)]">
          <TabsTrigger value="prayer" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xxs:inline">Prière</span>
          </TabsTrigger>
          <TabsTrigger value="sharing" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xxs:inline">Partage</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <SettingsIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xxs:inline">Horaires</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prayer" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <PrayerReminder 
            reminderTimes={defaultReminderTimes}
            onPrayerCompleted={handlePrayerCompleted}
          />
        </TabsContent>

        <TabsContent value="sharing" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <PrayerSharing />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <PrayerTimeSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Prayer;
