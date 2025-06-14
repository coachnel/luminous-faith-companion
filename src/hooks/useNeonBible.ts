
import { useState, useEffect } from 'react';
import { neonBibleClient, NeonBook, NeonVerse, NeonBibleVersion, initializeBibleData } from '@/integrations/neon/bibleClient';

export function useNeonBible() {
  const [books, setBooks] = useState<NeonBook[]>([]);
  const [currentVerses, setCurrentVerses] = useState<NeonVerse[]>([]);
  const [searchResults, setSearchResults] = useState<NeonVerse[]>([]);
  const [versions, setVersions] = useState<NeonBibleVersion[]>([]);
  const [selectedBook, setSelectedBook] = useState<NeonBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedVersion, setSelectedVersion] = useState<string>('lsg1910');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Initialisation
  useEffect(() => {
    const initializeBible = async () => {
      try {
        setIsLoading(true);
        
        // Initialiser les données de test
        initializeBibleData();
        
        // Charger les données
        const [booksData, versionsData] = await Promise.all([
          neonBibleClient.getBooks(),
          neonBibleClient.getVersions()
        ]);
        
        setBooks(booksData);
        setVersions(versionsData);
        
        // Sélectionner le premier livre par défaut
        if (booksData.length > 0) {
          setSelectedBook(booksData[0]);
        }
        
        console.log(`Bible Neon chargée: ${booksData.length} livres, ${versionsData.length} versions`);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la Bible:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeBible();
  }, []);

  // Charger les versets quand le livre/chapitre/version change
  useEffect(() => {
    const loadVerses = async () => {
      if (!selectedBook) return;

      try {
        const verses = await neonBibleClient.getVerses(
          selectedBook.id, 
          selectedChapter, 
          selectedVersion
        );
        setCurrentVerses(verses);
      } catch (error) {
        console.error('Erreur lors du chargement des versets:', error);
        setCurrentVerses([]);
      }
    };

    loadVerses();
  }, [selectedBook, selectedChapter, selectedVersion]);

  // Recherche
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        let results: NeonVerse[] = [];
        
        // Détecter si c'est une référence biblique
        const refPattern = /^(.+?)\s+(\d+)(?::(\d+))?$/;
        if (refPattern.test(searchQuery.trim())) {
          results = await neonBibleClient.searchByReference(searchQuery, selectedVersion);
        } else {
          results = await neonBibleClient.searchVerses(searchQuery, selectedVersion, 30);
        }
        
        setSearchResults(results);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedVersion]);

  // Actions
  const selectBook = (book: NeonBook) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    setSearchQuery(''); // Clear search when selecting a book
  };

  const selectChapter = (chapter: number) => {
    setSelectedChapter(chapter);
  };

  const selectVersion = (versionId: string) => {
    setSelectedVersion(versionId);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  // Navigation entre chapitres
  const goToPreviousChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    }
  };

  const goToNextChapter = () => {
    if (selectedBook && selectedChapter < selectedBook.chapters_count) {
      setSelectedChapter(selectedChapter + 1);
    }
  };

  const canGoToPrevious = selectedChapter > 1;
  const canGoToNext = selectedBook ? selectedChapter < selectedBook.chapters_count : false;

  return {
    // État
    books,
    currentVerses,
    searchResults,
    versions,
    selectedBook,
    selectedChapter,
    selectedVersion,
    searchQuery,
    isLoading,
    
    // Actions
    selectBook,
    selectChapter,
    selectVersion,
    setSearchQuery,
    clearSearch,
    goToPreviousChapter,
    goToNextChapter,
    
    // Helpers
    canGoToPrevious,
    canGoToNext,
    isSearching: searchQuery.trim().length > 0,
    hasSearchResults: searchResults.length > 0
  };
}
