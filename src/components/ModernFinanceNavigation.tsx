
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Heart, 
  Settings,
  PenTool,
  Bell,
  Plus,
  Calendar
} from 'lucide-react';

const ModernFinanceNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { path: '/', label: 'Tableau de bord', icon: Calendar, color: 'from-blue-500 to-blue-600' },
    { path: '/bible', label: 'Bible', icon: BookOpen, color: 'from-green-500 to-green-600' },
    { path: '/journal', label: 'Journal', icon: PenTool, color: 'from-purple-500 to-purple-600' },
    { path: '/prayer', label: 'Prière', icon: Heart, color: 'from-rose-500 to-rose-600' },
    { path: '/community', label: 'Communauté', icon: Users, color: 'from-indigo-500 to-indigo-600' },
    { path: '/testimony', label: 'Témoignages', icon: Plus, color: 'from-orange-500 to-orange-600' },
    { path: '/notifications', label: 'Notifications', icon: Bell, color: 'from-cyan-500 to-cyan-600' },
    { path: '/settings', label: 'Paramètres', icon: Settings, color: 'from-gray-500 to-gray-600' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200/50 shadow-lg">
      <div className="max-w-md mx-auto px-2 py-1 sm:py-2">
        <div className="flex justify-around items-center">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg transition-all duration-300
                  min-w-0 flex-1 max-w-[4rem] sm:max-w-[5rem]
                  ${active 
                    ? 'text-white transform scale-105' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
                style={active ? {
                  background: `linear-gradient(135deg, ${item.color.split(' ')[0].replace('from-', '')}, ${item.color.split(' ')[1].replace('to-', '')})`
                } : {}}
              >
                <Icon 
                  className={`
                    mb-0.5 sm:mb-1 flex-shrink-0
                    ${active ? 'text-white' : ''}
                    w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6
                  `}
                />
                <span 
                  className={`
                    text-[8px] xs:text-[9px] sm:text-xs font-medium leading-tight
                    ${active ? 'text-white' : ''}
                    truncate w-full text-center
                  `}
                  title={item.label}
                >
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

export default ModernFinanceNavigation;
