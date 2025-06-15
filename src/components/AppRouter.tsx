
import React, { useState } from 'react';
import ModernDashboard from './ModernDashboard';
import Prayer from './Prayer';
import NotesJournal from './NotesJournal';
import EnhancedChallengesPage from './EnhancedChallengesPage';
import EnhancedReadingPlans from './EnhancedReadingPlans';
import DiscoverPage from './DiscoverPage';
import PrayerCircles from './PrayerCircles';
import SettingsApp from './SettingsApp';

export type AppRoute = 
  | 'dashboard'
  | 'prayer'
  | 'notes'
  | 'challenges'
  | 'reading-plans'
  | 'discover'
  | 'prayer-circles'
  | 'settings';

interface AppRouterProps {
  initialRoute?: AppRoute;
}

const AppRouter: React.FC<AppRouterProps> = ({ initialRoute = 'dashboard' }) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(initialRoute);

  const handleNavigate = (path: string) => {
    const route = path.replace('/', '') as AppRoute;
    if (route === '') {
      setCurrentRoute('dashboard');
    } else {
      setCurrentRoute(route);
    }
  };

  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <ModernDashboard onNavigate={handleNavigate} />;
      case 'prayer':
        return <Prayer onNavigate={handleNavigate} />;
      case 'notes':
        return <NotesJournal onNavigate={handleNavigate} />;
      case 'challenges':
        return <EnhancedChallengesPage onNavigate={handleNavigate} />;
      case 'reading-plans':
        return <EnhancedReadingPlans onNavigate={handleNavigate} />;
      case 'discover':
        return <DiscoverPage onNavigate={handleNavigate} />;
      case 'prayer-circles':
        return <PrayerCircles onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsApp onNavigate={handleNavigate} />;
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
