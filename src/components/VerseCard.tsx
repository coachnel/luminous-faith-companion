
import React, { useState, useEffect } from 'react';
import { Heart, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Verse } from '../types/bible';
import { toast } from '@/hooks/use-toast';

interface VerseCardProps {
  verse: Verse;
}

const VerseCard: React.FC<VerseCardProps> = ({ verse }) => {
  const verseId = `${verse.book}-${verse.chapter}-${verse.verse}`;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Charger l'état des favoris depuis localStorage
    const favorites = JSON.parse(localStorage.getItem('bibleFavorites') || '[]');
    setIsFavorite(favorites.includes(verseId));
  }, [verseId]);

  const handleFavoriteToggle = () => {
    const favorites = JSON.parse(localStorage.getItem('bibleFavorites') || '[]');
    
    if (isFavorite) {
      const updated = favorites.filter((id: string) => id !== verseId);
      localStorage.setItem('bibleFavorites', JSON.stringify(updated));
      setIsFavorite(false);
      toast({
        title: "Retiré des favoris",
        description: `${verse.book} ${verse.chapter}:${verse.verse}`,
        duration: 2000,
      });
    } else {
      const updated = [...favorites, verseId];
      localStorage.setItem('bibleFavorites', JSON.stringify(updated));
      setIsFavorite(true);
      toast({
        title: "⭐ Ajouté aux favoris",
        description: `${verse.book} ${verse.chapter}:${verse.verse}`,
        duration: 2000,
      });
    }
  };

  const handleShare = async () => {
    const shareText = `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${verse.book} ${verse.chapter}:${verse.verse}`,
          text: shareText,
        });
        toast({
          title: "Verset partagé",
          description: "Le verset a été partagé avec succès",
          duration: 2000,
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Verset copié",
          description: "Le verset a été copié dans le presse-papiers",
          duration: 2000,
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de copier le verset",
          variant: "destructive",
          duration: 2000,
        });
      }
    }
  };

  return (
    <Card className="w-full bg-white hover:shadow-lg transition-all duration-300 animate-fade-in border-purple-100 hover:border-purple-200">
      <CardHeader className="pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-semibold text-bible-primary">
            {verse.book} {verse.chapter}:{verse.verse}
          </h3>
          <div className="flex gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteToggle}
              className={`p-1.5 sm:p-2 hover:bg-purple-50 transition-colors ${
                isFavorite ? 'text-yellow-500' : 'text-gray-400'
              }`}
              aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-bible-primary hover:bg-purple-50 transition-colors"
              aria-label="Partager ce verset"
            >
              <Share className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6">
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base italic">
          "{verse.text}"
        </p>
      </CardContent>
    </Card>
  );
};

export default VerseCard;
