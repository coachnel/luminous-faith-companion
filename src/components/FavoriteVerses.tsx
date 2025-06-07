import React, { useState } from 'react';
import { Trash2, Book } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useBible from '@/hooks/useBible';
import { toast } from '@/hooks/use-toast';

const FavoriteVerses = () => {
  const { favorites, toggleFavorite } = useBible();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVerses = favorites.filter(verse =>
    verse.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    verse.book.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveFavorite = (verseId: string) => {
    toggleFavorite(verseId);
    toast({
      description: "Verset retiré des favoris",
    });
  };

  const copyVerse = (verse: any) => {
    const text = `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`;
    navigator.clipboard.writeText(text);
    toast({
      description: "Verset copié dans le presse-papiers",
    });
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            Mes Versets Favoris
            <span className="text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
              {favorites.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Rechercher un verset..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="space-y-2 mt-4">
            {filteredVerses.map(verse => (
              <div key={verse.id} className="flex items-center justify-between p-2 bg-white rounded shadow">
                <div>
                  <p className="text-sm font-medium">{verse.text}</p>
                  <p className="text-xs text-gray-500">{verse.book} {verse.chapter}:{verse.verse}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => copyVerse(verse)}>
                    <Book size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveFavorite(verse.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FavoriteVerses;
