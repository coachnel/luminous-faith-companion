import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BibleData, Verse, BookInfo } from '../types/bible';
import { loadBibleData } from '../lib/bibleDataLoader';

interface BibleContextType {
  bibleData: BibleData | null;
  books: BookInfo[];
  selectedBook: string;
  selectedChapter: number;
  searchQuery: string;
  searchResults: Verse[];
  currentVerses: Verse[];
  setSelectedBook: (book: string) => void;
  setSelectedChapter: (chapter: number) => void;
  setSearchQuery: (query: string) => void;
  getAvailableChapters: () => number[];
  toggleFavorite: (verseId: string) => void;
  isFavorite: (verseId: string) => boolean;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

interface BibleProviderProps {
  children: ReactNode;
}

export const BibleProvider: React.FC<BibleProviderProps> = ({ children }) => {
  const [bibleData, setBibleData] = useState<BibleData | null>(null);
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('Genèse');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const initializeBible = async () => {
      const data = await loadBibleData();
      setBibleData(data);
      setBooks(data.oldTestament.map(book => ({ name: book.name, testament: 'old', chaptersCount: book.chapters.length })));
    };

    initializeBible();
  }, []);

  const getAvailableChapters = () => {
    const book = books.find(b => b.name === selectedBook);
    return book ? Array.from({ length: book.chaptersCount }, (_, i) => i + 1) : [];
  };

  const toggleFavorite = (verseId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(verseId)) {
        newFavorites.delete(verseId);
      } else {
        newFavorites.add(verseId);
      }
      return newFavorites;
    });
  };

  const isFavorite = (verseId: string) => favorites.has(verseId);

  const value: BibleContextType = {
    bibleData,
    books,
    selectedBook,
    selectedChapter,
    searchQuery,
    searchResults,
    currentVerses: [], // Placeholder, replace with actual logic
    setSelectedBook,
    setSelectedChapter,
    setSearchQuery,
    getAvailableChapters,
    toggleFavorite,
    isFavorite,
  };

  return <BibleContext.Provider value={value}>{children}</BibleContext.Provider>;
};

export const useBible = (): BibleContextType => {
  const context = useContext(BibleContext);
  if (context === undefined) {
    throw new Error('useBible must be used within a BibleProvider');
  }
  return context;
};
