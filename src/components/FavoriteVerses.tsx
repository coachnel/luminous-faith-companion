
import React from 'react';
import { Heart, Share, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFavoriteVerses } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';

const FavoriteVerses = () => {
  const { favoriteVerses, removeFavoriteVerse } = useFavoriteVerses();

  const handleShare = (verse: any) => {
    if (navigator.share) {
      navigator.share({
        title: 'Verset favori',
        text: `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`,
      });
    } else {
      navigator.clipboard.writeText(`"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`);
      toast({
        description: "Verset copié dans le presse-papier",
      });
    }
  };

  const handleRemove = async (verseId: string) => {
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

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="text-red-500" size={24} />
            Mes versets favoris
            <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full">
              {favoriteVerses.length}
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      {favoriteVerses.length === 0 ? (
        <Card className="glass border-white/30">
          <CardContent className="p-8 text-center">
            <Heart className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold mb-2">Aucun verset favori</h3>
            <p className="text-gray-600 mb-4">
              Commencez à ajouter des versets à vos favoris depuis la Bible ou le verset du jour
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {favoriteVerses.map((verse) => (
            <Card key={verse.id} className="glass border-white/30 hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-spiritual-600 bg-spiritual-100 px-3 py-1 rounded-full">
                      {verse.book} {verse.chapter}:{verse.verse}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {verse.version}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(verse)}
                      className="text-gray-500 hover:text-spiritual-600"
                    >
                      <Share size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(verse.verse_id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                <p className="text-lg leading-relaxed text-gray-700 italic mb-3">
                  "{verse.text}"
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Ajouté le {new Date(verse.created_at).toLocaleDateString('fr-FR')}
                  </span>
                  <span className="text-xs text-gray-400">
                    {verse.language.toUpperCase()}
                  </span>
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
