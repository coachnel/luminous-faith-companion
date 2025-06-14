
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Communauté Spirituelle
          </h1>
          <p className="text-gray-600">
            Partagez, découvrez et priez ensemble
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feed" className="gap-2">
              <Users className="h-4 w-4" />
              Découvrir
            </TabsTrigger>
            <TabsTrigger value="publish" className="gap-2">
              <Plus className="h-4 w-4" />
              Publier
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6 mt-6">
            <CommunityFeed />
          </TabsContent>

          <TabsContent value="publish" className="space-y-6 mt-6">
            <CommunityPublish />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 mt-6">
            <CommunityNotificationCenter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityPage;
