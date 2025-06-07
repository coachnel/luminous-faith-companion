/* ===================================================================
   File: src/components/BibleApp.tsx
   Responsibility: Main React component for Bible navigation & search
   =================================================================== */

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Book, Star, StarOff, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFavoriteVerses } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';
import { getBooks, getChapters, getVerses, loadBibleData } from '@/lib/bibleDataLoader';
import type { BibleVerse } from '@/types';

const LSG_VERSION = 'LSG';

const BibleApp: React.FC = () => {
  const [books, setBooks] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [chapters, setChapters] = useState<string[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [verses, setVerses] = useState<Array<{ verse: string; text: string }>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { favoriteVerses, addFavoriteVerse, removeFavoriteVerse } = useFavoriteVerses();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);

  // Chargement des livres au montage
  useEffect(() => {
    setError(null);
    setSearchResults([]);
    setVerses([]);
    setChapters([]);
    setSelectedChapter('');
    setBooks([]);
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const list = await getBooks(LSG_VERSION);
        setBooks(list);
        setSelectedBook('');
      } catch {
        setError('Erreur lors du chargement des livres');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Chargement des chapitres quand un livre est sélectionné
  useEffect(() => {
    if (!selectedBook) return;
    setError(null);
    setSearchResults([]);
    setVerses([]);
    setChapters([]);
    setSelectedChapter('');
    const fetchChapters = async () => {
      setLoading(true);
      try {
        const list = await getChapters(LSG_VERSION, selectedBook);
        setChapters(list);
        setSelectedChapter('');
      } catch {
        setError('Erreur lors du chargement des chapitres');
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [selectedBook]);

  // Chargement des versets quand un chapitre est sélectionné
  useEffect(() => {
    if (!selectedBook || !selectedChapter) return;
    setError(null);
    setSearchResults([]);
    setVerses([]);
    const fetchVerses = async () => {
      setLoading(true);
      try {
        const data = await getVerses(LSG_VERSION, selectedBook, selectedChapter);
        setVerses(data);
      } catch {
        setError('Erreur lors du chargement des versets');
      } finally {
        setLoading(false);
      }
    };
    fetchVerses();
  }, [selectedBook, selectedChapter]);

  // Recherche locale dans la LSG
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setError(null);
    setSearchResults([]);
    setLoading(true);
    try {
      const data = await loadBibleData(LSG_VERSION);
      const results: BibleVerse[] = [];
      const q = searchQuery.toLowerCase();
      Object.entries(data).forEach(([bk, bkData]) => {
        Object.entries(bkData).forEach(([ch, chData]) => {
          Object.entries(chData).forEach(([vr, txt]) => {
            if ((txt as string).toLowerCase().includes(q)) {
              results.push({
                id: `${bk}-${ch}-${vr}`,
                book: bk,
                chapter: parseInt(ch, 10),
                verse: parseInt(vr, 10),
                text: txt as string,
                version: LSG_VERSION,
                language: 'fr',
              });
            }
          });
        });
      });
      setSearchResults(results.slice(0, 50));
      toast({
        title: results.length ? '🔍 Recherche terminée' : undefined,
        description: results.length ? `${results.length} verset(s) trouvé(s)` : 'Aucun verset trouvé pour cette recherche',
      });
    } catch {
      setError('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const isVerseFavorite = (verse: BibleVerse) =>
    favoriteVerses.some(fav => fav.verse_id === verse.id);

  const toggleFavorite = async (verse: BibleVerse) => {
    try {
      if (isVerseFavorite(verse)) {
        await removeFavoriteVerse(verse.id);
        toast({ description: 'Verset retiré des favoris' });
      } else {
        await addFavoriteVerse(verse);
        toast({
          title: '⭐ Ajouté aux favoris',
          description: 'Le verset a été ajouté à vos favoris',
        });
      }
    } catch {
      toast({
        description: 'Erreur lors de la modification des favoris',
        variant: 'destructive',
      });
    }
  };

  const handleShare = (verse: BibleVerse) => {
    const text = `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`;
    if (navigator.share) {
      navigator.share({
        title: 'Verset biblique',
        text,
      }).catch(() => {
        navigator.clipboard.writeText(text);
        toast({ description: 'Verset copié dans le presse-papier' });
      });
    } else {
      navigator.clipboard.writeText(text);
      toast({ description: 'Verset copié dans le presse-papier' });
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Barre de recherche */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book size={24} className="text-spiritual-600" />
            Bible Louis Segond (LSG)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Rechercher dans la Bible..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="glass border-white/30"
            />
            <Button onClick={handleSearch} className="spiritual-gradient">
              <Search size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation livres/chapitres */}
      <Card className="glass border-white/30">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            {/* Liste des livres */}
            <div>
              <div className="font-semibold mb-2">Livres</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {books.map(bk => (
                  <Button
                    key={bk}
                    variant={selectedBook === bk ? 'default' : 'outline'}
                    onClick={() => setSelectedBook(bk)}
                    className="w-full justify-start"
                  >
                    {bk}
                  </Button>
                ))}
              </div>
            </div>
            {/* Liste des chapitres */}
            {selectedBook && chapters.length > 0 && (
              <div>
                <div className="font-semibold mb-2">Chapitres</div>
                <div className="flex flex-wrap gap-2">
                  {chapters.map(ch => (
                    <Button
                      key={ch}
                      variant={selectedChapter === ch ? 'default' : 'outline'}
                      onClick={() => setSelectedChapter(ch)}
                      className="w-12"
                    >
                      {ch}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Résultats de recherche */}
      {searchResults.length > 0 && (
        <Card className="glass border-white/30">
          <CardHeader>
            <CardTitle className="text-lg">
              Résultats de recherche ({searchResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {searchResults.map(verse => (
              <div key={verse.id} className="verse-card p-4 border border-white/20 rounded-lg">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-2">
                      {verse.book} {verse.chapter}:{verse.verse}
                    </div>
                    <p className="text-gray-800 leading-relaxed">{verse.text}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Button
                      onClick={() => toggleFavorite(verse)}
                      variant="ghost"
                      size="sm"
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      {isVerseFavorite(verse) ? <Star fill="currentColor" size={16} /> : <StarOff size={16} />}
                    </Button>
                    <Button
                      onClick={() => handleShare(verse)}
                      variant="outline"
                      size="sm"
                      className="text-spiritual-600 border-spiritual-200"
                    >
                      <Share2 size={14} /> Partager
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Lecture du chapitre */}
      {selectedBook && verses.length > 0 && (
        <Card className="glass border-white/30">
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedBook} - Chapitre {selectedChapter}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {verses.map(v => (
              <div key={v.verse} className="verse-card p-4 border border-white/20 rounded-lg">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-spiritual-600 mr-3">
                      {selectedBook} {selectedChapter}:{v.verse}
                    </span>
                    <span className="text-gray-700">{v.text}</span>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Button
                      onClick={() => toggleFavorite({
                        id: `${selectedBook}-${selectedChapter}-${v.verse}`,
                        book: selectedBook,
                        chapter: parseInt(selectedChapter, 10),
                        verse: parseInt(v.verse, 10),
                        text: v.text,
                        version: LSG_VERSION,
                        language: 'fr',
                      })}
                      variant="ghost"
                      size="sm"
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      {isVerseFavorite({
                        id: `${selectedBook}-${selectedChapter}-${v.verse}`,
                        book: selectedBook,
                        chapter: parseInt(selectedChapter, 10),
                        verse: parseInt(v.verse, 10),
                        text: v.text,
                        version: LSG_VERSION,
                        language: 'fr',
                      }) ? <Star fill="currentColor" size={16} /> : <StarOff size={16} />}
                    </Button>
                    <Button
                      onClick={() => handleShare({
                        id: `${selectedBook}-${selectedChapter}-${v.verse}`,
                        book: selectedBook,
                        chapter: parseInt(selectedChapter, 10),
                        verse: parseInt(v.verse, 10),
                        text: v.text,
                        version: LSG_VERSION,
                        language: 'fr',
                      })}
                      variant="outline"
                      size="sm"
                      className="text-spiritual-600 border-spiritual-200"
                    >
                      <Share2 size={14} /> Partager
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Message d'accueil ou d'erreur */}
      {!selectedBook && !searchResults.length && !loading && !error && (
        <Card className="glass border-white/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Explorez la Bible</h3>
            <p className="text-gray-600">Sélectionnez un livre ou effectuez une recherche.</p>
          </CardContent>
        </Card>
      )}
      {loading && <div className="text-center text-gray-500">Chargement...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
    </div>
  );
};

export default BibleApp;
