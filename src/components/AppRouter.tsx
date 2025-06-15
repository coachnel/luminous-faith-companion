
import React, { useState, useEffect } from 'react';
import ModernDashboard from './ModernDashboard';
import Prayer from './Prayer';
import NotesJournal from './NotesJournal';
import EnhancedChallengesPage from './EnhancedChallengesPage';
import EnhancedReadingPlans from './EnhancedReadingPlans';
import DiscoverPage from './DiscoverPage';
import PrayerCircles from './PrayerCircles';
import SettingsApp from './SettingsApp';
import CommunityPage from './CommunityPage';
import TestimonyPage from './TestimonyPage';

export type AppRoute = 
  | 'dashboard'
  | 'prayer'
  | 'notes'
  | 'challenges'
  | 'reading-plans'
  | 'discover'
  | 'prayer-circles'
  | 'community'
  | 'testimony'
  | 'settings';

interface AppRouterProps {
  initialRoute?: AppRoute;
}

const AppRouter: React.FC<AppRouterProps> = ({ initialRoute = 'dashboard' }) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(initialRoute);

  // Update internal route when initialRoute prop changes
  useEffect(() => {
    setCurrentRoute(initialRoute);
  }, [initialRoute]);

  const handleNavigate = (path: string) => {
    const cleanPath = path.replace('/', '');
    const route = cleanPath === '' ? 'dashboard' : cleanPath as AppRoute;
    setCurrentRoute(route);
  };

  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <ModernDashboard onNavigate={handleNavigate} />;
      case 'prayer':
        return <Prayer />;
      case 'notes':
        return <NotesJournal />;
      case 'challenges':
        return <EnhancedChallengesPage />;
      case 'reading-plans':
        return <EnhancedReadingPlans />;
      case 'discover':
        return <DiscoverPage />;
      case 'prayer-circles':
        return <PrayerCircles />;
      case 'community':
        return <CommunityPage />;
      case 'testimony':
        return <TestimonyPage />;
      case 'settings':
        return <SettingsApp />;
      default:
        return <ModernDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentRoute()}
    </div>
  );
};

export default AppRouter;
