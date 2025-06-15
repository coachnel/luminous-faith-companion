
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Users, Heart, MessageCircle, Calendar } from 'lucide-react';
import { useLastVisits, useCommunityStats, useAchievements } from '@/hooks/useNewFeatures';
import NewContentIndicator from './NewContentIndicator';
import CommunityStatsCard from './CommunityStatsCard';

const EnhancedDiscoverPage = () => {
  const { lastVisitDiscover, updateLastVisitDiscover, loading: visitsLoading } = useLastVisits();
  const { stats, loading: statsLoading } = useCommunityStats();
  const { achievements, loading: achievementsLoading } = useAchievements();

  // Marquer la visite quand l'utilisateur arrive sur la page
  useEffect(() => {
    updateLastVisitDiscover();
  }, []);

  // Simuler du contenu pour l'exemple (à remplacer par de vraies données)
  const mockContent = [
    {
      id: '1',
      title: 'Prière pour la paix',
      author: 'Marie Dupont',
      type: 'prayer',
      created_at: new Date().toISOString(),
      likes: 12,
      comments: 3
    },
    {
      id: '2',
      title: 'Réflexion sur la gratitude',
      author: 'Jean Martin',
      type: 'note',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 8,
      comments: 5
    }
  ];

  // Calculer le contenu nouveau depuis la dernière visite
  const getNewContentCount = () => {
    if (!lastVisitDiscover) return mockContent.length;
    
    const lastVisit = new Date(lastVisitDiscover);
    return mockContent.filter(content => 
      new Date(content.created_at) > lastVisit
    ).length;
  };

  const newContentCount = getNewContentCount();

  return (
    <div className="p-3 sm:p-4 max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* En-tête avec indicateur de nouveautés */}
      <Card className="glass border-white/30">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">Découvrir</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Explorez le contenu de la communauté</p>
              </div>
            </div>
            
            {newContentCount > 0 && (
              <NewContentIndicator 
                hasNewContent={true} 
                contentCount={newContentCount}
              />
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Statistiques communautaires */}
      <CommunityStatsCard stats={stats} loading={statsLoading} />

      {/* Mes achievements récents */}
      {achievements.length > 0 && (
        <Card className="glass border-white/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Mes derniers badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {achievements.slice(0, 3).map((achievement) => (
                <div 
                  key={achievement.id}
                  className="bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-2 rounded-full border border-yellow-200"
                >
                  <span className="text-sm font-medium text-orange-800">
                    🏆 {achievement.achievement_name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contenu de la communauté */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 px-1">Contenu récent</h2>
        
        {mockContent.map((content) => {
          const isNew = lastVisitDiscover ? 
            new Date(content.created_at) > new Date(lastVisitDiscover) : false;
            
          return (
            <Card key={content.id} className="glass border-white/30 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                          {content.title}
                        </h3>
                        {isNew && (
                          <NewContentIndicator hasNewContent={true} />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <Users className="h-3 w-3" />
                        <span>{content.author}</span>
                        <span>•</span>
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(content.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                      <Heart className="h-4 w-4" />
                      <span>{content.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>{content.comments}</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EnhancedDiscoverPage;
