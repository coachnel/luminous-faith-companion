
import React from 'react';
import { Home, Book, Heart, Bell, Settings, Users, Target, Calendar, MessageSquare, BookOpen } from 'lucide-react';
import { ModernButton } from '@/components/ui/modern-button';
import { useTheme } from '@/contexts/ThemeContext';

interface ExpandedNavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ExpandedNavigation = ({ activeSection, setActiveSection }: ExpandedNavigationProps) => {
  const { theme } = useTheme();
  
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Accueil' },
    { id: 'bible', icon: Book, label: 'Bible' },
    { id: 'reading-plans', icon: Calendar, label: 'Plans' },
    { id: 'prayer-circles', icon: Users, label: 'Cercles' },
    { id: 'challenges', icon: Target, label: 'Défis' },
    { id: 'notes', icon: Heart, label: 'Notes' },
    { id: 'favorites', icon: MessageSquare, label: 'Prières' },
    { id: 'notifications', icon: Bell, label: 'Notifs' },
    { id: 'settings', icon: Settings, label: 'Paramètres' },
  ];

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 z-50 border-t transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-900/95 backdrop-blur-lg border-slate-700/50' 
          : 'bg-white/95 backdrop-blur-lg border-white/30'
      }`}
      style={{
        background: theme === 'dark' 
          ? 'rgba(15, 23, 42, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        boxShadow: theme === 'dark'
          ? '0 -4px 20px rgba(0, 0, 0, 0.3)'
          : '0 -4px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="flex overflow-x-auto scrollbar-hide py-2 px-1 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <ModernButton
              key={item.id}
              variant={isActive ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-fit text-xs flex-shrink-0 transition-all duration-200 ${
                isActive 
                  ? 'scale-105 shadow-lg' 
                  : 'hover:scale-105'
              }`}
              style={{
                background: isActive 
                  ? (theme === 'dark' ? 'var(--spiritual-primary)' : 'var(--accent-primary)')
                  : 'transparent',
                color: isActive 
                  ? 'white' 
                  : 'var(--text-secondary)'
              }}
            >
              <Icon size={18} />
              <span className="text-xs leading-none whitespace-nowrap">{item.label}</span>
            </ModernButton>
          );
        })}
      </div>
    </nav>
  );
};

export default ExpandedNavigation;
