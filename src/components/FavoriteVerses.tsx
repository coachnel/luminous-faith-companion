
import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Verse } from '@/types/bible';
import { getVerses } from '@/lib/bibleLoader';
import VerseCard from './VerseCard';

const FavoriteVerses = () => {
  const [favorites, setFavorites] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoriteIds = JSON.parse(localStorage.getItem('bibleFavorites') || '[]');
      const favoriteVerses: Verse[] = [];

      // Charger chaque verset favori
      for (const verseId of favoriteIds) {
        const [book, chapter, verse] = verseId.split('-');
        try {
          const verses = await getVerses(book, parseInt(chapter));
          const favoriteVerse = verses.find(v => v.verse === parseInt(verse));
          if (favoriteVerse) {
            favoriteVerses.push(favoriteVerse);
          }
        } catch (error) {
          console.error(`Erreur lors du chargement du verset favori ${verseId}:`, error);
        }
      }

      setFavorites(favoriteVerses);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (verseId: string) => {
    try {
      const favoriteIds = JSON.parse(localStorage.getItem('bibleFavorites') || '[]');
      const updatedIds = favoriteIds.filter((id: string) => id !== verseId);
      localStorage.setItem('bibleFavorites', JSON.stringify(updatedIds));
      loadFavorites();
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
    }
  };

  const clearAllFavorites = () => {
    localStorage.removeItem('bibleFavorites');
    setFavorites([]);
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4 max-w-4xl mx-auto">
        <Card className="glass border-white/30">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Chargement des favoris...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              Explorez la Bible et ajoutez vos versets préférés en cliquant sur l'étoile ⭐
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
