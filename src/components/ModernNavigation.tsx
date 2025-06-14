
import React from 'react';
import { Home, Book, Heart, Bell, Settings, Users, Target, Calendar, MessageSquare } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ModernNavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ModernNavigation = ({ activeSection, setActiveSection }: ModernNavigationProps) => {
  const { theme } = useTheme();
  
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Accueil' },
    { id: 'bible', icon: Book, label: 'Bible' },
    { id: 'reading-plans', icon: Calendar, label: 'Plans' },
    { id: 'prayer-circles', icon: Users, label: 'Cercles' },
    { id: 'challenges', icon: Target, label: 'Défis' },
    { id: 'notes', icon: Heart, label: 'Notes' },
    { id: 'favorites', icon: MessageSquare, label: 'Favoris' },
    { id: 'notifications', icon: Bell, label: 'Notifs' },
    { id: 'settings', icon: Settings, label: 'Réglages' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bottom-nav">
      <div className="flex overflow-x-auto scrollbar-hide py-2 px-2 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 min-w-fit flex-shrink-0 ${
                isActive 
                  ? 'item-active' 
                  : 'item-inactive hover:bg-[var(--bg-secondary)]'
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
