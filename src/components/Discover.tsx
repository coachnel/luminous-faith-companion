import React, { useState, useEffect, useMemo } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Badge } from '@/components/ui/badge';
import { Compass, Heart, MessageCircle, Bookmark, Calendar, ThumbsUp, Info, Loader2, Target, PenTool, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNeonPrayerRequests, useNeonNotes } from '@/hooks/useNeonData';
import { useCommunityContent } from '@/hooks/useCommunityContent';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

const Discover = () => {
  const { user } = useAuth();
  const { prayerRequests, loading: prayersLoading } = useNeonPrayerRequests();
  const { notes, loading: notesLoading } = useNeonNotes();
  const { content: communityContent, loading: communityLoading } = useCommunityContent();
  const [activeTab, setActiveTab] = useState<'all' | 'prayers' | 'notes' | 'challenges'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Combiner tout le contenu partagé avec optimisation
  const allContent = useMemo(() => {
    const content: any[] = [];
    
    // Ajouter les prières publiques (non anonymes)
    prayerRequests
      .filter(prayer => !prayer.is_anonymous)
      .slice(0, 30)
      .forEach(prayer => {
        content.push({
          ...prayer,
          type: 'prayer',
          author: prayer.author_name || 'Utilisateur',
          likes: prayer.prayer_count || 0,
          createdAt: new Date(prayer.created_at)
        });
      });

    // Ajouter le contenu communautaire (notes, témoignages, etc.)
    communityContent
      .filter(item => item.is_public)
      .slice(0, 50)
      .forEach(item => {
        content.push({
          ...item,
          type: item.type,
          author: item.author_name,
          likes: item.likes_count || 0,
          createdAt: new Date(item.created_at)
        });
      });

    // Trier par date décroissante
    return content
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 100);
  }, [prayerRequests, communityContent]);

  const getFilteredContent = useMemo(() => {
    switch (activeTab) {
      case 'prayers':
        return allContent.filter(item => item.type === 'prayer');
      case 'notes':
        return allContent.filter(item => item.type === 'note');
      case 'challenges':
        return allContent.filter(item => item.type === 'challenge');
      default:
        return allContent;
    }
  }, [activeTab, allContent]);

  // Pagination optimisée
  const paginatedContent = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return getFilteredContent.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [getFilteredContent, currentPage]);

  const totalPages = Math.ceil(getFilteredContent.length / ITEMS_PER_PAGE);

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleLike = (contentId: string, contentType: string) => {
    toast.success('👍 Contenu aimé !');
  };

  const handleBookmark = (contentId: string, contentType: string) => {
    toast.success('🔖 Contenu sauvegardé !');
  };

  const handleComment = (contentId: string, contentType: string) => {
    toast.info('💬 Fonctionnalité de commentaires à venir');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prayer': return Heart;
      case 'note': return PenTool;
      case 'testimony': return MessageCircle;
      case 'verse': return BookOpen;
      case 'challenge': return Target;
      default: return MessageCircle;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'prayer': return 'Prière';
      case 'note': return 'Note';
      case 'testimony': return 'Témoignage';
      case 'verse': return 'Verset';
      case 'challenge': return 'Défi';
      default: return 'Contenu';
    }
  };

  const renderContentCard = (item: any) => {
    const IconComponent = getTypeIcon(item.type);
    const typeLabel = getTypeLabel(item.type);

    return (
      <ModernCard key={`${item.type}-${item.id}`} className="p-4 bg-[var(--bg-secondary)] border-[var(--border-default)]">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default" className="flex items-center gap-1 flex-shrink-0">
                  <IconComponent className="h-3 w-3" />
                  <span>{typeLabel}</span>
                </Badge>
                <span className="text-xs text-[var(--text-secondary)] truncate">
                  par {item.author}
                </span>
              </div>
              <h4 className="font-semibold text-[var(--text-primary)] break-words mb-2 line-clamp-2">
                {item.title}
              </h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed break-words line-clamp-3">
                {item.content}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[var(--border-default)]">
            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>{item.createdAt.toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 flex-shrink-0" />
                <span>{item.likes} {item.type === 'prayer' ? 'prières' : 'j\'aime'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ModernButton
                onClick={() => handleLike(item.id, item.type)}
                size="sm"
                variant="outline"
                className="gap-2 text-xs"
              >
                <ThumbsUp className="h-4 w-4" />
                <span className="hidden sm:inline">J'aime</span>
              </ModernButton>
              <ModernButton
                onClick={() => handleBookmark(item.id, item.type)}
                size="sm"
                variant="ghost"
                className="gap-2 text-xs"
              >
                <Bookmark className="h-4 w-4" />
                <span className="hidden sm:inline">Sauver</span>
              </ModernButton>
            </div>
          </div>
        </div>
      </ModernCard>
    );
  };

  const loading = prayersLoading || notesLoading || communityLoading;

  // Compter les contenus par type
  const prayersCount = allContent.filter(item => item.type === 'prayer').length;
  const notesCount = allContent.filter(item => item.type === 'note').length;
  const challengesCount = allContent.filter(item => item.type === 'challenge').length;

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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ModernCard className="p-4 text-center bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950 dark:to-sky-950 border-blue-200 dark:border-blue-800">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{allContent.length}</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Total</div>
        </ModernCard>
        <ModernCard className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{prayersCount}</div>
          <div className="text-sm text-green-700 dark:text-green-300">Prières</div>
        </ModernCard>
        <ModernCard className="p-4 text-center bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 border-purple-200 dark:border-purple-800">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{notesCount}</div>
          <div className="text-sm text-purple-700 dark:text-purple-300">Notes</div>
        </ModernCard>
        <ModernCard className="p-4 text-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border-orange-200 dark:border-orange-800">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{challengesCount}</div>
          <div className="text-sm text-orange-700 dark:text-orange-300">Défis</div>
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
            <PenTool className="h-4 w-4" />
            Notes
          </ModernButton>
          <ModernButton
            onClick={() => setActiveTab('challenges')}
            variant={activeTab === 'challenges' ? 'primary' : 'outline'}
            size="sm"
            className="gap-2"
          >
            <Target className="h-4 w-4" />
            Défis
          </ModernButton>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-primary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Chargement du contenu...</p>
          </div>
        ) : (
          <>
            {/* Contenu */}
            {paginatedContent.length === 0 ? (
              <div className="text-center py-8">
                <Compass className="h-12 w-12 text-[var(--text-secondary)] mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Aucun contenu à découvrir
                </h4>
                <p className="text-[var(--text-secondary)] mb-4">
                  Soyez le premier à partager du contenu avec la communauté
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedContent.map(renderContentCard)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6 pt-6 border-t border-[var(--border-default)]">
                    <ModernButton
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                    >
                      Précédent
                    </ModernButton>
                    <span className="text-sm text-[var(--text-secondary)]">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <ModernButton
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                    >
                      Suivant
                    </ModernButton>
                  </div>
                )}
              </>
            )}
          </>
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
              Découvrez tous les contenus partagés publiquement par les membres de la communauté : 
              prières, notes spirituelles, témoignages et défis. Vous pouvez interagir avec ces contenus 
              en les aimant ou en les sauvegardant. Seuls les contenus marqués comme publics sont visibles ici.
            </p>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default Discover;
