
import React, { useState, useEffect } from 'react';
import { Book, ChevronLeft, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { getBooks, getChapters, getVerses, searchVerses } from '@/lib/bibleLoader';
import { BookInfo, Chapter, Verse } from '@/types/bible';
import VerseCard from './VerseCard';

const BibleReader = () => {
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'books' | 'chapters' | 'verses' | 'search'>('books');

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
      if (view === 'search') {
        setView(selectedBook ? (selectedChapter ? 'verses' : 'chapters') : 'books');
      }
    }
  }, [searchQuery]);

  const loadBooks = async () => {
    try {
      const booksData = await getBooks();
      setBooks(booksData);
    } catch (error) {
      console.error('Erreur lors du chargement des livres:', error);
    }
  };

  const handleBookSelect = async (bookName: string) => {
    setLoading(true);
    try {
      const chaptersData = await getChapters(bookName);
      setSelectedBook(bookName);
      setChapters(chaptersData);
      setSelectedChapter(0);
      setVerses([]);
      setView('chapters');
    } catch (error) {
      console.error('Erreur lors du chargement des chapitres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterSelect = async (chapterNumber: number) => {
    setLoading(true);
    try {
      const versesData = await getVerses(selectedBook, chapterNumber);
      setSelectedChapter(chapterNumber);
      setVerses(versesData);
      setView('verses');
    } catch (error) {
      console.error('Erreur lors du chargement des versets:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchVerses(searchQuery);
      setSearchResults(results);
      setView('search');
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  const oldTestamentBooks = books.filter(book => book.testament === 'old');
  const newTestamentBooks = books.filter(book => book.testament === 'new');

  const renderBooks = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Livres de la Bible</h2>
      
      {/* Ancien Testament */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-purple-700 border-b border-purple-200 pb-1">
          Ancien Testament ({oldTestamentBooks.length} livres)
        </h3>
        <div className="grid gap-2">
          {oldTestamentBooks.map((book) => (
            <Button
              key={book.name}
              variant="outline"
              className="justify-start h-auto p-4 hover:bg-purple-50"
              onClick={() => handleBookSelect(book.name)}
            >
              <div className="text-left">
                <div className="font-medium">{book.name}</div>
                <div className="text-sm text-gray-500">
                  {book.chaptersCount} chapitre{book.chaptersCount > 1 ? 's' : ''}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Nouveau Testament */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-purple-700 border-b border-purple-200 pb-1">
          Nouveau Testament ({newTestamentBooks.length} livres)
        </h3>
        <div className="grid gap-2">
          {newTestamentBooks.map((book) => (
            <Button
              key={book.name}
              variant="outline"
              className="justify-start h-auto p-4 hover:bg-purple-50"
              onClick={() => handleBookSelect(book.name)}
            >
              <div className="text-left">
                <div className="font-medium">{book.name}</div>
                <div className="text-sm text-gray-500">
                  {book.chaptersCount} chapitre{book.chaptersCount > 1 ? 's' : ''}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChapters = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={() => setView('books')}>
          <ChevronLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold">{selectedBook}</h2>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {chapters.map((chapter) => (
          <Button
            key={chapter.chapter}
            variant="outline"
            className="aspect-square hover:bg-purple-50"
            onClick={() => handleChapterSelect(chapter.chapter)}
          >
            {chapter.chapter}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderVerses = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={() => setView('chapters')}>
          <ChevronLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold">{selectedBook} {selectedChapter}</h2>
      </div>
      <div className="space-y-3">
        {verses.map((verse) => (
          <VerseCard key={`${verse.book}-${verse.chapter}-${verse.verse}`} verse={verse} />
        ))}
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={() => setView(selectedBook ? (selectedChapter ? 'verses' : 'chapters') : 'books')}>
          <ChevronLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold">
          Résultats de recherche ({searchResults.length})
        </h2>
      </div>
      {searchResults.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {searchQuery ? 'Aucun résultat trouvé' : 'Saisissez votre recherche ci-dessus'}
        </p>
      ) : (
        <div className="space-y-3">
          {searchResults.map((verse) => (
            <VerseCard key={`${verse.book}-${verse.chapter}-${verse.verse}`} verse={verse} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="text-purple-600" size={24} />
            Bible Louis Segond
          </CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Rechercher dans la Bible..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass border-white/30"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Chargement...</p>
            </div>
          ) : (
            <>
              {view === 'books' && renderBooks()}
              {view === 'chapters' && renderChapters()}
              {view === 'verses' && renderVerses()}
              {view === 'search' && renderSearch()}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BibleReader;
