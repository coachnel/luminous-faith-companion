
import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNeonFavoriteVerses } from '@/hooks/useNeonData';
import VerseCard from './VerseCard';
import { toast } from '@/hooks/use-toast';

const FavoriteVerses = () => {
  const { favoriteVerses, loading, removeFavoriteVerse } = useNeonFavoriteVerses();

  const handleRemoveFavorite = async (verseId: string) => {
    try {
      await removeFavoriteVerse(verseId);
      toast({
        description: "Verset supprimé des favoris",
      });
    } catch (error) {
      toast({
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const clearAllFavorites = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) return;
    
    try {
      for (const verse of favoriteVerses) {
        await removeFavoriteVerse(verse.verse_id);
      }
      toast({
        description: "Tous les favoris ont été supprimés",
      });
    } catch (error) {
      toast({
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
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
              Versets favoris (Neon)
              <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full">
                {favoriteVerses.length}
              </span>
            </CardTitle>
            {favoriteVerses.length > 0 && (
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

      {favoriteVerses.length === 0 ? (
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
          {favoriteVerses.map((favoriteVerse, index) => {
            const verse = {
              book: favoriteVerse.book,
              chapter: favoriteVerse.chapter,
              verse: favoriteVerse.verse,
              text: favoriteVerse.text
            };
            
            return (
              <div key={`${favoriteVerse.id}-${index}`} className="relative">
                <VerseCard verse={verse} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFavorite(favoriteVerse.verse_id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoriteVerses;
