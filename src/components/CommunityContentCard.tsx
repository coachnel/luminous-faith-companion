
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, BookOpen, Users, Star, ThumbsUp, Calendar, User } from 'lucide-react';
import { CommunityContent, useCommunityContent } from '@/hooks/useCommunityContent';
import { useAuth } from '@/hooks/useAuth';
import LinkPreview from '@/components/ui/LinkPreview';

interface CommunityContentCardProps {
  item: CommunityContent;
}

const CommunityContentCard: React.FC<CommunityContentCardProps> = ({ item }) => {
  const { likeContent, unlikeContent } = useCommunityContent();
  const { user } = useAuth();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prayer': return Heart;
      case 'verse': return BookOpen;
      case 'testimony': return Users;
      case 'note': return Star;
      default: return Star;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'prayer': return 'Prière';
      case 'verse': return 'Verset';
      case 'testimony': return 'Témoignage';
      case 'note': return 'Réflexion';
      default: return 'Contenu';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prayer': return 'bg-red-100 text-red-700 border-red-200';
      case 'verse': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'testimony': return 'bg-green-100 text-green-700 border-green-200';
      case 'note': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderContentWithLinks = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return <LinkPreview key={index} url={part} className="mx-1" />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleLike = () => {
    if (!user) return;
    likeContent(item.id);
  };

  const TypeIcon = getTypeIcon(item.type);

  return (
    <ModernCard className="p-3 sm:p-4 bg-[var(--bg-secondary)] border-[var(--border-default)] hover:shadow-md transition-all">
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className={`text-xs ${getTypeColor(item.type)}`}>
                <TypeIcon className="h-3 w-3 mr-1" />
                {getTypeLabel(item.type)}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                <User className="h-3 w-3" />
                <span>{item.author_name}</span>
                <span>•</span>
                <Calendar className="h-3 w-3" />
                <span>{new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-1 text-sm sm:text-base break-words">{item.title}</h4>
            <div className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-3 break-words leading-relaxed">
              {renderContentWithLinks(item.content)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-default)]">
          <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              <span>{item.likes_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span>{item.comments_count}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleLike}
              disabled={!user}
              size="sm"
              variant="outline"
              className="gap-1 h-7 px-2 text-xs"
            >
              <ThumbsUp className="h-3 w-3" />
              J'aime
            </Button>
            <Button
              disabled={!user}
              size="sm"
              variant="outline"
              className="gap-1 h-7 px-2 text-xs"
            >
              <MessageCircle className="h-3 w-3" />
              Commenter
            </Button>
          </div>
        </div>
      </div>
    </ModernCard>
  );
};

export default CommunityContentCard;
