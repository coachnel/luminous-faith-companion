
import React, { useState } from 'react';
import { Home, Book, Heart, Bell, Settings, Users, Target, Calendar, MessageSquare, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExpandedNavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ExpandedNavigation = ({ activeSection, setActiveSection }: ExpandedNavigationProps) => {
  const [showAllSections, setShowAllSections] = useState(false);

  const primaryItems = [
    { id: 'dashboard', icon: Home, label: 'Accueil' },
    { id: 'bible', icon: Book, label: 'Bible' },
    { id: 'prayer', icon: Heart, label: 'Prières' },
    { id: 'favorites', icon: MessageSquare, label: 'Favoris' }
  ];

  const secondaryItems = [
    { id: 'reading-plans', icon: Calendar, label: 'Plans' },
    { id: 'prayer-circles', icon: Users, label: 'Cercles' },
    { id: 'challenges', icon: Target, label: 'Défis' },
    { id: 'notes', icon: MessageSquare, label: 'Notes' },
    { id: 'notifications', icon: Bell, label: 'Notifs' },
    { id: 'settings', icon: Settings, label: 'Paramètres' }
  ];

  const handleSectionSelect = (sectionId: string) => {
    setActiveSection(sectionId);
    setShowAllSections(false);
  };

  if (showAllSections) {
    return (
      <nav className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Toutes les sections</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllSections(false)}
              className="h-8 w-8 p-0"
            >
              <X size={16} />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {[...primaryItems, ...secondaryItems].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => handleSectionSelect(item.id)}
                  className={`flex flex-col items-center gap-2 h-auto py-4 px-3 ${
                    isActive 
                      ? 'text-purple-600 bg-purple-50' 
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-xs font-medium">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-white/30 z-50 shadow-lg">
      <div className="flex items-center justify-center py-2 px-4">
        {/* Section principale gauche */}
        {primaryItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-1 h-auto py-3 px-4 flex-1 ${
                isActive 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs leading-none">{item.label}</span>
            </Button>
          );
        })}

        {/* Bouton central "+" */}
        <Button
          onClick={() => setShowAllSections(true)}
          className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white mx-4 shadow-lg"
        >
          <Plus size={24} />
        </Button>

        {/* Sections principales droite */}
        {primaryItems.slice(2, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-1 h-auto py-3 px-4 flex-1 ${
                isActive 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs leading-none">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default ExpandedNavigation;
