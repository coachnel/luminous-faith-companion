
import React, { useState } from 'react';
import { Book, Home, PenTool, Settings, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from './Dashboard';
import BibleApp from './BibleApp';
import NotesApp from './NotesApp';
import SettingsApp from './SettingsApp';

const MobileApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { signOut } = useAuth();

  const tabs = [
    { id: 'dashboard', label: 'Accueil', icon: Home },
    { id: 'bible', label: 'Bible', icon: Book },
    { id: 'notes', label: 'Notes', icon: PenTool },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'bible':
        return <BibleApp />;
      case 'notes':
        return <NotesApp />;
      case 'settings':
        return <SettingsApp />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-heavenly-50 via-spiritual-50 to-purple-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/30 backdrop-blur-md">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full spiritual-gradient flex items-center justify-center">
              <span className="text-white text-sm">✝️</span>
            </div>
            <h1 className="text-lg font-semibold text-spiritual-700">Compagnon Spirituel</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Bell size={18} className="text-spiritual-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={signOut}
            >
              <LogOut size={18} className="text-spiritual-600" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/30 backdrop-blur-md">
        <div className="flex items-center justify-around p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-spiritual-100 text-spiritual-700' 
                    : 'text-gray-500 hover:text-spiritual-600'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileApp;
