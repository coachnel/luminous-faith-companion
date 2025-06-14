
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from './AuthPage';
import ExpandedNavigation from './ExpandedNavigation';
import RealTimeDashboard from './RealTimeDashboard';
import EnhancedBibleView from './EnhancedBibleView';
import PrayerCircles from './PrayerCircles';
import RichTextNotesApp from './RichTextNotesApp';
import FavoriteVerses from './FavoriteVerses';
import AdvancedNotifications from './AdvancedNotifications';
import SettingsApp from './SettingsApp';
import DailyChallenges from './DailyChallenges';
import ReadingPlans from './ReadingPlans';
import Prayer from './Prayer';

const MobileApp = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user } = useAuth();

  if (!user) {
    return <AuthPage />;
  }

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <RealTimeDashboard onNavigate={handleNavigate} />;
      case 'bible':
        return <EnhancedBibleView />;
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
      case 'challenges':
        return <DailyChallenges />;
      case 'reading-plans':
        return <ReadingPlans />;
      case 'prayer':
        return <Prayer />;
      default:
        return <RealTimeDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <main className="pb-20">
        {renderContent()}
      </main>
      <ExpandedNavigation 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
      />
    </div>
  );
};

export default MobileApp;
