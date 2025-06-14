
import React from 'react';
import { Home, BookOpen, Calendar, Users, Target, MessageSquare, Bell, Settings, User, Heart, Edit3 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ModernFinanceNavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ModernFinanceNavigation = ({ activeSection, setActiveSection }: ModernFinanceNavigationProps) => {
  const { theme } = useTheme();
  
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Accueil' },
    { id: 'bible', icon: BookOpen, label: 'Bible' },
    { id: 'reading-plans', icon: Calendar, label: 'Plans' },
    { id: 'challenges', icon: Target, label: 'Défis' },
    { id: 'prayer-circles', icon: Users, label: 'Prières' },
    { id: 'notes', icon: Edit3, label: 'Notes' },
    { id: 'favorites', icon: Heart, label: 'Favoris' },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe"
      style={{
        background: theme === 'dark' 
          ? 'rgba(30, 30, 42, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
      }}
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-1 py-2 px-2 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'transform scale-110' 
                  : 'transform scale-100 hover:scale-105'
              }`}
              style={{
                background: isActive 
                  ? 'linear-gradient(135deg, #0066FF, #0052CC)'
                  : 'transparent',
                color: isActive 
                  ? '#FFFFFF'
                  : theme === 'dark' 
                    ? 'rgba(209, 209, 224, 0.8)' 
                    : 'rgba(60, 60, 67, 0.6)',
                boxShadow: isActive 
                  ? '0 8px 20px rgba(0, 102, 255, 0.3)'
                  : 'none'
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs font-medium leading-none ${
                isActive ? 'font-semibold' : ''
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Indicateur moderne */}
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 rounded-full transition-all duration-300"
        style={{
          background: 'linear-gradient(90deg, transparent, #0066FF, transparent)',
          opacity: 0.6
        }}
      />
    </nav>
  );
};

export default ModernFinanceNavigation;
