
import { useState, useEffect } from 'react';
import { optimizedBibleClient } from '@/integrations/neon/optimizedBibleClient';
import { NeonBook, NeonVerse, NeonBibleVersion } from '@/integrations/neon/bibleClient';

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
  const [dataQuality, setDataQuality] = useState<any>(null);

  // Initialisation
  useEffect(() => {
    const initializeBible = async () => {
      try {
        setIsLoading(true);
        
        console.log('🔄 Chargement de la Bible complète avec système optimisé...');
        
        const [booksData, versionsData] = await Promise.all([
          optimizedBibleClient.getBooks(),
          optimizedBibleClient.getVersions()
        ]);
        
        setBooks(booksData);
        setVersions(versionsData);
        
        if (booksData.length > 0) {
          setSelectedBook(booksData[0]);
        }
        
        const quality = await optimizedBibleClient.getDataQualityReport();
        setDataQuality(quality);
        
        console.log(`✅ Bible optimisée chargée: ${booksData.length} livres, ${quality.totalVerses} versets`);
        console.log(`📊 Qualité des données: ${quality.qualityPercentage}% de versets réels`);
        
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de la Bible:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeBible();
  }, []);

  // Charger les versets
  useEffect(() => {
    const loadVerses = async () => {
      if (!selectedBook) return;

      try {
        console.log(`📖 Chargement ${selectedBook.name} ${selectedChapter} (${selectedVersion})`);
        const verses = await optimizedBibleClient.getVerses(
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

  // Recherche
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        let results: NeonVerse[] = [];
        
        const refPattern = /^(.+?)\s+(\d+)(?::(\d+))?$/;
        if (refPattern.test(searchQuery.trim())) {
          console.log(`🔍 Recherche par référence: ${searchQuery}`);
          results = await optimizedBibleClient.searchByReference(searchQuery, selectedVersion);
        } else {
          console.log(`🔍 Recherche textuelle: ${searchQuery}`);
          results = await optimizedBibleClient.searchVerses(searchQuery, selectedVersion, 30);
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
    setSearchQuery('');
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

  // Statistiques
  const currentVersesStats = {
    total: currentVerses.length,
    real: currentVerses.filter(v => 
      !v.text.includes('Texte à compléter') && v.text.length > 20
    ).length,
    placeholders: currentVerses.filter(v => 
      v.text.includes('Texte à compléter') || v.text.length <= 20
    ).length
  };

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
    dataQuality,
    
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
    currentVersesCount: currentVerses.length,
    currentVersesStats,
    
    // Indicateurs de qualité
    hasRealVerses: currentVersesStats.real > 0,
    isFullyReal: currentVersesStats.real === currentVersesStats.total && currentVersesStats.total > 0,
    overallQualityPercentage: dataQuality?.qualityPercentage || 0
  };
}
