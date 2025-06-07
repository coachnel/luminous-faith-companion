
import React, { useState } from 'react';
import { Star, Trash2, Book, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFavoriteVerses } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';

const FavoriteVerses = () => {
  const { favoriteVerses, loading, removeFavoriteVerse } = useFavoriteVerses();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVerses = favoriteVerses.filter(verse =>
    verse.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    verse.book.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveFavorite = async (verseId: string) => {
    try {
      await removeFavoriteVerse(verseId);
      toast({
        description: "Verset retiré des favoris",
      });
    } catch (error) {
      toast({
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const copyVerse = (verse: any) => {
    const text = `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`;
    navigator.clipboard.writeText(text);
    toast({
      description: "Verset copié dans le presse-papiers",
    });
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="text-yellow-500" size={24} fill="currentColor" />
            Mes Versets Favoris
            <span className="text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
              {favoriteVerses.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Rechercher dans vos favoris..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass border-white/30"
            />
            <Button variant="outline" className="glass border-white/30">
              <Search size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card className="glass border-white/30">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-spiritual-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Chargement de vos versets favoris...</p>
          </CardContent>
        </Card>
      ) : filteredVerses.length === 0 ? (
        <Card className="glass border-white/30">
          <CardContent className="p-8 text-center">
            <Star className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold mb-2">
              {favoriteVerses.length === 0 ? "Aucun verset favori" : "Aucun résultat"}
            </h3>
            <p className="text-gray-600">
              {favoriteVerses.length === 0 
                ? "Ajoutez des versets à vos favoris en explorant la Bible"
                : "Aucun verset ne correspond à votre recherche"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredVerses.map((verse) => (
            <Card key={verse.id} className="glass border-white/30 hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Book className="text-spiritual-600" size={16} />
                      <span className="text-sm font-semibold text-spiritual-600">
                        {verse.book} {verse.chapter}:{verse.verse}
                      </span>
                      <span className="text-xs text-gray-500">
                        • {verse.version}
                      </span>
                    </div>
                    <p className="text-gray-800 leading-relaxed mb-3 text-content">
                      "{verse.text}"
                    </p>
                    <div className="text-xs text-gray-500">
                      Ajouté le {new Date(verse.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => copyVerse(verse)}
                      variant="outline"
                      size="sm"
                      className="text-spiritual-600 border-spiritual-200"
                    >
                      Copier
                    </Button>
                    <Button
                      onClick={() => handleRemoveFavorite(verse.verse_id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteVerses;
