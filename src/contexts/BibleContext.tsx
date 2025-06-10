
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BibleData, Verse, BookInfo } from '../types/bible';
import { loadBibleData, getAllBooks, searchVerses, getBookChapters, getChapterVerses } from '../lib/bibleDataLoader';

interface BibleContextType {
  bibleData: BibleData | null;
  books: BookInfo[];
  selectedBook: string;
  selectedChapter: number;
  selectedVersion: string;
  searchQuery: string;
  searchResults: Verse[];
  currentVerses: Verse[];
  favorites: Set<string>;
  isLoading: boolean;
  
  setSelectedBook: (book: string) => void;
  setSelectedChapter: (chapter: number) => void;
  setSelectedVersion: (version: string) => void;
  setSearchQuery: (query: string) => void;
  toggleFavorite: (verseId: string) => void;
  getAvailableChapters: () => number[];
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
  const [selectedVersion, setSelectedVersion] = useState<string>('Louis Segond (1910)');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [currentVerses, setCurrentVerses] = useState<Verse[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeBible = async () => {
      try {
        console.log('Chargement des données bibliques...');
        const data = await loadBibleData();
        setBibleData(data);
        const allBooks = getAllBooks(data);
        setBooks(allBooks);
        console.log(`Bible chargée avec ${allBooks.length} livres`);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données bibliques:', error);
        setIsLoading(false);
      }
    };

    initializeBible();
  }, []);

  useEffect(() => {
    if (bibleData && selectedBook && selectedChapter) {
      const verses = getChapterVerses(bibleData, selectedBook, selectedChapter);
      setCurrentVerses(verses);
    }
  }, [bibleData, selectedBook, selectedChapter]);

  useEffect(() => {
    if (bibleData && searchQuery.trim()) {
      const results = searchVerses(bibleData, searchQuery, 50);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [bibleData, searchQuery]);

  const getAvailableChapters = (): number[] => {
    if (!bibleData || !selectedBook) return [];
    return getBookChapters(bibleData, selectedBook);
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

  const isFavorite = (verseId: string): boolean => {
    return favorites.has(verseId);
  };

  const value: BibleContextType = {
    bibleData,
    books,
    selectedBook,
    selectedChapter,
    selectedVersion,
    searchQuery,
    searchResults,
    currentVerses,
    favorites,
    isLoading,
    setSelectedBook,
    setSelectedChapter,
    setSelectedVersion,
    setSearchQuery,
    toggleFavorite,
    getAvailableChapters,
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
