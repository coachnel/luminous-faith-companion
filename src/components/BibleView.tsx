
import React, { useState, useEffect } from 'react';
import { useNeonBible } from '@/hooks/useNeonBible';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, BookOpen, Heart, CheckCircle } from 'lucide-react';
import { useBibleReadingProgress } from '@/hooks/useReadingProgress';
import { toast } from 'sonner';

const BibleView = () => {
  const { 
    books,
    currentVerses,
    searchResults,
    selectedBook,
    selectedChapter,
    searchQuery,
    isLoading,
    selectBook,
    selectChapter,
    setSearchQuery,
    clearSearch,
    isSearching,
    hasSearchResults
  } = useNeonBible();
  
  const { markChapterRead, progress } = useBibleReadingProgress();
  const [selectedVerse, setSelectedVerse] = useState(null);

  const handleMarkAsRead = async () => {
    if (!selectedBook || !selectedChapter) return;
    
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
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Bible - Lecture et Étude
          </CardTitle>
          <CardDescription>
            Explorez les Écritures saintes et enrichissez votre foi
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Search Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher un verset, un mot ou un passage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            {isSearching && (
              <Button variant="outline" size="sm" onClick={clearSearch}>
                Effacer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Barre d'actions avec progression */}
      {selectedBook && selectedChapter && (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
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
            
            <Button
              variant={isChapterRead ? "secondary" : "default"}
              size="sm"
              onClick={handleMarkAsRead}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {isChapterRead ? 'Lu' : 'Marquer comme lu'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Books List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Livres de la Bible</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              <div className="p-4 space-y-1">
                {books.map((book) => (
                  <Button
                    key={book.id}
                    variant={selectedBook?.id === book.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => selectBook(book)}
                  >
                    {book.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chapter and Verses Display */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {selectedBook ? `${selectedBook.name}${selectedChapter ? ` - Chapitre ${selectedChapter}` : ''}` : 'Sélectionnez un livre'}
              </span>
              {selectedBook && currentVerses.length > 0 && (
                <span className="text-sm text-gray-500">
                  {currentVerses.length} versets
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedBook ? (
              <p className="text-center text-gray-500 py-8">
                Choisissez un livre de la Bible pour commencer votre lecture
              </p>
            ) : (
              <div className="space-y-4">
                {/* Chapter Selection */}
                {selectedBook && !selectedChapter && (
                  <div>
                    <h3 className="font-semibold mb-2">Chapitres disponibles :</h3>
                    <div className="grid grid-cols-10 gap-2">
                      {Array.from({ length: selectedBook.chapters_count || 50 }, (_, i) => i + 1).map((chapter) => (
                        <Button
                          key={chapter}
                          variant="outline"
                          size="sm"
                          onClick={() => selectChapter(chapter)}
                        >
                          {chapter}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verses Display */}
                {currentVerses.length > 0 && (
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {currentVerses.map((verse, index) => (
                        <div
                          key={verse.id || index}
                          className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                            selectedVerse === index ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedVerse(selectedVerse === index ? null : index)}
                        >
                          <div className="flex items-start space-x-2">
                            <span className="font-semibold text-blue-600 text-sm min-w-[2rem]">
                              {verse.verse_number || index + 1}.
                            </span>
                            <p className="text-gray-800 leading-relaxed flex-1">
                              {verse.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search Results */}
      {isSearching && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats de recherche</CardTitle>
          </CardHeader>
          <CardContent>
            {hasSearchResults ? (
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <div key={result.id || index} className="p-3 border rounded-lg">
                      <p className="text-sm font-semibold text-blue-600">
                        {result.book_name} {result.chapter_number}:{result.verse_number}
                      </p>
                      <p className="text-gray-700 mt-1">{result.text}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-center text-gray-500">
                Aucun résultat trouvé pour "{searchQuery}"
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BibleView;
