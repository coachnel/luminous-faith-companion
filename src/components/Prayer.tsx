
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div 
      className="min-h-screen p-2 xs:p-3 sm:p-4 space-y-3 sm:space-y-4 max-w-7xl mx-auto pb-20"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* En-tête moderne unifié */}
      <Card className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <CardHeader className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div 
              className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent-primary)' }}
            >
              <Heart className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text-primary)] break-words">
                Prière
              </CardTitle>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] break-words">
                Votre espace de communion et de partage
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Onglets modernes - Responsive */}
      <Card className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[var(--bg-secondary)] border-[var(--border-default)] m-2 sm:m-3 h-auto">
            <TabsTrigger 
              value="prayer" 
              className="gap-1 sm:gap-2 text-[10px] xs:text-xs sm:text-sm p-2 sm:p-3 data-[state=active]:bg-[var(--bg-card)] data-[state=active]:text-[var(--text-primary)]"
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xxs:inline">Prière</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sharing" 
              className="gap-1 sm:gap-2 text-[10px] xs:text-xs sm:text-sm p-2 sm:p-3 data-[state=active]:bg-[var(--bg-card)] data-[state=active]:text-[var(--text-primary)]"
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xxs:inline">Partage</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="gap-1 sm:gap-2 text-[10px] xs:text-xs sm:text-sm p-2 sm:p-3 data-[state=active]:bg-[var(--bg-card)] data-[state=active]:text-[var(--text-primary)]"
            >
              <SettingsIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xxs:inline">Horaires</span>
            </TabsTrigger>
          </TabsList>

          <div className="p-2 sm:p-3">
            <TabsContent value="prayer" className="space-y-3 sm:space-y-4 mt-0">
              <PrayerReminder 
                reminderTimes={defaultReminderTimes}
                onPrayerCompleted={handlePrayerCompleted}
              />
            </TabsContent>

            <TabsContent value="sharing" className="space-y-3 sm:space-y-4 mt-0">
              <PrayerSharing />
            </TabsContent>

            <TabsContent value="settings" className="space-y-3 sm:space-y-4 mt-0">
              <PrayerTimeSettings />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default Prayer;
