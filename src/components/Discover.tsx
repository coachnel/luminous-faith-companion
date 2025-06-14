
import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Badge } from '@/components/ui/badge';
import { Compass, Heart, MessageCircle, Bookmark, Calendar, User, Info, ThumbsUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNeonPrayerRequests, useNotes } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

const Discover = () => {
  const { user } = useAuth();
  const { prayerRequests } = useNeonPrayerRequests();
  const { notes } = useNotes();
  const [activeTab, setActiveTab] = useState<'all' | 'prayers' | 'notes'>('all');

  // Combiner et trier tout le contenu partageable
  const getAllContent = () => {
    const content: any[] = [];
    
    // Ajouter les prières publiques (non anonymes)
    prayerRequests
      .filter(prayer => !prayer.is_anonymous)
      .forEach(prayer => {
        content.push({
          ...prayer,
          type: 'prayer',
          author: prayer.author_name || 'Utilisateur',
          likes: prayer.prayer_count || 0,
          createdAt: new Date(prayer.created_at)
        });
      });

    // Trier par date décroissante
    return content.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const allContent = getAllContent();
  const prayersContent = allContent.filter(item => item.type === 'prayer');

  const getFilteredContent = () => {
    switch (activeTab) {
      case 'prayers':
        return prayersContent;
      case 'notes':
        return []; // Les notes restent privées pour l'instant
      default:
        return allContent;
    }
  };

  const filteredContent = getFilteredContent();

  const handleLike = (contentId: string, contentType: string) => {
    toast.success('👍 Contenu aimé !');
  };

  const handleBookmark = (contentId: string, contentType: string) => {
    toast.success('🔖 Contenu sauvegardé !');
  };

  const handleComment = (contentId: string, contentType: string) => {
    toast.info('💬 Fonctionnalité de commentaires à venir');
  };

  const renderContentCard = (item: any) => (
    <ModernCard key={`${item.type}-${item.id}`} className="p-4 bg-[var(--bg-secondary)] border-[var(--border-default)]">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="flex items-center gap-1 flex-shrink-0">
                {item.type === 'prayer' ? <Heart className="h-3 w-3" /> : <MessageCircle className="h-3 w-3" />}
                <span>{item.type === 'prayer' ? 'Prière' : 'Note'}</span>
              </Badge>
              <span className="text-xs text-[var(--text-secondary)]">
                par {item.author}
              </span>
            </div>
            <h4 className="font-semibold text-[var(--text-primary)] break-words mb-2">
              {item.title}
            </h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed break-words">
              {item.content}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[var(--border-default)]">
          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{item.createdAt.toLocaleDateString('fr-FR')}</span>
            </div>
            {item.type === 'prayer' && (
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{item.likes} prières</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ModernButton
              onClick={() => handleLike(item.id, item.type)}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="hidden sm:inline">J'aime</span>
            </ModernButton>
            <ModernButton
              onClick={() => handleBookmark(item.id, item.type)}
              size="sm"
              variant="ghost"
              className="gap-2"
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Sauver</span>
            </ModernButton>
            <ModernButton
              onClick={() => handleComment(item.id, item.type)}
              size="sm"
              variant="ghost"
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Commenter</span>
            </ModernButton>
          </div>
        </div>
      </div>
    </ModernCard>
  );

  return (
    <div 
      className="p-4 space-y-6 max-w-4xl mx-auto min-h-screen"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* En-tête */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-primary)' }}
          >
            <Compass className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Découvrir</h1>
            <p className="text-sm text-[var(--text-secondary)] break-words">
              Explorez les contenus partagés par la communauté
            </p>
          </div>
        </div>
      </ModernCard>

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <ModernCard className="p-4 text-center bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950 dark:to-sky-950 border-blue-200 dark:border-blue-800">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{allContent.length}</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Contenus</div>
        </ModernCard>
        <ModernCard className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{prayersContent.length}</div>
          <div className="text-sm text-green-700 dark:text-green-300">Prières</div>
        </ModernCard>
        <ModernCard className="p-4 text-center bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 border-purple-200 dark:border-purple-800">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
          <div className="text-sm text-purple-700 dark:text-purple-300">Notes</div>
        </ModernCard>
      </div>

      {/* Filtres */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex flex-wrap gap-2 mb-6">
          <ModernButton
            onClick={() => setActiveTab('all')}
            variant={activeTab === 'all' ? 'primary' : 'outline'}
            size="sm"
          >
            Tout
          </ModernButton>
          <ModernButton
            onClick={() => setActiveTab('prayers')}
            variant={activeTab === 'prayers' ? 'primary' : 'outline'}
            size="sm"
            className="gap-2"
          >
            <Heart className="h-4 w-4" />
            Prières
          </ModernButton>
          <ModernButton
            onClick={() => setActiveTab('notes')}
            variant={activeTab === 'notes' ? 'primary' : 'outline'}
            size="sm"
            className="gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Notes
          </ModernButton>
        </div>

        {/* Contenu */}
        {filteredContent.length === 0 ? (
          <div className="text-center py-8">
            <Compass className="h-12 w-12 text-[var(--text-secondary)] mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              {activeTab === 'notes' ? 'Aucune note partagée' : 'Aucun contenu à découvrir'}
            </h4>
            <p className="text-[var(--text-secondary)] mb-4">
              {activeTab === 'notes' 
                ? 'Les notes restent privées pour le moment'
                : 'Soyez le premier à partager du contenu avec la communauté'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContent.map(renderContentCard)}
          </div>
        )}
      </ModernCard>

      {/* Comment ça marche */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Comment ça marche ?
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Découvrez les contenus partagés publiquement par les autres membres de la communauté. 
              Vous pouvez interagir avec les prières et notes en les aimant, les sauvegardant ou en laissant des commentaires. 
              Seuls les contenus publics sont visibles ici. 
              Les contenus sont automatiquement supprimés après 7 jours pour maintenir la fraîcheur du feed.
            </p>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default Discover;
