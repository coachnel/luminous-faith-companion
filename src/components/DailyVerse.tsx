
import React from 'react';
import { Heart, Share } from 'lucide-react';
import { BibleVerse } from '../types';
import { Button } from '@/components/ui/button';

interface DailyVerseProps {
  verse: BibleVerse;
  onAddToFavorites: (verse: BibleVerse) => void;
  isFavorite: boolean;
}

const DailyVerse: React.FC<DailyVerseProps> = ({ verse, onAddToFavorites, isFavorite }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Verset du jour',
        text: `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`,
      });
    } else {
      navigator.clipboard.writeText(`"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`);
    }
  };

  return (
    <div className="verse-card relative overflow-hidden">
      <div className="absolute inset-0 spiritual-gradient opacity-10 animate-pulse"></div>
      <div className="relative z-10">
        <h3 className="text-lg font-semibold mb-4 glow-text">
          Verset du jour ✨
        </h3>
        
        <blockquote className="text-lg italic mb-4 text-gray-700 leading-relaxed">
          "{verse.text}"
        </blockquote>
        
        <div className="flex items-center justify-between">
          <cite className="text-sm font-medium text-spiritual-600">
            {verse.book} {verse.chapter}:{verse.verse}
          </cite>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddToFavorites(verse)}
              className={`rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-500'} hover:scale-110 transition-all`}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="rounded-full text-gray-500 hover:text-spiritual-600 hover:scale-110 transition-all"
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
