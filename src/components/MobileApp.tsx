
import React, { useState, useCallback, useMemo } from 'react';
import ModernFinanceNavigation from './ModernFinanceNavigation';
import ModernDashboard from './ModernDashboard';
import Prayer from './Prayer';
import NotesApp from './NotesApp';
import DailyChallenges from './DailyChallenges';
import ReadingPlans from './ReadingPlans';
import Discover from './Discover';
import PrayerCircles from './PrayerCircles';
import SettingsApp from './SettingsApp';
import CommunityPage from './CommunityPage';
import TestimonyPage from './TestimonyPage';
import PWAUpdatePrompt from './PWAUpdatePrompt';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from './AuthPage';
import { useDataCleanup } from '@/hooks/useDataCleanup';

type AppSection = 'dashboard' | 'prayer' | 'notes' | 'challenges' | 'reading-plans' | 'discover' | 'prayer-circles' | 'settings' | 'community' | 'testimony';

const MobileApp = () => {
  const { user, loading } = useAuth();
  const [currentSection, setCurrentSection] = useState<AppSection>('dashboard');
  
  useDataCleanup();

  const handleNavigation = useCallback((section: string) => {
    const sectionMap: Record<string, AppSection> = {
      '/': 'dashboard',
      '/dashboard': 'dashboard',
      '/prayer': 'prayer',
      '/notes': 'notes',
      '/challenges': 'challenges',
      '/reading-plans': 'reading-plans',
      '/discover': 'discover',
      '/prayer-circles': 'prayer-circles',
      '/settings': 'settings',
      '/community': 'community',
      '/testimony': 'testimony',
      'dashboard': 'dashboard',
      'prayer': 'prayer',
      'notes': 'notes',
      'challenges': 'challenges',
      'reading-plans': 'reading-plans',
      'discover': 'discover',
      'prayer-circles': 'prayer-circles',
      'settings': 'settings',
      'community': 'community',
      'testimony': 'testimony'
    };
    
    const targetSection = sectionMap[section] || 'dashboard';
    setCurrentSection(targetSection);
  }, []);

  const renderSection = useMemo(() => {
    const sections = {
      dashboard: <ModernDashboard onNavigate={handleNavigation} />,
      prayer: <Prayer />,
      notes: <NotesApp />,
      challenges: <DailyChallenges />,
      'reading-plans': <ReadingPlans />,
      discover: <Discover />,
      'prayer-circles': <PrayerCircles />,
      settings: <SettingsApp />,
      community: <CommunityPage />,
      testimony: <TestimonyPage />
    };

    return sections[currentSection] || sections.dashboard;
  }, [currentSection, handleNavigation]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mx-auto">
            <img 
              src="/lovable-uploads/ee59e58d-a594-4372-b796-33f8edb80c6c.png" 
              alt="Luminous Faith" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-base text-gray-600 font-medium">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col">
      <PWAUpdatePrompt />
      <div className="flex-1 overflow-auto pb-20">
        {renderSection}
      </div>
      <ModernFinanceNavigation 
        currentSection={currentSection} 
        onNavigate={handleNavigation} 
      />
    </div>
  );
};

export default MobileApp;
