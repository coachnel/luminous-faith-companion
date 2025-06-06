
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
    <div className="glass rounded-2xl p-6 relative overflow-hidden h-full min-h-[200px]">
      <div className="absolute inset-0 bg-gradient-to-r from-spiritual-500/10 to-heavenly-500/10"></div>
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-spiritual-600 to-heavenly-600">
            Verset du jour ✨
          </h3>
          
          <blockquote className="text-lg italic text-gray-700 leading-relaxed min-h-[60px]">
            "{verse.text}"
          </blockquote>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <cite className="text-sm font-medium text-spiritual-600">
            {verse.book} {verse.chapter}:{verse.verse}
          </cite>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddToFavorites(verse)}
              className={`rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
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
