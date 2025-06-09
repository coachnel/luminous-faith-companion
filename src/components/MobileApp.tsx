import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from './AuthPage';
import AppShell from './AppShell';
import RealTimeDashboard from './RealTimeDashboard';
import BibleReader from './BibleReader';
import PrayerCircles from './PrayerCircles';
import RichTextNotesApp from './RichTextNotesApp';
import FavoriteVerses from './FavoriteVerses';
import AdvancedNotifications from './AdvancedNotifications';
import SettingsApp from './SettingsApp';

const MobileApp = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user } = useAuth();

  if (!user) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <RealTimeDashboard />;
      case 'bible':
        return <BibleReader />;
      case 'prayer-circles':
        return <PrayerCircles />;
      case 'notes':
        return <RichTextNotesApp />;
      case 'favorites':
        return <FavoriteVerses />;
      case 'notifications':
        return <AdvancedNotifications />;
      case 'settings':
        return <SettingsApp />;
      default:
        return <RealTimeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <AppShell 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
      />
      <main className="pb-20">
        {renderContent()}
      </main>
    </div>
  );
};

export default MobileApp;
