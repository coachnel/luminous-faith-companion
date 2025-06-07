import React, { useState, useEffect } from 'react';
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

const BibleApp = () => {
  const [version, setVersion] = useState('LSG');
  const [books, setBooks] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [chapters, setChapters] = useState<string[]>([]);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { favoriteVerses, addFavoriteVerse, removeFavoriteVerse } = useFavoriteVerses();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);

  // Charge la liste des livres à chaque changement de version
  useEffect(() => {
    setLoading(true);
    getBooks(version)
      .then((books) => {
        setBooks(books);
        setSelectedBook(books[0] || '');
      })
      .catch(() => setError('Erreur chargement des livres'))
      .finally(() => setLoading(false));
    setSelectedChapter('');
    setVerses([]);
  }, [version]);

  // Charge la liste des chapitres à chaque changement de livre
  useEffect(() => {
    if (!selectedBook) return;
    setLoading(true);
    getChapters(version, selectedBook)
      .then((chaps) => {
        setChapters(chaps);
        setSelectedChapter(chaps[0] || '');
      })
      .catch(() => setError('Erreur chargement des chapitres'))
      .finally(() => setLoading(false));
    setVerses([]);
  }, [version, selectedBook]);

  // Charge les versets à chaque changement de chapitre
  useEffect(() => {
    if (!selectedBook || !selectedChapter) return;
    setLoading(true);
    getVerses(version, selectedBook, selectedChapter)
      .then(setVerses)
      .catch(() => setError('Erreur chargement des versets'))
      .finally(() => setLoading(false));
  }, [version, selectedBook, selectedChapter]);

  // Recherche textuelle dans toute la version courante (local uniquement)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearchResults([]);
    try {
      const data = await loadBibleData(version);
      const results: BibleVerse[] = [];
      const query = searchQuery.toLowerCase();
      Object.entries(data).forEach(([bookName, bookData]) => {
        Object.entries(bookData).forEach(([chapterNum, chapterData]) => {
          Object.entries(chapterData).forEach(([verseNum, text]) => {
            if ((text as string).toLowerCase().includes(query)) {
              results.push({
                id: `${bookName}-${chapterNum}-${verseNum}`,
                book: bookName,
                chapter: parseInt(chapterNum),
                verse: parseInt(verseNum),
                text: text as string,
                version,
                language: version === 'LSG' ? 'fr' : 'en',
              });
            }
          });
        });
      });
      setSearchResults(results.slice(0, 50));
      if (results.length === 0) {
        toast({ description: "Aucun verset trouvé pour cette recherche" });
      } else {
        toast({ title: "🔍 Recherche terminée", description: `${results.length} verset(s) trouvé(s)` });
      }
    } catch (e) {
      setError('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const isVerseFavorite = (verse: BibleVerse) => {
    return favoriteVerses.some(fav => fav.verse_id === verse.id);
  };

  const toggleFavorite = async (verse: BibleVerse) => {
    try {
      if (isVerseFavorite(verse)) {
        await removeFavoriteVerse(verse.id);
        toast({ description: "Verset retiré des favoris" });
      } else {
        await addFavoriteVerse(verse);
        toast({ title: "⭐ Ajouté aux favoris", description: "Le verset a été ajouté à vos favoris" });
      }
    } catch (error) {
      toast({ description: "Erreur lors de la modification des favoris", variant: "destructive" });
    }
  };

  // Affichage du nom du livre dans le header (fallback = id brut)
  const getBookDisplayName = () => {
    return selectedBook;
  };

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* En-tête avec recherche */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="text-spiritual-600" size={24} />
            Bible - Lecture et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sélection de version */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Version</label>
              <Select value={version} onValueChange={v => { setVersion(v); setSelectedBook(''); setSelectedChapter(''); }}>
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

          {/* Recherche */}
          <div className="flex gap-2">
            <Input
              placeholder="Rechercher dans la Bible (ex: amour, paix, joie...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="glass border-white/30"
            />
            <Button onClick={handleSearch} className="spiritual-gradient">
              <Search size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation des livres */}
      <Card className="glass border-white/30">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Livre</label>
              <Select value={selectedBook} onValueChange={v => { setSelectedBook(v); setSelectedChapter(''); }}>
                <SelectTrigger className="glass border-white/30">
                  <SelectValue placeholder="Sélectionner un livre" />
                </SelectTrigger>
                <SelectContent>
                  {books.map(book => (
                    <SelectItem key={book} value={book}>{book}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedBook && (
              <div>
                <label className="text-sm font-medium mb-1 block">Chapitre</label>
                <Select value={selectedChapter} onValueChange={value => setSelectedChapter(value)}>
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

      {/* Résultats de recherche */}
      {searchResults.length > 0 && (
        <Card className="glass border-white/30">
          <CardHeader>
            <CardTitle className="text-lg">
              Résultats de recherche ({searchResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {searchResults.map((verse) => (
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

      {/* Lecture du chapitre */}
      {selectedBook && verses.length > 0 && (
        <Card className="glass border-white/30">
          <CardHeader>
            <CardTitle className="text-lg">
              {getBookDisplayName()} - Chapitre {selectedChapter}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {verses.map((verse: any) => (
              <div key={verse.id || `${verse.verse}`} className="verse-card p-4 border border-white/20 rounded-lg">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-spiritual-600 mr-3">
                      {verse.verse}
                    </span>
                    <span className="text-gray-800 leading-relaxed">{verse.text}</span>
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

      {!selectedBook && searchResults.length === 0 && (
        <Card className="glass border-white/30">
          <CardContent className="p-8 text-center">
            <Book className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold mb-2">Explorez la Bible</h3>
            <p className="text-gray-600">
              Sélectionnez un livre pour commencer la lecture ou utilisez la recherche pour trouver des versets spécifiques.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Affichage d'un loader ou d'une erreur si besoin */}
      {loading && <div className="text-center text-gray-500">Chargement...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
    </div>
  );
};

export default BibleApp;
