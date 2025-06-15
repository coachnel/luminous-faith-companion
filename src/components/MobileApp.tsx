
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
      <div className="min-h-screen bg-gradient-to-br from-heavenly-50 via-spiritual-50 to-purple-50 flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
            <img 
              src="/lovable-uploads/ee59e58d-a594-4372-b796-33f8edb80c6c.png" 
              alt="Luminous Faith" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            Compagnon Spirituel
          </h2>
          <p className="text-purple-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
