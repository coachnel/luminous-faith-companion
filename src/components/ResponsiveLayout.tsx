
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNavigation from './MobileNavigation';
import AppRouter, { AppRoute } from './AppRouter';

const ResponsiveLayout: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('dashboard');
  const isMobile = useIsMobile();

  const handleNavigate = (path: string) => {
    const route = path.replace('/', '') as AppRoute;
    if (route === '') {
      setCurrentRoute('dashboard');
    } else {
      setCurrentRoute(route);
    }
  };

  const handleMobileNavigate = (route: AppRoute) => {
    setCurrentRoute(route);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenu principal */}
      <div className={`${isMobile ? 'pb-20' : ''} min-h-screen`}>
        <AppRouter initialRoute={currentRoute} />
      </div>

      {/* Navigation mobile */}
      {isMobile && (
        <MobileNavigation 
          currentRoute={currentRoute} 
          onNavigate={handleMobileNavigate} 
        />
      )}
    </div>
  );
};

export default ResponsiveLayout;
