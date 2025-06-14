import React, { useEffect } from 'react';
import { useNeonBible } from '@/hooks/useNeonBible';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area"
import { useBibleReadingProgress } from '@/hooks/useReadingProgress';
import { CheckCircle } from 'lucide-react';

export function EnhancedBibleView() {
  const {
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
    selectBook,
    selectChapter,
    selectVersion,
    setSearchQuery,
    clearSearch,
    goToPreviousChapter,
    goToNextChapter,
    canGoToPrevious,
    canGoToNext,
    isSearching,
    hasSearchResults,
    totalBooks,
    oldTestamentBooks,
    newTestamentBooks,
    currentVersesCount,
    currentVersesStats,
    hasRealVerses,
    isFullyReal,
    overallQualityPercentage
  } = useNeonBible();
  
  const { markChapterRead, progress } = useBibleReadingProgress();

  const handleMarkAsRead = async () => {
    if (!selectedBook) return;
    
    try {
      await markChapterRead(selectedBook.id, selectedBook.name, selectedChapter);
      toast.success(`${selectedBook.name} ${selectedChapter} marqué comme lu !`);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const isChapterRead = progress.some(p => 
    p.book_id === selectedBook?.id && 
    p.chapter_number === selectedChapter && 
    p.is_completed
  );

  return (
    <div className="space-y-6">
      {/* Header and Navigation */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">
            Bible
          </h1>
          <p className="text-sm text-muted-foreground">
            Explorez les Écritures
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedVersion}
            onChange={(e) => selectVersion(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {versions.map((version) => (
              <option key={version.id} value={version.id}>
                {version.name}
              </option>
            ))}
          </select>
          <Input
            type="search"
            placeholder="Rechercher un verset"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isSearching && (
            <Button variant="ghost" size="sm" onClick={clearSearch}>
              Effacer
            </Button>
          )}
        </div>
      </div>

      {/* Barre d'actions avec progression */}
      {selectedBook && (
        <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              {selectedBook.name} - Chapitre {selectedChapter}
            </h2>
            {isChapterRead && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Lu</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousChapter}
              disabled={!canGoToPrevious}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextChapter}
              disabled={!canGoToNext}
            >
              Suivant
            </Button>
            
            <Button
              variant={isChapterRead ? "secondary" : "default"}
              size="sm"
              onClick={handleMarkAsRead}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {isChapterRead ? 'Lu' : 'Marquer comme lu'}
            </Button>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="grid grid-cols-4 gap-4">
        {/* Book List */}
        <div className="col-span-1">
          <Card className="h-[500px]">
            <CardContent className="p-2">
              <ScrollArea className="h-full">
                <div className="space-y-1">
                  {books.map((book) => (
                    <Button
                      key={book.id}
                      variant="ghost"
                      className={`w-full justify-start ${selectedBook?.id === book.id ? 'font-bold' : ''
                        }`}
                      onClick={() => selectBook(book)}
                    >
                      {book.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chapter and Verse Display */}
        <div className="col-span-2">
          {selectedBook ? (
            <Card className="h-[500px]">
              <CardContent className="space-y-4 p-4">
                {/* Chapter Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousChapter}
                    disabled={!canGoToPrevious}
                  >
                    Précédent
                  </Button>
                  <span>
                    Chapitre {selectedChapter} / {selectedBook.chapters_count}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextChapter}
                    disabled={!canGoToNext}
                  >
                    Suivant
                  </Button>
                </div>

                {/* Verse List */}
                <ScrollArea className="h-[350px]">
                  <div className="space-y-2">
                    {currentVerses.map((verse) => (
                      <p key={verse.id} className="text-sm">
                        <span className="font-semibold">{verse.verse_number}.</span>{' '}
                        {verse.text}
                      </p>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <p>Sélectionnez un livre pour commencer.</p>
          )}
        </div>

        {/* Search Results */}
        <div className="col-span-1">
          <Card className="h-[500px]">
            <CardContent className="p-2">
              <ScrollArea className="h-full">
                {isSearching && hasSearchResults ? (
                  <div className="space-y-2">
                    {searchResults.map((result) => (
                      <p key={result.id} className="text-sm">
                        {result.book_name} {result.chapter_number}:{result.verse_number} -{' '}
                        {result.text}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">
                    {isSearching
                      ? 'Aucun résultat.'
                      : 'Recherchez un verset pour afficher les résultats.'}
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
