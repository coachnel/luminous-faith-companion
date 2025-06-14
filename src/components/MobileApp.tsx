
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
import PWAUpdatePrompt from './PWAUpdatePrompt';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from './AuthPage';
import { useDataCleanup } from '@/hooks/useDataCleanup';

type AppSection = 'dashboard' | 'prayer' | 'notes' | 'challenges' | 'reading-plans' | 'discover' | 'prayer-circles' | 'settings';

const MobileApp = () => {
  const { user, loading } = useAuth();
  const [currentSection, setCurrentSection] = useState<AppSection>('dashboard');
  
  // Initialiser le nettoyage automatique des données
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
      '/settings': 'settings'
    };
    
    const targetSection = sectionMap[section] || 'dashboard';
    setCurrentSection(targetSection);
  }, []);

  // Create a wrapper function for navigation that accepts string and converts to AppSection
  const handleNavigationFromNav = useCallback((section: string) => {
    const validSection = section as AppSection;
    setCurrentSection(validSection);
  }, []);

  // Mémoiser le rendu des sections pour optimiser les performances
  const renderSection = useMemo(() => {
    const sections = {
      dashboard: <ModernDashboard onNavigate={handleNavigation} />,
      prayer: <Prayer />,
      notes: <NotesApp />,
      challenges: <DailyChallenges />,
      'reading-plans': <ReadingPlans />,
      discover: <Discover />,
      'prayer-circles': <PrayerCircles />,
      settings: <SettingsApp />
    };

    return sections[currentSection] || sections.dashboard;
  }, [currentSection, handleNavigation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
            <img 
              src="/lovable-uploads/ee59e58d-a594-4372-b796-33f8edb80c6c.png" 
              alt="Luminous Faith" 
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-gray-600 dark:text-gray-400 font-medium">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <PWAUpdatePrompt />
      <div className="pb-20 lg:pb-0">
        {renderSection}
      </div>
      <ModernFinanceNavigation 
        activeSection={currentSection} 
        setActiveSection={handleNavigationFromNav}
      />
    </div>
  );
};

export default MobileApp;
