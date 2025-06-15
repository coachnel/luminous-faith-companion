
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNavigation from './MobileNavigation';
import AppRouter, { AppRoute } from './AppRouter';

const ResponsiveLayout: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('dashboard');
  const isMobile = useIsMobile();

  const handleMobileNavigate = (route: AppRoute) => {
    setCurrentRoute(route);
    console.log('Navigation vers:', route);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenu principal avec padding bottom pour mobile */}
      <div className={`${isMobile ? 'pb-16 sm:pb-20' : ''} min-h-screen`}>
        <AppRouter initialRoute={currentRoute} />
      </div>

      {/* Navigation mobile - visible uniquement sur mobile */}
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
