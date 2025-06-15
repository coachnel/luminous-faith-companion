
import React, { useState } from 'react';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sparkles, Search, TrendingUp, Heart, BookOpen, Users, Star } from 'lucide-react';
import { useCommunityContent } from '@/hooks/useCommunityContent';
import CommunityContentCard from './CommunityContentCard';

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { content, loading } = useCommunityContent();

  const categories = [
    { id: 'all', label: 'Tout', icon: Sparkles },
    { id: 'prayer', label: 'Prières', icon: Heart },
    { id: 'verse', label: 'Versets', icon: BookOpen },
    { id: 'testimony', label: 'Témoignages', icon: Users },
    { id: 'note', label: 'Réflexions', icon: Star }
  ];

  const filteredContent = content.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTrendingTopics = () => {
    if (content.length === 0) return [];
    
    const topicCounts = new Map();
    
    content.forEach(item => {
      const words = [...item.title.toLowerCase().split(' '), ...item.content.toLowerCase().split(' ')]
        .filter(word => word.length > 4 && !['dans', 'avec', 'pour', 'cette', 'celui', 'celle', 'tous', 'toutes', 'faire', 'avoir', 'être', 'sera', 'était', 'seront', 'étaient'].includes(word))
        .slice(0, 3);
      
      words.forEach(word => {
        topicCounts.set(word, (topicCounts.get(word) || 0) + 1);
      });
    });

    return Array.from(topicCounts.entries())
      .filter(([word, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word, count]) => ({ name: word, count }));
  };

  const trendingTopics = getTrendingTopics();

  return (
    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6 max-w-4xl mx-auto min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* En-tête */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent-primary)' }}
            >
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] break-words">Découvrir</h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] break-words">Explorez le contenu de la communauté compagnon</p>
            </div>
          </div>
        </div>
      </ModernCard>

      {/* Barre de recherche */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
          <Input
            type="text"
            placeholder="Rechercher du contenu compagnon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </ModernCard>

      {/* Catégories */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">Catégories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <ModernButton
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? "primary" : "outline"}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="break-words">{category.label}</span>
                </ModernButton>
              );
            })}
          </div>
        </div>
      </ModernCard>

      {/* Sujets tendance */}
      {trendingTopics.length > 0 && (
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--accent-primary)]" />
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">Tendances de la communauté</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {trendingTopics.map((topic, index) => (
                <div
                  key={index}
                  className="p-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--border-default)] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)] break-words capitalize">{topic.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {topic.count} fois
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ModernCard>
      )}

      {/* Contenu de la communauté */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">Contenu de la communauté</h3>
            <Badge variant="outline" className="text-xs">
              {filteredContent.length} publications
            </Badge>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 sm:h-32 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContent.map((item) => (
                <CommunityContentCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {filteredContent.length === 0 && !loading && (
            <div className="text-center py-6 sm:py-8">
              <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-[var(--text-secondary)] mx-auto mb-4" />
              <h4 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-2">Aucun contenu trouvé</h4>
              <p className="text-[var(--text-secondary)] text-sm px-4">
                {content.length === 0 
                  ? "Soyez le premier à partager du contenu avec la communauté !"
                  : "Essayez d'autres mots-clés ou changez de catégorie"
                }
              </p>
            </div>
          )}
        </div>
      </ModernCard>
    </div>
  );
};

export default Discover;
