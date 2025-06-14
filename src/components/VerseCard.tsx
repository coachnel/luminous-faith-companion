
import React from 'react';
import { Star, Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Verse } from '@/types/bible';
import { useNeonFavoriteVerses } from '@/hooks/useNeonData';
import { toast } from '@/hooks/use-toast';

interface VerseCardProps {
  verse: Verse;
}

const VerseCard: React.FC<VerseCardProps> = ({ verse }) => {
  const { favoriteVerses, addFavoriteVerse, removeFavoriteVerse } = useNeonFavoriteVerses();
  
  const verseId = `${verse.book}-${verse.chapter}-${verse.verse}`;
  const isFavorite = favoriteVerses.some(fv => fv.verse_id === verseId);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavoriteVerse(verseId);
        toast({
          description: "Verset retiré des favoris",
        });
      } else {
        await addFavoriteVerse({
          id: verseId,
          book: verse.book,
          chapter: verse.chapter,
          verse: verse.verse,
          text: verse.text,
          version: 'LSG',
          language: 'fr'
        });
        toast({
          description: "Verset ajouté aux favoris ⭐",
        });
      }
    } catch (error) {
      toast({
        description: "Erreur lors de la mise à jour des favoris",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    const text = `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`;
    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: "Verset copié dans le presse-papiers",
      });
    } catch (error) {
      toast({
        description: "Erreur lors de la copie",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const text = `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${verse.book} ${verse.chapter}:${verse.verse}`,
          text: text,
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      await handleCopy();
    }
  };

  return (
    <Card className="glass border-white/30 bg-white/90 hover:shadow-lg transition-all">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-purple-600 text-sm sm:text-base">
                {verse.book} {verse.chapter}:{verse.verse}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {verse.text}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className={`${
              isFavorite 
                ? 'text-yellow-500 hover:text-yellow-600' 
                : 'text-gray-400 hover:text-yellow-500'
            } hover:scale-110 transition-all`}
          >
            <Star size={16} className={isFavorite ? 'fill-current' : ''} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-gray-400 hover:text-blue-500 hover:scale-110 transition-all"
          >
            <Copy size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-gray-400 hover:text-green-500 hover:scale-110 transition-all"
          >
            <Share2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerseCard;
