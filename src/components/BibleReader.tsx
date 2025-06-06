
import React, { useState } from 'react';
import { Search, Book, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bibleBooks, dailyVerses } from '../data/bibleVerses';
import { BibleVerse } from '../types';

interface BibleReaderProps {
  onAddToFavorites: (verse: BibleVerse) => void;
  favoriteVerses: string[];
}

const BibleReader: React.FC<BibleReaderProps> = ({ onAddToFavorites, favoriteVerses }) => {
  const [selectedBook, setSelectedBook] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentVerses, setCurrentVerses] = useState(dailyVerses);

  const handleSearch = () => {
    if (!searchTerm) {
      setCurrentVerses(dailyVerses);
      return;
    }

    const filtered = dailyVerses.filter(verse =>
      verse.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verse.book.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCurrentVerses(filtered);
  };

  const handleBookSelect = (bookName: string) => {
    setSelectedBook(bookName);
    const filtered = dailyVerses.filter(verse => verse.book === bookName);
    setCurrentVerses(filtered.length ? filtered : dailyVerses);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 glow-text">
          <Book size={28} />
          Lecture de la Bible
        </h2>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Rechercher un verset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass border-white/30"
            />
            <Button onClick={handleSearch} className="spiritual-gradient">
              <Search size={18} />
            </Button>
          </div>

          <Select onValueChange={handleBookSelect}>
            <SelectTrigger className="glass border-white/30">
              <SelectValue placeholder="Choisir un livre..." />
            </SelectTrigger>
            <SelectContent className="glass border-white/30 backdrop-blur-md">
              {bibleBooks.map((book) => (
                <SelectItem key={book.name} value={book.name}>
                  {book.name} ({book.chapters} chapitres)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {currentVerses.map((verse) => (
          <div key={verse.id} className="verse-card">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-spiritual-600 bg-spiritual-100 px-3 py-1 rounded-full">
                {verse.book} {verse.chapter}:{verse.verse}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddToFavorites(verse)}
                className={`${
                  favoriteVerses.includes(verse.id) ? 'text-red-500' : 'text-gray-400'
                } hover:scale-110 transition-all`}
              >
                <Heart size={18} fill={favoriteVerses.includes(verse.id) ? 'currentColor' : 'none'} />
              </Button>
            </div>
            
            <p className="text-lg leading-relaxed text-gray-700 italic">
              "{verse.text}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BibleReader;
