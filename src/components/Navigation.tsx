
import React from 'react';
import { Book, Heart, User, Calendar } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Accueil', icon: Calendar },
    { id: 'bible', label: 'Bible', icon: Book },
    { id: 'notes', label: 'Notes', icon: Heart },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/20 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-spiritual-500/20 text-spiritual-600 scale-110'
                  : 'text-gray-600 hover:text-spiritual-500 hover:bg-white/10'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
