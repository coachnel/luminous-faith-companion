
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
import { ThemeToggle } from './ThemeToggle';
import { BookOpen } from 'lucide-react';

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
      className="min-h-screen transition-all duration-300"
      style={{ 
        background: `var(--bg-primary)`
      }}
    >
      {/* Header moderne avec toggle de thème */}
      <header className="sticky top-0 z-40 bg-[var(--bg-card)] border-b border-[var(--border-default)] backdrop-blur-lg">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--spiritual-primary)] flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-[var(--text-primary)]">BibleApp</h1>
              <p className="text-xs text-[var(--text-tertiary)]">Compagnon spirituel</p>
            </div>
          </div>
          
          <ThemeToggle />
        </div>
      </header>

      <main className="pb-20 min-h-[calc(100vh-80px)]">
        <div className="animate-slide-up">
          {renderContent()}
        </div>
      </main>
      
      <ExpandedNavigation 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
      />
    </div>
  );
};

export default MobileApp;
