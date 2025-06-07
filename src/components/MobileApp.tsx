import React, { useState } from 'react';
import { Home, Book, Heart, Settings, Bell, Edit, Calendar, Target, MessageCircle } from 'lucide-react';
import Dashboard from './Dashboard';
import FavoriteVerses from './FavoriteVerses';
import NotesApp from './NotesApp';
import SettingsApp from './SettingsApp';
import AdvancedNotifications from './AdvancedNotifications';
import ReadingPlans from './ReadingPlans';
import DailyChallenges from './DailyChallenges';
import PrayerSharing from './PrayerSharing';
import { useAuth } from '@/hooks/useAuth';

const MobileApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { signOut } = useAuth();

  const tabs = [
    { id: 'dashboard', label: 'Accueil', icon: Home, component: Dashboard },
    { id: 'bible', label: 'Bible', icon: Book, component: Dashboard }, // Remplacez par BibleApp si nécessaire
    { id: 'favorites', label: 'Favoris', icon: Heart, component: FavoriteVerses },
    { id: 'notes', label: 'Notes', icon: Edit, component: NotesApp },
    { id: 'plans', label: 'Plans', icon: Calendar, component: ReadingPlans },
    { id: 'challenges', label: 'Défis', icon: Target, component: DailyChallenges },
    { id: 'prayers', label: 'Prières', icon: MessageCircle, component: PrayerSharing },
    { id: 'notifications', label: 'Alarmes', icon: Bell, component: AdvancedNotifications },
    { id: 'settings', label: 'Réglages', icon: Settings, component: SettingsApp },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Dashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-heavenly-50 via-spiritual-50 to-purple-50">
      {/* En-tête fixe */}
      <header className="sticky top-0 z-20 glass border-b border-white/30 backdrop-blur-md">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full spiritual-gradient flex items-center justify-center">
              <span className="text-white text-lg">✝️</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-spiritual-600 to-heavenly-600">
                Compagnon Spirituel
              </h1>
              <p className="text-xs text-gray-600">Votre parcours de foi</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded-lg hover:bg-white/50 transition-all"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="pb-24 min-h-screen">
        <ActiveComponent />
      </main>

      {/* Navigation fixe en bas avec scroll horizontal */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 glass border-t border-white/30 backdrop-blur-md">
        <div className="overflow-x-auto">
          <div className="flex gap-1 p-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all min-w-[64px] ${
                    isActive 
                      ? 'bg-spiritual-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-white/50 hover:text-spiritual-600'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-xs mt-1 font-medium whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MobileApp;
