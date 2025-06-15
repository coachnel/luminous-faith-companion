
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
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: '#ffffff', 
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh'
      }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: '#3b82f6', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px' 
          }}>
            <img 
              src="/lovable-uploads/ee59e58d-a594-4372-b796-33f8edb80c6c.png" 
              alt="Luminous Faith" 
              style={{ width: '32px', height: '32px', objectFit: 'contain' }}
            />
          </div>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            border: '4px solid #3b82f6', 
            borderTop: '4px solid transparent', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite', 
            margin: '0 auto 16px' 
          }}></div>
          <div style={{ fontSize: '16px', color: '#6b7280', fontWeight: 500 }}>Chargement...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: '#f9fafb', 
        width: '100vw',
        height: '100vh',
        overflow: 'auto'
      }}>
        <AuthPage />
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: '#f9fafb', 
      display: 'flex', 
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <PWAUpdatePrompt />
      <div style={{ 
        flex: 1, 
        overflow: 'auto', 
        paddingBottom: '80px',
        width: '100%',
        height: '100%',
        position: 'relative'
      }}>
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
