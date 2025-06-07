
import React, { useState } from 'react';
import { Search, Heart, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bibleBooks, dailyVerses } from '@/data/bibleVerses';
import { useFavoriteVerses } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';

const BibleApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('LSG');
  const [currentVerses, setCurrentVerses] = useState(dailyVerses);
  const { favoriteVerses, addFavoriteVerse, removeFavoriteVerse } = useFavoriteVerses();

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
    if (bookName === 'all') {
      setCurrentVerses(dailyVerses);
    } else {
      const filtered = dailyVerses.filter(verse => verse.book === bookName);
      setCurrentVerses(filtered.length ? filtered : dailyVerses);
    }
  };

  const handleToggleFavorite = async (verse: any) => {
    try {
      const isFavorite = favoriteVerses.some(fv => fv.verse_id === verse.id);
      
      if (isFavorite) {
        await removeFavoriteVerse(verse.id);
        toast({
          description: "Verset retiré des favoris",
        });
      } else {
        await addFavoriteVerse(verse);
        toast({
          description: "Verset ajouté aux favoris ❤️",
        });
      }
    } catch (error) {
      toast({
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    }
  };

  const bibleVersions = [
    { value: 'LSG', label: 'Louis Segond (1910)' },
    { value: 'KJV', label: 'King James Version' },
    { value: 'NIV', label: 'New International Version' },
    { value: 'ESV', label: 'English Standard Version' },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Search and Filters */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>📖</span>
            Lecture de la Bible
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Rechercher un verset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass border-white/30"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} className="spiritual-gradient">
              <Search size={18} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select onValueChange={handleBookSelect}>
              <SelectTrigger className="glass border-white/30">
                <SelectValue placeholder="Choisir un livre..." />
              </SelectTrigger>
              <SelectContent className="glass border-white/30 backdrop-blur-md">
                <SelectItem value="all">Tous les livres</SelectItem>
                {bibleBooks.map((book) => (
                  <SelectItem key={book.name} value={book.name}>
                    {book.name} ({book.chapters} chapitres)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedVersion} onValueChange={setSelectedVersion}>
              <SelectTrigger className="glass border-white/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-white/30 backdrop-blur-md">
                {bibleVersions.map((version) => (
                  <SelectItem key={version.value} value={version.value}>
                    {version.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Verses List */}
      <div className="space-y-4">
        {currentVerses.map((verse) => {
          const isFavorite = favoriteVerses.some(fv => fv.verse_id === verse.id);
          
          return (
            <Card key={verse.id} className="glass border-white/30">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-spiritual-600 bg-spiritual-100 px-3 py-1 rounded-full">
                      {verse.book} {verse.chapter}:{verse.verse}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {selectedVersion}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFavorite(verse)}
                    className={`${
                      isFavorite ? 'text-red-500' : 'text-gray-400'
                    } hover:scale-110 transition-all`}
                  >
                    <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                  </Button>
                </div>
                
                <p className="text-lg leading-relaxed text-gray-700 italic mb-3">
                  "{verse.text}"
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Version {verse.version}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Verset biblique',
                          text: `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`,
                        });
                      } else {
                        navigator.clipboard.writeText(`"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`);
                        toast({
                          description: "Verset copié dans le presse-papier",
                        });
                      }
                    }}
                    className="glass border-white/30"
                  >
                    Partager
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {currentVerses.length === 0 && (
        <Card className="glass border-white/30">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">📖</div>
            <h3 className="text-lg font-semibold mb-2">Aucun verset trouvé</h3>
            <p className="text-gray-600">Essayez avec d'autres termes de recherche</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BibleApp;
