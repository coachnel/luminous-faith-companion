
import React from 'react';
import { Home, Heart, BookOpen, Target, Compass, Users, Settings } from 'lucide-react';
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
    { route: 'prayer-circles' as AppRoute, icon: Users, label: 'Cercles' },
    { route: 'settings' as AppRoute, icon: Settings, label: 'Paramètres' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex justify-around items-center py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route;
          
          return (
            <button
              key={item.route}
              onClick={() => onNavigate(item.route)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className={`text-xs truncate w-full text-center ${
                isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
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
