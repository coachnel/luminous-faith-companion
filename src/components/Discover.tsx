import React, { useState } from 'react';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sparkles, Search, TrendingUp, Heart, Users, Star, Target } from 'lucide-react';
import { useCommunityContent } from '@/hooks/useCommunityContent';
import CommunityContentCard from './CommunityContentCard';

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { content, loading } = useCommunityContent();

  // Only 5 categories - NO "Verses" filter
  const categories = [
    { id: 'all', label: 'Tout', icon: Sparkles },
    { id: 'prayer', label: 'Prières', icon: Heart },
    { id: 'note', label: 'Notes', icon: Star },
    { id: 'challenge', label: 'Défis', icon: Target },
    { id: 'testimony', label: 'Témoignages', icon: Users }
  ];

  const filteredContent = content.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ... keep existing code (getTrendingTopics function)
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
    <div className="p-3 sm:p-4 lg:p-6 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <div className="space-y-4 sm:space-y-6">
        {/* Header with blue circular background and white icon */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words mb-1">Découvrir</h1>
              <p className="text-xs sm:text-base text-gray-600 break-words">Explorez les témoignages et réflexions de la communauté</p>
            </div>
          </div>
        </div>

        {/* Search + Filter Buttons - Single Row Layout */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher des témoignages et réflexions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm sm:text-base w-full rounded-lg sm:rounded-xl"
            />
          </div>
          
          {/* Filter Buttons - Horizontal Single Line with Blue Styling */}
          <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === category.id 
                      ? 'shadow-lg shadow-blue-600/25 scale-105' 
                      : ''
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trending Topics - improved responsive design */}
        {trendingTopics.length > 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <TrendingUp className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Sujets tendance</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic, idx) => (
                <span key={idx} className="rounded-lg bg-gray-50 px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-700 border border-gray-200 break-words">
                  {topic.name} <span className="ml-1 text-xs text-gray-400">({topic.count})</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Community Content - improved spacing */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Contenu de la communauté</h3>
            <Badge variant="outline" className="text-xs">{filteredContent.length} publications</Badge>
          </div>
          
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 sm:h-20 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredContent.map((item) => (
                <CommunityContentCard key={item.id} item={item} />
              ))}
            </div>
          )}
          
          {filteredContent.length === 0 && !loading && (
            <div className="text-center py-6 sm:py-8">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mx-auto mb-3" />
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Aucun contenu trouvé</h4>
              <p className="text-gray-600 text-xs sm:text-sm px-4">
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
