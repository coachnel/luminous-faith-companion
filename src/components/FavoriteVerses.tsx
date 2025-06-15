
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Trash2, Share2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

interface FavoriteVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
  addedAt: string;
}

const FavoriteVerses: React.FC = () => {
  const [favorites, setFavorites] = useLocalStorage<FavoriteVerse[]>('favoriteVerses', []);
  const [selectedVerses, setSelectedVerses] = useState<Set<string>>(new Set());

  const handleRemoveFavorite = (id: string) => {
    setFavorites(prev => prev.filter(verse => verse.id !== id));
    setSelectedVerses(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    toast.success('Verset retiré des favoris');
  };

  const handleSelectVerse = (id: string) => {
    setSelectedVerses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleShareSelected = () => {
    if (selectedVerses.size === 0) {
      toast.error('Veuillez sélectionner au moins un verset');
      return;
    }

    const selectedVersesData = favorites.filter(verse => selectedVerses.has(verse.id));
    const shareText = selectedVersesData
      .map(verse => `${verse.reference}: "${verse.text}"`)
      .join('\n\n');

    if (navigator.share) {
      navigator.share({
        title: 'Versets favoris',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Versets copiés dans le presse-papiers');
    }
  };

  const handleRemoveSelected = () => {
    if (selectedVerses.size === 0) {
      toast.error('Veuillez sélectionner au moins un verset');
      return;
    }

    setFavorites(prev => prev.filter(verse => !selectedVerses.has(verse.id)));
    setSelectedVerses(new Set());
    toast.success(`${selectedVerses.size} verset(s) supprimé(s)`);
  };

  if (favorites.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Versets favoris
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun verset favori.</p>
            <p className="text-sm text-gray-400 mt-2">
              Ajoutez des versets à vos favoris depuis la lecture de la Bible.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Versets favoris ({favorites.length})
          </CardTitle>
          {selectedVerses.size > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareSelected}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Partager ({selectedVerses.size})
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveSelected}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer ({selectedVerses.size})
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {favorites.map((verse) => (
            <div
              key={verse.id}
              className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                selectedVerses.has(verse.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSelectVerse(verse.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{verse.reference}</Badge>
                    <span className="text-xs text-gray-500">
                      Ajouté le {new Date(verse.addedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-800 leading-relaxed">{verse.text}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(verse.id);
                  }}
                  className="flex-shrink-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoriteVerses;
