
import React from 'react';
import { Home, Heart, BookOpen, Target, Compass } from 'lucide-react';
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
    { route: 'discover' as AppRoute, icon: Compass, label: 'Découvrir' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/50 rounded-t-2xl sm:rounded-t-3xl shadow-xl z-50">
      <div className="max-w-md mx-auto px-2 py-3">
        <div className="flex justify-between items-center gap-1">
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
                className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl transition-all duration-200 flex-1 min-w-0 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 mb-1 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span className={`text-[10px] xs:text-xs font-medium leading-tight text-center break-words ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileNavigation;
