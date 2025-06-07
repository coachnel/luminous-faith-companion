
import React, { useState, useEffect } from 'react';
import { Search, Heart, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bibleBooks, bibleVerses } from '@/data/bibleData';
import { useFavoriteVerses } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';

const BibleReader = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedVersion, setSelectedVersion] = useState('LSG');
  const [currentVerses, setCurrentVerses] = useState(bibleVerses);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { favoriteVerses, addFavoriteVerse, removeFavoriteVerse } = useFavoriteVerses();

  const bibleVersions = [
    { value: 'LSG', label: 'Louis Segond (1910)' },
    { value: 'KJV', label: 'King James Version' },
    { value: 'NIV', label: 'New International Version' },
    { value: 'ESV', label: 'English Standard Version' },
  ];

  const searchSuggestions = [
    'amour', 'paix', 'espoir', 'foi', 'joie', 'pardon', 'sagesse', 'force',
    'grâce', 'miséricorde', 'prière', 'bénédiction', 'salut', 'vie éternelle'
  ];

  const handleSearch = () => {
    if (!searchTerm) {
      setCurrentVerses(bibleVerses);
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    const filtered = bibleVerses.filter(verse =>
      verse.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verse.book.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filtered);
    setCurrentVerses(filtered);
    
    toast({
      description: `${filtered.length} verset(s) trouvé(s) pour "${searchTerm}"`,
    });
  };

  const handleBookSelect = (bookName: string) => {
    setSelectedBook(bookName);
    setSelectedChapter(1);
    
    if (bookName === 'all') {
      setCurrentVerses(bibleVerses);
      setIsSearching(false);
    } else {
      const filtered = bibleVerses.filter(verse => verse.book === bookName);
      setCurrentVerses(filtered.length ? filtered : bibleVerses);
      setIsSearching(true);
    }
  };

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
    
    if (selectedBook) {
      const filtered = bibleVerses.filter(verse => 
        verse.book === selectedBook && verse.chapter === chapter
      );
      setCurrentVerses(filtered.length ? filtered : bibleVerses);
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

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (!selectedBook) return;
    
    const book = bibleBooks.find(b => b.name === selectedBook);
    if (!book) return;
    
    let newChapter = selectedChapter;
    if (direction === 'prev' && selectedChapter > 1) {
      newChapter = selectedChapter - 1;
    } else if (direction === 'next' && selectedChapter < book.chapters) {
      newChapter = selectedChapter + 1;
    }
    
    handleChapterSelect(newChapter);
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      {/* En-tête avec recherche */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="text-spiritual-600" size={24} />
            Bible complète
            {isSearching && (
              <span className="text-sm bg-spiritual-100 text-spiritual-700 px-2 py-1 rounded-full">
                {currentVerses.length} résultat(s)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Barre de recherche */}
          <div className="flex gap-2">
            <Input
              placeholder="Rechercher un verset, un mot-clé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass border-white/30"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} className="spiritual-gradient">
              <Search size={18} />
            </Button>
          </div>

          {/* Suggestions de recherche */}
          {!isSearching && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Suggestions:</span>
              {searchSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm(suggestion);
                    setTimeout(handleSearch, 100);
                  }}
                  className="text-xs glass border-white/30"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}

          {/* Sélecteurs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {selectedBook && selectedBook !== 'all' && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateChapter('prev')}
                  disabled={selectedChapter <= 1}
                  className="glass border-white/30"
                >
                  <ChevronLeft size={16} />
                </Button>
                <Select value={selectedChapter.toString()} onValueChange={(value) => handleChapterSelect(parseInt(value))}>
                  <SelectTrigger className="glass border-white/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/30 backdrop-blur-md">
                    {Array.from({ length: bibleBooks.find(b => b.name === selectedBook)?.chapters || 1 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Chapitre {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateChapter('next')}
                  disabled={selectedChapter >= (bibleBooks.find(b => b.name === selectedBook)?.chapters || 1)}
                  className="glass border-white/30"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}

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

      {/* Liste des versets */}
      <div className="space-y-4">
        {currentVerses.map((verse) => {
          const isFavorite = favoriteVerses.some(fv => fv.verse_id === verse.id);
          
          return (
            <Card key={verse.id} className="glass border-white/30 hover:shadow-lg transition-all">
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
                        }).catch(() => {
                          navigator.clipboard.writeText(`"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`);
                          toast({
                            description: "Verset copié dans le presse-papier",
                          });
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
            <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold mb-2">Aucun verset trouvé</h3>
            <p className="text-gray-600 mb-4">Essayez avec d'autres termes de recherche</p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setCurrentVerses(bibleVerses);
                setIsSearching(false);
              }}
              className="spiritual-gradient"
            >
              Afficher tous les versets
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BibleReader;
