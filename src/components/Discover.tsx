
import React, { useState } from 'react';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sparkles, Search, TrendingUp, Heart, BookOpen, Users, Calendar, Star, Eye, MessageCircle } from 'lucide-react';
import { useCommunityContent } from '@/hooks/useCommunityContent';

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

  // Filtrer le contenu basé sur la catégorie et la recherche
  const filteredContent = content.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculer les sujets tendance basés sur le contenu réel
  const getTrendingTopics = () => {
    const topicCounts = new Map();
    
    content.forEach(item => {
      // Extraire des mots-clés du titre et du contenu
      const words = [...item.title.toLowerCase().split(' '), ...item.content.toLowerCase().split(' ')]
        .filter(word => word.length > 3)
        .slice(0, 5); // Limiter pour éviter trop de mots
      
      words.forEach(word => {
        topicCounts.set(word, (topicCounts.get(word) || 0) + 1);
      });
    });

    return Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({ name: word, count }));
  };

  const trendingTopics = getTrendingTopics();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prayer': return Heart;
      case 'verse': return BookOpen;
      case 'testimony': return Users;
      case 'note': return Star;
      default: return Sparkles;
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
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] break-words">Explorez le contenu de la communauté spirituelle</p>
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
            placeholder="Rechercher du contenu spirituel..."
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

      {/* Sujets tendance - seulement si on a du contenu */}
      {trendingTopics.length > 0 && (
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--accent-primary)]" />
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">Tendances</h3>
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
                      {topic.count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ModernCard>
      )}

      {/* Contenu mis en avant */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">Contenu de la communauté</h3>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 sm:h-32 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContent.map((item) => {
                const TypeIcon = getTypeIcon(item.type);
                return (
                  <ModernCard 
                    key={item.id} 
                    className="p-3 sm:p-4 bg-[var(--bg-secondary)] border-[var(--border-default)] hover:shadow-md transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge className={`text-xs ${getTypeColor(item.type)}`}>
                              <TypeIcon className="h-3 w-3 mr-1" />
                              {getTypeLabel(item.type)}
                            </Badge>
                            <span className="text-xs text-[var(--text-secondary)]">par {item.author_name}</span>
                            <span className="text-xs text-[var(--text-secondary)]">• {new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <h4 className="font-semibold text-[var(--text-primary)] mb-1 text-sm sm:text-base break-words">{item.title}</h4>
                          <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 break-words leading-relaxed">{item.content}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[var(--border-default)] text-xs text-[var(--text-secondary)]">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{item.likes_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{item.comments_count}</span>
                        </div>
                      </div>
                    </div>
                  </ModernCard>
                );
              })}
            </div>
          )}

          {filteredContent.length === 0 && !loading && (
            <div className="text-center py-6 sm:py-8">
              <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-[var(--text-secondary)] mx-auto mb-4" />
              <h4 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-2">Aucun contenu trouvé</h4>
              <p className="text-[var(--text-secondary)] text-sm px-4">
                {content.length === 0 
                  ? "Aucun contenu n'a encore été partagé par la communauté"
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
