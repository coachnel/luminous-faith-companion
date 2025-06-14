
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { theme } = useTheme();

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
    <div 
      className={`min-h-screen transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}
      style={{ 
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)'
      }}
    >
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
