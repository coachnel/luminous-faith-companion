
import React, { useState, useEffect } from 'react';
import { Book, ChevronLeft, Search, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBooks, getChapters, getVerses } from '@/lib/bibleDataLoader';
import { BookInfo, Chapter, Verse } from '@/types/bible';
import VerseCard from './VerseCard';

const BibleApp = () => {
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
    const loadBooks = async () => {
      try {
        const booksData = await getBooks();
        setBooks(booksData);
      } catch (error) {
        console.error('Error loading books:', error);
      }
    };
    loadBooks();
  }, []);

  const handleBookSelect = async (bookName: string) => {
    setLoading(true);
    try {
      const chaptersData = await getChapters(bookName);
      setSelectedBook(bookName);
      setChapters(chaptersData);
      setView('chapters');
    } catch (error) {
      console.error('Error loading chapters:', error);
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
      console.error('Error loading verses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Simple search implementation - in a real app, this would be more sophisticated
      const allVerses: Verse[] = [];
      for (const book of books) {
        const chapters = await getChapters(book.name);
        for (const chapter of chapters) {
          const verses = await getVerses(book.name, chapter.chapter);
          allVerses.push(...verses);
        }
      }
      
      const results = allVerses.filter(verse =>
        verse.text.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 20); // Limit results
      
      setSearchResults(results);
      setView('search');
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBooks = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Livres de la Bible</h2>
      <div className="grid gap-2">
        {books.map((book) => (
          <Button
            key={book.name}
            variant="outline"
            className="justify-start h-auto p-4"
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
            className="aspect-square"
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
        <Button variant="ghost" size="sm" onClick={() => setView('books')}>
          <ChevronLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold">Résultats de recherche</h2>
      </div>
      {searchResults.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Aucun résultat trouvé</p>
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
            <Book className="text-spiritual-600" size={24} />
            Bible
          </CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Rechercher dans la Bible..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="glass border-white/30"
            />
            <Button onClick={handleSearch} disabled={loading} className="spiritual-gradient">
              <Search size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-spiritual-500 border-t-transparent rounded-full mx-auto mb-4"></div>
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

export default BibleApp;
