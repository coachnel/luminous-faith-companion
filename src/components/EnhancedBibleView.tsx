
import React from 'react';
import { Search, Book, ChevronLeft, ChevronRight, X, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNeonBible } from '@/hooks/useNeonBible';
import VerseCard from './VerseCard';

const EnhancedBibleView: React.FC = () => {
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

  const oldTestamentBooksFiltered = books.filter(book => book.testament === 'old');
  const newTestamentBooksFiltered = books.filter(book => book.testament === 'new');
  const displayedVerses = isSearching ? searchResults : currentVerses;
  const currentVersion = versions.find(v => v.id === selectedVersion);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600 text-sm sm:text-base mb-2">Chargement de la Bible complète...</p>
          <p className="text-purple-500 text-xs">Initialisation des 73 livres bibliques catholiques avec versets réels</p>
          <p className="text-purple-400 text-xs mt-1">Cette opération peut prendre quelques instants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="bg-white shadow-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full flex items-center justify-center">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Bible Complète</h1>
              <p className="text-gray-600 text-xs sm:text-sm">
                {totalBooks} livres • {oldTestamentBooks} AT + {newTestamentBooks} NT • {currentVersion?.name || 'Version inconnue'}
              </p>
              {dataQuality && (
                <div className="flex items-center gap-2 mt-1">
                  {dataQuality.qualityPercentage >= 90 ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : dataQuality.qualityPercentage >= 70 ? (
                    <AlertCircle className="h-3 w-3 text-amber-500" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                  <span className="text-xs text-gray-500">
                    {dataQuality.qualityPercentage}% versets réels ({dataQuality.realVerses.toLocaleString()}/{dataQuality.totalVerses.toLocaleString()})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Alerte qualité des données si nécessaire */}
          {dataQuality && dataQuality.qualityPercentage < 100 && (
            <Alert className={`mb-4 ${dataQuality.qualityPercentage >= 70 ? 'border-amber-200 bg-amber-50' : 'border-red-200 bg-red-50'}`}>
              <AlertCircle className={`h-4 w-4 ${dataQuality.qualityPercentage >= 70 ? 'text-amber-600' : 'text-red-600'}`} />
              <AlertDescription className={`${dataQuality.qualityPercentage >= 70 ? 'text-amber-800' : 'text-red-800'} text-sm`}>
                {dataQuality.qualityPercentage >= 70 ? (
                  <>Données bibliques en cours de finalisation. {dataQuality.placeholders.toLocaleString()} versets seront complétés progressivement.</>
                ) : (
                  <>Base biblique en cours d'importation. {dataQuality.placeholders.toLocaleString()} versets restent à charger depuis les sources authentiques.</>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Barre de recherche */}
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              placeholder="Rechercher un verset, une référence (ex: Jean 3:16) ou un mot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 pr-10 py-2 sm:py-3 text-sm sm:text-base border-purple-200 focus:border-purple-600 focus:ring-purple-600"
            />
            {isSearching && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Contrôles de navigation */}
          {!isSearching && (
            <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-4 mb-4">
              {/* Sélecteur de livre */}
              <div className="w-full">
                <Select 
                  value={selectedBook?.id || ''} 
                  onValueChange={(bookId) => {
                    const book = books.find(b => b.id === bookId);
                    if (book) selectBook(book);
                  }}
                >
                  <SelectTrigger className="border-purple-200 focus:border-purple-600 text-sm sm:text-base">
                    <SelectValue placeholder="Sélectionner un livre" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-purple-200 max-h-60 sm:max-h-80">
                    <div className="px-3 py-2 text-xs sm:text-sm font-semibold text-gray-500">
                      Ancien Testament ({oldTestamentBooks} livres)
                    </div>
                    {oldTestamentBooksFiltered.map((book) => (
                      <SelectItem key={book.id} value={book.id} className="hover:bg-purple-50 text-sm">
                        {book.name} ({book.chapters_count} ch.)
                      </SelectItem>
                    ))}
                    <Separator className="my-2" />
                    <div className="px-3 py-2 text-xs sm:text-sm font-semibold text-gray-500">
                      Nouveau Testament ({newTestamentBooks} livres)
                    </div>
                    {newTestamentBooksFiltered.map((book) => (
                      <SelectItem key={book.id} value={book.id} className="hover:bg-purple-50 text-sm">
                        {book.name} ({book.chapters_count} ch.)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Navigation chapitre */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousChapter}
                  disabled={!canGoToPrevious}
                  className="border-purple-200 hover:bg-purple-50 flex-shrink-0 p-2 sm:px-3"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Select 
                  value={selectedChapter.toString()} 
                  onValueChange={(value) => selectChapter(parseInt(value))}
                >
                  <SelectTrigger className="border-purple-200 focus:border-purple-600 text-sm sm:text-base">
                    <SelectValue placeholder="Chapitre" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-purple-200 max-h-60">
                    {selectedBook && Array.from({ length: selectedBook.chapters_count }, (_, i) => i + 1).map((chapter) => (
                      <SelectItem key={chapter} value={chapter.toString()} className="hover:bg-purple-50 text-sm">
                        Chapitre {chapter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextChapter}
                  disabled={!canGoToNext}
                  className="border-purple-200 hover:bg-purple-50 flex-shrink-0 p-2 sm:px-3"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Sélecteur de version */}
              <div className="w-full">
                <Select value={selectedVersion} onValueChange={selectVersion}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-600 text-sm sm:text-base">
                    <SelectValue placeholder="Version" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-purple-200">
                    {versions.map((version) => (
                      <SelectItem key={version.id} value={version.id} className="hover:bg-purple-50 text-sm">
                        {version.name} ({version.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
        {/* En-tête de contenu */}
        {isSearching ? (
          <Card className="mb-4 sm:mb-6 bg-white border-purple-200">
            <CardHeader className="pb-3 px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold text-purple-600 flex items-center gap-2">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  Résultats pour "{searchQuery}"
                </h2>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {searchResults.length} résultat{searchResults.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        ) : (
          selectedBook && (
            <Card className="mb-4 sm:mb-6 bg-white border-purple-200">
              <CardHeader className="pb-3 px-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-semibold text-purple-600 flex items-center gap-2">
                    <Book className="h-4 w-4 sm:h-5 sm:w-5" />
                    {selectedBook.name} - Chapitre {selectedChapter}
                  </h2>
                  <div className="flex items-center gap-2">
                    {isFullyReal && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Texte authentique
                      </Badge>
                    )}
                    {hasRealVerses && !isFullyReal && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {currentVersesStats.real}/{currentVersesStats.total} réels
                      </Badge>
                    )}
                    {!hasRealVerses && currentVersesStats.total > 0 && (
                      <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        En cours de chargement
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  {currentVersion?.name} • {currentVersesCount} verset{currentVersesCount !== 1 ? 's' : ''} • 
                  {selectedBook.testament === 'old' ? ' Ancien Testament' : ' Nouveau Testament'}
                  {currentVersesStats.real > 0 && (
                    <span className="ml-2 text-green-600">
                      • {currentVersesStats.real} texte{currentVersesStats.real !== 1 ? 's' : ''} authentique{currentVersesStats.real !== 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              </CardHeader>
            </Card>
          )
        )}

        {/* Liste des versets */}
        <ScrollArea className="h-[calc(100vh-280px)] sm:h-[600px]">
          <div className="space-y-3 sm:space-y-4 pb-4">
            {displayedVerses.length > 0 ? (
              displayedVerses.map((verse) => (
                <div key={`${verse.book_id}-${verse.chapter_number}-${verse.verse_number}`} className="animate-fade-in">
                  <VerseCard 
                    verse={{
                      book: verse.book_name,
                      chapter: verse.chapter_number,
                      verse: verse.verse_number,
                      text: verse.text
                    }} 
                  />
                </div>
              ))
            ) : (
              <Card className="bg-white border-purple-200">
                <CardContent className="py-8 sm:py-12 text-center px-4">
                  {isSearching ? (
                    <>
                      <Search className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm sm:text-base mb-2">
                        Aucun verset trouvé pour "{searchQuery}"
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        Essayez une référence comme "Jean 3:16" ou un mot-clé
                      </p>
                    </>
                  ) : (
                    <>
                      <Book className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm sm:text-base">
                        {selectedBook ? 'Versets en cours de chargement...' : 'Sélectionnez un livre pour commencer.'}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-2">
                        Bible complète • {totalBooks} livres disponibles • {overallQualityPercentage}% de contenu authentique
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default EnhancedBibleView;
