/* ===================================================================
   File: src/components/BibleApp.tsx
   Responsibility: Main React component for Bible navigation & search
   =================================================================== */

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Book, Star, StarOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFavoriteVerses } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';
import { getBooks, getChapters, getVerses, loadBibleData } from '@/lib/bibleDataLoader';
import type { BibleVerse } from '@/types';

const BIBLE_VERSIONS = [
  { id: 'LSG', name: 'Louis Segond (LSG)' },
  { id: 'KJV', name: 'King James Version (KJV)' },
  { id: 'NIV', name: 'New International Version (NIV)' },
  { id: 'ESV', name: 'English Standard Version (ESV)' },
];

const BibleApp: React.FC = () => {
  const [version, setVersion] = useState<string>('LSG');
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

  // Load books when version changes
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
        const list = await getBooks(version);
        setBooks(list);
        setSelectedBook(list[0] || '');
      } catch {
        setError('Erreur lors du chargement des livres');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [version]);

  // Load chapters when selectedBook changes
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
        const list = await getChapters(version, selectedBook);
        setChapters(list);
        setSelectedChapter(list[0] || '');
      } catch {
        setError('Erreur lors du chargement des chapitres');
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [version, selectedBook]);

  // Load verses when selectedChapter changes
  useEffect(() => {
    if (!selectedBook || !selectedChapter) return;
    setError(null);
    setSearchResults([]);
    setVerses([]);

    const fetchVerses = async () => {
      setLoading(true);
      try {
        const data = await getVerses(version, selectedBook, selectedChapter);
        setVerses(data);
      } catch {
        setError('Erreur lors du chargement des versets');
      } finally {
        setLoading(false);
      }
    };
    fetchVerses();
  }, [version, selectedBook, selectedChapter]);

  // Search within local data
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setError(null);
    setSearchResults([]);
    setLoading(true);
    try {
      const data = await loadBibleData(version);
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
                version,
                language: version === 'LSG' ? 'fr' : 'en',
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
  }, [searchQuery, version]);

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

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Header and Search */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book size={24} className="text-spiritual-600" />
            Bible - Lecture & Recherche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Version</label>
              <Select
                value={version}
                onValueChange={v => setVersion(v)}
              >
                <SelectTrigger className="glass border-white/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BIBLE_VERSIONS.map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

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

      {/* Navigation */}
      <Card className="glass border-white/30">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Livre</label>
              <Select
                value={selectedBook}
                onValueChange={v => setSelectedBook(v)}
              >
                <SelectTrigger className="glass border-white/30">
                  <SelectValue placeholder="Sélectionner un livre" />
                </SelectTrigger>
                <SelectContent>
                  {books.map(bk => (
                    <SelectItem key={bk} value={bk}>{bk}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedBook && (
              <div>
                <label className="text-sm font-medium mb-1 block">Chapitre</label>
                <Select
                  value={selectedChapter}
                  onValueChange={v => setSelectedChapter(v)}
                >
                  <SelectTrigger className="glass border-white/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters.map(ch => (
                      <SelectItem key={ch} value={ch}>{ch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
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
                  <Button
                    onClick={() => toggleFavorite(verse)}
                    variant="ghost"
                    size="sm"
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    {isVerseFavorite(verse) ? <Star fill="currentColor" size={16} /> : <StarOff size={16} />}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Chapter Reading */}
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
                      {v.verse}
                    </span>
                    <span className="text-gray-800 leading-relaxed">{v.text}</span>
                  </div>
                  <Button
                    onClick={() => toggleFavorite(v)}
                    variant="ghost"
                    size="sm"
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    {isVerseFavorite(v) ? <Star fill="currentColor" size={16} /> : <StarOff size={16} />}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedBook && !searchResults.length && (
        <Card className="glass border-white/30">
          <CardContent className="p-8 text-center">
            <Book size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Explorez la Bible</h3>
            <p className="text-gray-600">Sélectionnez un livre ou effectuez une recherche.</p>
          </CardContent>
        </Card>
      )}

      {/* Loader & Errors */}
      {loading && <div className="text-center text-gray-500">Chargement...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
    </div>
  );
};

export default BibleApp;
