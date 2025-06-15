
import React from 'react';
import { Home, Heart, BookOpen, Target, Compass, Users, Settings, MessageSquare, Star } from 'lucide-react';
import { AppRoute } from './AppRouter';

interface MobileNavigationProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentRoute, onNavigate }) => {
  const navItems = [
    { route: 'dashboard' as AppRoute, icon: Home, label: 'Accueil' },
    { route: 'prayer' as AppRoute, icon: Heart, label: 'Prière' },
    { route: 'notes' as AppRoute, icon: BookOpen, label: 'Journal' },
    { route: 'challenges' as AppRoute, icon: Target, label: 'Défis' },
    { route: 'discover' as AppRoute, icon: Compass, label: 'Découvrir' },
    { route: 'community' as AppRoute, icon: MessageSquare, label: 'Communauté' },
    { route: 'testimony' as AppRoute, icon: Star, label: 'Témoignages' },
    { route: 'prayer-circles' as AppRoute, icon: Users, label: 'Cercles' },
    { route: 'settings' as AppRoute, icon: Settings, label: 'Paramètres' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50 safe-area-bottom shadow-lg">
      <div className="flex justify-around items-center py-1 px-0.5 overflow-x-hidden max-w-screen">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route;
          
          return (
            <button
              key={item.route}
              onClick={() => {
                console.log('Navigation mobile vers:', item.route);
                onNavigate(item.route);
              }}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all duration-200 min-w-0 flex-1 hover:scale-105 ${
                isActive 
                  ? 'text-blue-600 bg-blue-50 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              style={{ minWidth: '32px', maxWidth: '52px' }}
            >
              <Icon className={`h-4 w-4 mb-0.5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className={`text-[8px] xxs:text-[9px] sm:text-[10px] truncate w-full text-center leading-tight font-medium ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
