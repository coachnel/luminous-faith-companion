
import { useState, useEffect } from 'react';
import { neonBibleClient, NeonBook, NeonVerse, NeonBibleVersion } from '@/integrations/neon/bibleClient';

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

  // Initialisation avec données complètes
  useEffect(() => {
    const initializeBible = async () => {
      try {
        setIsLoading(true);
        
        console.log('🔄 Chargement des données bibliques complètes...');
        
        // Charger toutes les données
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
        
        console.log(`✅ Bible complète chargée: ${booksData.length} livres, ${versionsData.length} versions`);
        console.log(`📚 Ancien Testament: ${booksData.filter(b => b.testament === 'old').length} livres`);
        console.log(`📖 Nouveau Testament: ${booksData.filter(b => b.testament === 'new').length} livres`);
        
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de la Bible:', error);
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
        console.log(`📖 Chargement ${selectedBook.name} ${selectedChapter} (${selectedVersion})`);
        const verses = await neonBibleClient.getVerses(
          selectedBook.id, 
          selectedChapter, 
          selectedVersion
        );
        setCurrentVerses(verses);
        console.log(`✅ ${verses.length} versets chargés pour ${selectedBook.name} ${selectedChapter}`);
      } catch (error) {
        console.error('Erreur lors du chargement des versets:', error);
        setCurrentVerses([]);
      }
    };

    loadVerses();
  }, [selectedBook, selectedChapter, selectedVersion]);

  // Recherche avec debounce
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
          console.log(`🔍 Recherche par référence: ${searchQuery}`);
          results = await neonBibleClient.searchByReference(searchQuery, selectedVersion);
        } else {
          console.log(`🔍 Recherche textuelle: ${searchQuery}`);
          results = await neonBibleClient.searchVerses(searchQuery, selectedVersion, 30);
        }
        
        setSearchResults(results);
        console.log(`✅ ${results.length} résultats trouvés pour "${searchQuery}"`);
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
    console.log(`📚 Sélection du livre: ${book.name} (${book.chapters_count} chapitres)`);
    setSelectedBook(book);
    setSelectedChapter(1);
    setSearchQuery(''); // Clear search when selecting a book
  };

  const selectChapter = (chapter: number) => {
    console.log(`📄 Sélection du chapitre: ${chapter}`);
    setSelectedChapter(chapter);
  };

  const selectVersion = (versionId: string) => {
    console.log(`📖 Sélection de la version: ${versionId}`);
    setSelectedVersion(versionId);
  };

  const clearSearch = () => {
    console.log('🔍 Effacement de la recherche');
    setSearchQuery('');
    setSearchResults([]);
  };

  // Navigation entre chapitres
  const goToPreviousChapter = () => {
    if (selectedChapter > 1) {
      selectChapter(selectedChapter - 1);
    }
  };

  const goToNextChapter = () => {
    if (selectedBook && selectedChapter < selectedBook.chapters_count) {
      selectChapter(selectedChapter + 1);
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
    hasSearchResults: searchResults.length > 0,
    
    // Statistiques
    totalBooks: books.length,
    oldTestamentBooks: books.filter(b => b.testament === 'old').length,
    newTestamentBooks: books.filter(b => b.testament === 'new').length,
    currentVersesCount: currentVerses.length
  };
}
