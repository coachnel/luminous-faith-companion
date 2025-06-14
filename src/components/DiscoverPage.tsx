
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, BookOpen, Star, Target, Users, Calendar, Search, Link, ThumbsUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCommunityContent } from '@/hooks/useCommunityContent';
import { useAuth } from '@/hooks/useAuth';

interface CommunityItem {
  id: string;
  type: 'note' | 'challenge' | 'prayer' | 'verse' | 'testimony';
  title: string;
  content: string;
  author_name: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  links?: string[];
  target_days?: number;
}

const DiscoverPage = () => {
  const [communityItems, setCommunityItems] = useState<CommunityItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CommunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { likeContent } = useCommunityContent();
  const { user } = useAuth();

  const typeIcons = {
    prayer: Heart,
    note: MessageCircle,
    verse: BookOpen,
    testimony: Star,
    challenge: Target
  };

  const typeLabels = {
    prayer: 'Prière',
    note: 'Note',
    verse: 'Verset',
    testimony: 'Témoignage',
    challenge: 'Défi'
  };

  const typeColors = {
    prayer: 'bg-red-100 text-red-700 border-red-200',
    note: 'bg-blue-100 text-blue-700 border-blue-200',
    verse: 'bg-green-100 text-green-700 border-green-200',
    testimony: 'bg-purple-100 text-purple-700 border-purple-200',
    challenge: 'bg-orange-100 text-orange-700 border-orange-200'
  };

  useEffect(() => {
    fetchCommunityContent();
  }, []);

  useEffect(() => {
    filterItems();
  }, [communityItems, searchQuery, activeFilter]);

  const fetchCommunityContent = async () => {
    try {
      setLoading(true);
      
      // Récupérer le contenu communautaire existant
      const { data: communityContent, error: communityError } = await supabase
        .from('community_content')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (communityError) throw communityError;

      // Récupérer les notes publiques
      const { data: publicNotes, error: notesError } = await supabase
        .from('notes')
        .select(`
          id,
          title,
          content,
          links,
          created_at,
          profiles!inner(name)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (notesError) throw notesError;

      // Récupérer les défis publics
      const { data: publicChallenges, error: challengesError } = await supabase
        .from('challenges')
        .select(`
          id,
          title,
          description,
          target_days,
          created_at,
          profiles!inner(name)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (challengesError) throw challengesError;

      // Combiner tout le contenu
      const allItems: CommunityItem[] = [
        ...(communityContent || []).map(item => ({
          id: item.id,
          type: item.type as any,
          title: item.title,
          content: item.content,
          author_name: item.author_name,
          created_at: item.created_at,
          likes_count: item.likes_count,
          comments_count: item.comments_count
        })),
        ...(publicNotes || []).map(note => ({
          id: note.id,
          type: 'note' as const,
          title: note.title,
          content: note.content,
          author_name: note.profiles?.name || 'Utilisateur',
          created_at: note.created_at,
          likes_count: 0,
          comments_count: 0,
          links: note.links
        })),
        ...(publicChallenges || []).map(challenge => ({
          id: challenge.id,
          type: 'challenge' as const,
          title: challenge.title,
          content: challenge.description || '',
          author_name: challenge.profiles?.name || 'Utilisateur',
          created_at: challenge.created_at,
          likes_count: 0,
          comments_count: 0,
          target_days: challenge.target_days
        }))
      ];

      // Trier par date de création
      allItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setCommunityItems(allItems);
    } catch (error) {
      console.error('Error fetching community content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = communityItems;

    // Filtrer par type
    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === activeFilter);
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query) ||
        item.author_name.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
  };

  const handleLike = (itemId: string) => {
    if (!user) return;
    likeContent(itemId);
  };

  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
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
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Star className="h-6 w-6" />
          Découvrir
        </h1>
        <p className="text-gray-600">
          Découvrez le contenu partagé par la communauté spirituelle
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher dans le contenu communautaire..."
            className="pl-10 glass border-white/30 bg-white/90"
          />
        </div>
      </div>

      {/* Filtres par type */}
      <Tabs value={activeFilter} onValueChange={setActiveFilter} className="mb-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="all">Tout</TabsTrigger>
          <TabsTrigger value="note">Notes</TabsTrigger>
          <TabsTrigger value="challenge">Défis</TabsTrigger>
          <TabsTrigger value="prayer">Prières</TabsTrigger>
          <TabsTrigger value="verse">Versets</TabsTrigger>
          <TabsTrigger value="testimony">Témoignages</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Contenu */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <div className="text-gray-500 mb-4">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucun contenu trouvé</p>
                <p className="text-sm">
                  {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Soyez le premier à partager !'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => {
            const IconComponent = typeIcons[item.type];
            const colorClass = typeColors[item.type];
            
            return (
              <Card key={item.id} className="transition-shadow hover:shadow-md glass border-white/30 bg-white/90">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Badge className={`${colorClass} flex items-center gap-1 flex-shrink-0`}>
                        <IconComponent className="h-3 w-3" />
                        {typeLabels[item.type]}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-3 w-3 flex-shrink-0" />
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
                      
                      {item.type === 'challenge' && item.target_days && (
                        <div className="mt-2 text-sm text-gray-600 flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Durée: {item.target_days} jours
                        </div>
                      )}
                      
                      {item.links && item.links.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {item.links.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <Link className="h-3 w-3" />
                              {link}
                            </a>
                          ))}
                        </div>
                      )}
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
          })
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;
