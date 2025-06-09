
import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Users, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import DailyVerse from './DailyVerse';
import QuickActions from './QuickActions';
import OnlineUsers from './OnlineUsers';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

const RealTimeDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    notesCount: 0,
    favoritesCount: 0,
    readingStreak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRealTimeStats();
  }, [user]);

  const loadRealTimeStats = async () => {
    try {
      setLoading(true);

      // Get total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get user's notes count
      const { count: notesCount } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Get user's favorite verses count
      const { count: favoritesCount } = await supabase
        .from('favorite_verses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Calculate reading streak from localStorage for now
      const lastRead = localStorage.getItem('lastBibleRead');
      let streak = 0;
      if (lastRead === new Date().toDateString()) {
        streak = parseInt(localStorage.getItem('readingStreak') || '1');
      }

      setUserStats({
        totalUsers: totalUsers || 0,
        notesCount: notesCount || 0,
        favoritesCount: favoritesCount || 0,
        readingStreak: streak
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* En-tête avec utilisateurs en ligne */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
          <p className="text-gray-600">Bienvenue dans votre espace spirituel</p>
        </div>
        <OnlineUsers />
      </div>

      {/* Statistiques en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass border-white/30 bg-white/90">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-800">{userStats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/30 bg-white/90">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Jours de lecture</p>
                <p className="text-2xl font-bold text-gray-800">{userStats.readingStreak}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/30 bg-white/90">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Notes créées</p>
                <p className="text-2xl font-bold text-gray-800">{userStats.notesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/30 bg-white/90">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-xl">⭐</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Versets favoris</p>
                <p className="text-2xl font-bold text-gray-800">{userStats.favoritesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verset du jour */}
        <div className="space-y-4">
          <DailyVerse />
        </div>

        {/* Actions rapides */}
        <div className="space-y-4">
          <QuickActions onNavigate={onNavigate} />
          
          {/* Rappels rapides */}
          <Card className="glass border-white/30 bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="text-spiritual-600" size={20} />
                Rappels du jour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-700">Lecture quotidienne de la Bible</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-purple-700">Moment de prière - 8h, 12h, 20h</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-700">Réflexion et notes spirituelles</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDashboard;
