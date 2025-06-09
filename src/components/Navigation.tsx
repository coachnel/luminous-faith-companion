
import React from 'react';
import { Home, Book, Heart, Bell, Settings, Users, Target, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Navigation = ({ activeSection, setActiveSection }: NavigationProps) => {
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-white/30 z-50 shadow-lg">
      <div className="flex overflow-x-auto scrollbar-hide py-2 px-1 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-fit text-xs flex-shrink-0 ${
                isActive 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Icon size={18} />
              <span className="text-xs leading-none whitespace-nowrap">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
