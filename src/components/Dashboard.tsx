
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Heart, Calendar, Target, PenTool, Users } from 'lucide-react';
import { getDailyVerse } from '@/lib/dailyVerse';
import QuickActions from './QuickActions';
import ProfilePhoto from './ProfilePhoto';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useSupabaseData';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const verse = getDailyVerse();

  const features = [
    {
      icon: Target,
      title: 'Défis quotidiens',
      description: 'Créez et relevez des défis personnels',
      action: () => onNavigate('challenges'),
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: PenTool,
      title: 'Journal',
      description: 'Organisez vos pensées et réflexions',
      action: () => onNavigate('notes'),
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Partagez avec d\'autres croyants',
      action: () => onNavigate('community'),
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête de bienvenue */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Bienvenue, {profile?.name || user?.email?.split('@')[0] || 'Utilisateur'} 🙏
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Que votre journée soit bénie et remplie de paix
          </p>
        </div>

        {/* Photo de profil */}
        <div className="flex justify-center">
          <ProfilePhoto />
        </div>

        {/* Verset du jour */}
        <Card className="glass border-white/30 bg-white/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl text-center flex items-center justify-center gap-2">
              <Book className="h-5 w-5 text-blue-600" />
              Verset du jour
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <blockquote className="text-sm sm:text-lg italic text-gray-800 mb-3 leading-relaxed">
              "{verse.text}"
            </blockquote>
            <cite className="text-xs sm:text-sm text-gray-600 font-medium">
              {verse.book} {verse.chapter}:{verse.verse}
            </cite>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <QuickActions onNavigate={onNavigate} />

        {/* Fonctionnalités principales - Design mobile optimisé */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="glass border-white/30 bg-white/90 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto`}>
                    <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-snug px-1 h-10 sm:h-12 flex items-center justify-center">
                      {feature.description}
                    </p>
                  </div>
                  <Button 
                    onClick={feature.action}
                    className="w-full text-xs sm:text-sm py-2 sm:py-2.5"
                    variant="outline"
                  >
                    Découvrir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="glass border-white/30 bg-white/90">
            <CardContent className="p-3 sm:p-4 text-center">
              <Book className="mx-auto mb-1 sm:mb-2 text-blue-600" size={20} />
              <div className="text-lg sm:text-xl font-bold">7</div>
              <div className="text-xs sm:text-sm text-gray-600">Jours actifs</div>
            </CardContent>
          </Card>
          
          <Card className="glass border-white/30 bg-white/90">
            <CardContent className="p-3 sm:p-4 text-center">
              <Heart className="mx-auto mb-1 sm:mb-2 text-red-500" size={20} />
              <div className="text-lg sm:text-xl font-bold">12</div>
              <div className="text-xs sm:text-sm text-gray-600">Favoris</div>
            </CardContent>
          </Card>
          
          <Card className="glass border-white/30 bg-white/90">
            <CardContent className="p-3 sm:p-4 text-center">
              <Calendar className="mx-auto mb-1 sm:mb-2 text-green-500" size={20} />
              <div className="text-lg sm:text-xl font-bold">3</div>
              <div className="text-xs sm:text-sm text-gray-600">Plans actifs</div>
            </CardContent>
          </Card>
          
          <Card className="glass border-white/30 bg-white/90">
            <CardContent className="p-3 sm:p-4 text-center">
              <Target className="mx-auto mb-1 sm:mb-2 text-purple-500" size={20} />
              <div className="text-lg sm:text-xl font-bold">5</div>
              <div className="text-xs sm:text-sm text-gray-600">Défis</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
