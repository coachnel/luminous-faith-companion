
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, BookOpen, Star, ThumbsUp, Calendar, User } from 'lucide-react';
import { useCommunityContent } from '@/hooks/useCommunityContent';
import { useAuth } from '@/hooks/useAuth';

const CommunityFeed = () => {
  const { content, loading, likeContent, unlikeContent } = useCommunityContent();
  const { user } = useAuth();

  const typeIcons = {
    prayer: Heart,
    note: MessageCircle,
    verse: BookOpen,
    testimony: Star
  };

  const typeLabels = {
    prayer: 'Prière',
    note: 'Réflexion',
    verse: 'Verset',
    testimony: 'Témoignage'
  };

  const typeColors = {
    prayer: 'bg-red-100 text-red-700 border-red-200',
    note: 'bg-blue-100 text-blue-700 border-blue-200',
    verse: 'bg-green-100 text-green-700 border-green-200',
    testimony: 'bg-purple-100 text-purple-700 border-purple-200'
  };

  const handleLike = (contentId: string) => {
    if (!user) return;
    likeContent(contentId);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <div className="text-gray-500 mb-4">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Aucun contenu communautaire pour le moment</p>
            <p className="text-sm">Soyez le premier à partager !</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {content.map((item) => {
        const IconComponent = typeIcons[item.type];
        const colorClass = typeColors[item.type];
        
        return (
          <Card key={item.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Badge className={`${colorClass} flex items-center gap-1 flex-shrink-0`}>
                    <IconComponent className="h-3 w-3" />
                    {typeLabels[item.type]}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{item.author_name}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 break-words">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed break-words whitespace-pre-wrap">
                    {item.content}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{item.likes_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{item.comments_count}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleLike(item.id)}
                      disabled={!user}
                      size="sm"
                      variant="outline"
                      className="gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      J'aime
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CommunityFeed;
