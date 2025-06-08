
import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Users, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DailyVerse from './DailyVerse';
import QuickActions from './QuickActions';
import OnlineUsers from './OnlineUsers';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [userStats, setUserStats] = useState({
    notesCount: 0,
    favoritesCount: 0,
    readingStreak: 0
  });

  useEffect(() => {
    // Charger les statistiques utilisateur
    const notes = JSON.parse(localStorage.getItem('userNotes') || '[]');
    const favorites = JSON.parse(localStorage.getItem('bibleFavorites') || '[]');
    const lastRead = localStorage.getItem('lastBibleRead');
    
    let streak = 0;
    if (lastRead === new Date().toDateString()) {
      streak = parseInt(localStorage.getItem('readingStreak') || '1');
    }

    setUserStats({
      notesCount: notes.length,
      favoritesCount: favorites.length,
      readingStreak: streak
    });
  }, []);

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

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

export default Dashboard;
