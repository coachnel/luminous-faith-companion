
import React, { useState, useEffect } from 'react';
import { Heart, Share, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDailyVerse, getRandomVerse } from '@/lib/dailyVerse';
import { Verse } from '@/types/bible';

const DailyVerse = () => {
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Charger le verset du jour
    const verse = getDailyVerse();
    setCurrentVerse(verse);

    // Vérifier si c'est un favori
    const favorites = JSON.parse(localStorage.getItem('bibleFavorites') || '[]');
    const verseId = `${verse.book}-${verse.chapter}-${verse.verse}`;
    setIsFavorite(favorites.includes(verseId));

    // Programmer le rafraîchissement automatique à minuit
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const midnightTimer = setTimeout(() => {
      const newVerse = getDailyVerse();
      setCurrentVerse(newVerse);
      
      // Programmer les rafraîchissements suivants toutes les 24h
      const intervalId = setInterval(() => {
        const verse = getDailyVerse();
        setCurrentVerse(verse);
      }, 24 * 60 * 60 * 1000);
      
      return () => clearInterval(intervalId);
    }, timeUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, []);

  const handleFavoriteToggle = () => {
    if (!currentVerse) return;
    
    const verseId = `${currentVerse.book}-${currentVerse.chapter}-${currentVerse.verse}`;
    const favorites = JSON.parse(localStorage.getItem('bibleFavorites') || '[]');
    
    if (isFavorite) {
      const updated = favorites.filter((id: string) => id !== verseId);
      localStorage.setItem('bibleFavorites', JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      const updated = [...favorites, verseId];
      localStorage.setItem('bibleFavorites', JSON.stringify(updated));
      setIsFavorite(true);
    }
  };

  const handleShare = async () => {
    if (!currentVerse) return;
    
    const shareText = `"${currentVerse.text}" - ${currentVerse.book} ${currentVerse.chapter}:${currentVerse.verse}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Verset du jour',
          text: shareText,
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
      } catch (error) {
        console.error('Erreur lors de la copie');
      }
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newVerse = getRandomVerse();
      setCurrentVerse(newVerse);
      setIsLoading(false);
    }, 500);
  };

  if (!currentVerse) {
    return (
      <div className="glass rounded-2xl p-6 relative overflow-hidden h-full min-h-[200px] animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 relative overflow-hidden h-full min-h-[200px] bg-white/90">
      <div className="absolute inset-0 bg-gradient-to-r from-spiritual-500/10 to-heavenly-500/10"></div>
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-spiritual-600 to-heavenly-600">
              Verset du jour ✨
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-1"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </Button>
          </div>
          
          <blockquote className="text-lg italic text-gray-700 leading-relaxed min-h-[60px]">
            "{currentVerse.text}"
          </blockquote>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <cite className="text-sm font-medium text-spiritual-600">
            {currentVerse.book} {currentVerse.chapter}:{currentVerse.verse}
          </cite>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteToggle}
              className={`rounded-full ${isFavorite ? 'text-yellow-500' : 'text-gray-500'}`}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="rounded-full text-gray-500 hover:text-spiritual-600"
            >
              <Share size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyVerse;
