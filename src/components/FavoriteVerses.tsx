
import React, { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Verse } from '@/types/bible';
import VerseCard from './VerseCard';

const FavoriteVerses = () => {
  const [favorites, setFavorites] = useState<Verse[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const storedFavorites = localStorage.getItem('bibleFavorites');
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        // For now, we'll create mock verses since we don't have a complete favorite verse storage system
        const mockFavorites: Verse[] = favoriteIds.map((id: string, index: number) => ({
          book: 'Psaume',
          chapter: 23,
          verse: index + 1,
          text: `Verset favori ${index + 1} - L'Éternel est mon berger: je ne manquerai de rien.`
        }));
        setFavorites(mockFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    }
  };

  const removeFavorite = (verseId: string) => {
    try {
      const storedFavorites = localStorage.getItem('bibleFavorites');
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        const updatedIds = favoriteIds.filter((id: string) => id !== verseId);
        localStorage.setItem('bibleFavorites', JSON.stringify(updatedIds));
        loadFavorites();
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const clearAllFavorites = () => {
    localStorage.removeItem('bibleFavorites');
    setFavorites([]);
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <Card className="glass border-white/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="text-red-500" size={24} />
              Versets favoris
              <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full">
                {favorites.length}
              </span>
            </CardTitle>
            {favorites.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFavorites}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} className="mr-2" />
                Tout supprimer
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {favorites.length === 0 ? (
        <Card className="glass border-white/30">
          <CardContent className="p-8 text-center">
            <Heart className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold mb-2">Aucun verset favori</h3>
            <p className="text-gray-600">
              Explorez la Bible et ajoutez vos versets préférés en cliquant sur le cœur
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {favorites.map((verse, index) => (
            <div key={`${verse.book}-${verse.chapter}-${verse.verse}-${index}`} className="relative">
              <VerseCard verse={verse} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFavorite(`${verse.book}-${verse.chapter}-${verse.verse}`)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteVerses;
