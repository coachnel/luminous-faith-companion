
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, Bell } from 'lucide-react';
import CommunityPublish from './CommunityPublish';
import CommunityFeed from './CommunityFeed';
import CommunityNotificationCenter from './CommunityNotificationCenter';
import { useCommunityNotifications } from '@/hooks/useCommunityContent';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const { unreadCount } = useCommunityNotifications();

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 max-w-4xl mx-auto min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* En-tête moderne unifié */}
      <div className="bg-[var(--bg-card)] border-[var(--border-default)] rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--accent-primary)' }}
          >
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text-primary)] break-words">
              Communauté
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] break-words">
              Partagez, découvrez et priez ensemble
            </p>
          </div>
        </div>
      </div>

      {/* Onglets modernes avec style cohérent du menu principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[var(--bg-card)] border-[var(--border-default)] p-1 rounded-xl">
          <TabsTrigger 
            value="feed" 
            className={`gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3 rounded-xl transition-all duration-200 font-medium cursor-pointer ${
              activeTab === 'feed' 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg' 
                : 'hover:bg-gray-50 text-[var(--text-primary)]'
            }`}
          >
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xxs:inline">Découvrir</span>
          </TabsTrigger>
          <TabsTrigger 
            value="publish" 
            className={`gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3 rounded-xl transition-all duration-200 font-medium cursor-pointer ${
              activeTab === 'publish' 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg' 
                : 'hover:bg-gray-50 text-[var(--text-primary)]'
            }`}
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xxs:inline">Publier</span>
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className={`gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3 rounded-xl transition-all duration-200 font-medium cursor-pointer relative ${
              activeTab === 'notifications' 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg' 
                : 'hover:bg-gray-50 text-[var(--text-primary)]'
            }`}
          >
            <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xxs:inline">Notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] xxs:text-[10px] xs:text-xs rounded-full px-1 xxs:px-1.5 py-0.5 min-w-[1rem] xxs:min-w-[1.25rem] h-4 xxs:h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <CommunityFeed />
        </TabsContent>

        <TabsContent value="publish" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <CommunityPublish />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <CommunityNotificationCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityPage;
