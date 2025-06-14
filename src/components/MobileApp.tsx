
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useChallengeCleanup } from '@/hooks/useChallengeCleanup';
import AuthPage from './AuthPage';
import ModernFinanceNavigation from './ModernFinanceNavigation';
import ModernDashboard from './ModernDashboard';
import Discover from './Discover';
import PrayerCircles from './PrayerCircles';
import NotesApp from './NotesApp';
import AdvancedNotifications from './AdvancedNotifications';
import SettingsApp from './SettingsApp';
import DailyChallenges from './DailyChallenges';
import ReadingPlans from './ReadingPlans';
import Prayer from './Prayer';
import PWAUpdatePrompt from './PWAUpdatePrompt';
import { ThemeToggle } from './ThemeToggle';
import { BookOpen } from 'lucide-react';

const MobileApp = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user } = useAuth();
  const { theme } = useTheme();

  // Utiliser le hook de nettoyage des défis
  useChallengeCleanup();

  if (!user) {
    return <AuthPage />;
  }

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <ModernDashboard onNavigate={handleNavigate} />;
      case 'discover':
        return <Discover />;
      case 'prayer-circles':
        return <PrayerCircles />;
      case 'notes':
        return <NotesApp />;
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
        return <ModernDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div 
      className="min-h-screen transition-all duration-300 relative"
      style={{ 
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #12121A 0%, #1E1E2A 50%, #2A2A3F 100%)'
          : 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 50%, #F0F0F2 100%)',
        color: 'var(--text-primary)'
      }}
    >
      {/* PWA Update Prompt */}
      <PWAUpdatePrompt />

      {/* Header moderne simplifié */}
      {activeSection !== 'dashboard' && (
        <header 
          className="sticky top-0 z-40 backdrop-blur-lg"
          style={{
            background: theme === 'dark' 
              ? 'rgba(30, 30, 42, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
            borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
          }}
        >
          <div className="px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0066FF, #0052CC)' }}
              >
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-sm text-[var(--text-primary)]">
                  BibleApp
                </h1>
              </div>
            </div>
            
            <ThemeToggle />
          </div>
        </header>
      )}

      <main className={`${activeSection !== 'dashboard' ? 'pb-20' : 'pb-24'} min-h-screen`}>
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
      
      <ModernFinanceNavigation 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
      />
    </div>
  );
};

export default MobileApp;
