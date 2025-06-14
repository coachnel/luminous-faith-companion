
import React from 'react';
import { Home, Book, Heart, Bell, Settings, Users, Target, Calendar, MessageSquare } from 'lucide-react';
import { ModernButton } from '@/components/ui/modern-button';
import { useTheme } from '@/contexts/ThemeContext';

interface ModernNavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ModernNavigation = ({ activeSection, setActiveSection }: ModernNavigationProps) => {
  const { theme } = useTheme();
  
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Accueil', color: 'blue' },
    { id: 'bible', icon: Book, label: 'Bible', color: 'indigo' },
    { id: 'reading-plans', icon: Calendar, label: 'Plans', color: 'purple' },
    { id: 'prayer-circles', icon: Users, label: 'Cercles', color: 'green' },
    { id: 'challenges', icon: Target, label: 'Défis', color: 'orange' },
    { id: 'notes', icon: Heart, label: 'Notes', color: 'pink' },
    { id: 'favorites', icon: MessageSquare, label: 'Prières', color: 'yellow' },
    { id: 'notifications', icon: Bell, label: 'Notifs', color: 'red' },
    { id: 'settings', icon: Settings, label: 'Paramètres', color: 'gray' },
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    if (theme === 'dark') {
      return isActive 
        ? 'bg-[var(--accent-primary)] text-white' 
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]';
    }
    
    const colorMap: Record<string, string> = {
      blue: isActive ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-50',
      indigo: isActive ? 'bg-indigo-500 text-white' : 'text-indigo-600 hover:bg-indigo-50',
      purple: isActive ? 'bg-purple-500 text-white' : 'text-purple-600 hover:bg-purple-50',
      green: isActive ? 'bg-green-500 text-white' : 'text-green-600 hover:bg-green-50',
      orange: isActive ? 'bg-orange-500 text-white' : 'text-orange-600 hover:bg-orange-50',
      pink: isActive ? 'bg-pink-500 text-white' : 'text-pink-600 hover:bg-pink-50',
      yellow: isActive ? 'bg-yellow-500 text-white' : 'text-yellow-600 hover:bg-yellow-50',
      red: isActive ? 'bg-red-500 text-white' : 'text-red-600 hover:bg-red-50',
      gray: isActive ? 'bg-gray-500 text-white' : 'text-gray-600 hover:bg-gray-50',
    };
    
    return colorMap[color] || colorMap.gray;
  };

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 modern-nav shadow-xl ${
      theme === 'dark' ? 'border-t border-[var(--border-default)]' : 'border-t border-white/30'
    }`}>
      <div className="flex overflow-x-auto scrollbar-hide py-3 px-2 gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-1.5 py-2 px-3 rounded-xl transition-all duration-200 min-w-fit flex-shrink-0 ${
                getColorClasses(item.color, isActive)
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium leading-none whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default ModernNavigation;
