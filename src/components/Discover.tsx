import React, { useState } from 'react';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sparkles, Search, TrendingUp, Heart, Users, Star } from 'lucide-react';
import { useCommunityContent } from '@/hooks/useCommunityContent';
import CommunityContentCard from './CommunityContentCard';

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { content, loading } = useCommunityContent();

  // CORRECTION : Suppression de la catégorie "Versets" - Bible supprimée
  const categories = [
    { id: 'all', label: 'Tout', icon: Sparkles },
    { id: 'prayer', label: 'Prières', icon: Heart },
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
    <div className="p-3 sm:p-4 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <div className="space-y-4 sm:space-y-6">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-blue-50 border border-blue-100">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 break-words mb-1">Découvrir</h1>
              <p className="text-xs sm:text-base text-gray-600">Explorez les témoignages et réflexions de la communauté</p>
            </div>
          </div>
        </div>
        {/* Search + Categories in cards */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher des témoignages et réflexions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm w-full"
            />
          </div>
          <div className="flex flex-wrap gap-2 p-1">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <ModernButton
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? "primary" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {category.label}
                </ModernButton>
              );
            })}
          </div>
        </div>
        {/* Trending Topics (card) */}
        {trendingTopics.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <h3 className="text-base font-semibold text-gray-900">Sujets tendance</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic, idx) => (
                <span key={idx} className="rounded-lg bg-gray-50 px-3 py-1 text-sm text-gray-700 border border-gray-200">
                  {topic.name} <span className="ml-1 text-xs text-gray-400">({topic.count})</span>
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Community Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-gray-900">Contenu de la communauté</h3>
            <Badge variant="outline" className="text-xs">{filteredContent.length} publications</Badge>
          </div>
          {loading ? (
            <div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse mb-2"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredContent.map((item) => (
                <CommunityContentCard key={item.id} item={item} />
              ))}
            </div>
          )}
          {filteredContent.length === 0 && !loading && (
            <div className="text-center py-6">
              <Sparkles className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <h4 className="text-base font-semibold text-gray-900 mb-2">Aucun contenu trouvé</h4>
              <p className="text-gray-600 text-sm px-4">
                {content.length === 0 
                  ? "Soyez le premier à partager un témoignage ou une réflexion !"
                  : "Essayez d'autres mots-clés ou changez de catégorie"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;
