
import React from 'react';
import { Search, Book, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useBible } from '../contexts/BibleContext';
import VerseCard from './VerseCard';

const BibleView: React.FC = () => {
  const {
    books,
    selectedBook,
    selectedChapter,
    selectedVersion,
    searchQuery,
    searchResults,
    currentVerses,
    isLoading,
    setSelectedBook,
    setSelectedChapter,
    setSelectedVersion,
    setSearchQuery,
    getAvailableChapters,
  } = useBible();

  const oldTestamentBooks = books.filter(book => book.testament === 'old');
  const newTestamentBooks = books.filter(book => book.testament === 'new');
  const availableChapters = getAvailableChapters();

  const handlePreviousChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    }
  };

  const handleNextChapter = () => {
    const maxChapter = Math.max(...availableChapters);
    if (selectedChapter < maxChapter) {
      setSelectedChapter(selectedChapter + 1);
    }
  };

  const displayedVerses = searchQuery.trim() ? searchResults : currentVerses;
  const showSearchResults = searchQuery.trim() && searchResults.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600 text-sm sm:text-base">Chargement de la Bible complète (73 livres)...</p>
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
              <Book className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Bible Complète</h1>
              <p className="text-gray-600 text-xs sm:text-sm">{books.length} livres • Votre parcours spirituel</p>
            </div>
          </div>

          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              placeholder="Rechercher un verset, un mot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 py-2 sm:py-3 text-sm sm:text-base border-purple-200 focus:border-purple-600 focus:ring-purple-600"
            />
          </div>

          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-4">
            <div className="w-full">
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger className="border-purple-200 focus:border-purple-600 text-sm sm:text-base">
                  <SelectValue placeholder="Sélectionner un livre" />
                </SelectTrigger>
                <SelectContent className="bg-white border-purple-200 max-h-60 sm:max-h-80">
                  <div className="px-3 py-2 text-xs sm:text-sm font-semibold text-gray-500">
                    Ancien Testament ({oldTestamentBooks.length} livres)
                  </div>
                  {oldTestamentBooks.map((book) => (
                    <SelectItem key={book.name} value={book.name} className="hover:bg-purple-50 text-sm">
                      {book.name}
                    </SelectItem>
                  ))}
                  <Separator className="my-2" />
                  <div className="px-3 py-2 text-xs sm:text-sm font-semibold text-gray-500">
                    Nouveau Testament ({newTestamentBooks.length} livres)
                  </div>
                  {newTestamentBooks.map((book) => (
                    <SelectItem key={book.name} value={book.name} className="hover:bg-purple-50 text-sm">
                      {book.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousChapter}
                disabled={selectedChapter <= 1}
                className="border-purple-200 hover:bg-purple-50 flex-shrink-0 p-2 sm:px-3"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Select 
                value={selectedChapter.toString()} 
                onValueChange={(value) => setSelectedChapter(parseInt(value))}
              >
                <SelectTrigger className="border-purple-200 focus:border-purple-600 text-sm sm:text-base">
                  <SelectValue placeholder="Chapitre" />
                </SelectTrigger>
                <SelectContent className="bg-white border-purple-200 max-h-60">
                  {availableChapters.map((chapter) => (
                    <SelectItem key={chapter} value={chapter.toString()} className="hover:bg-purple-50 text-sm">
                      Chapitre {chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextChapter}
                disabled={selectedChapter >= Math.max(...availableChapters)}
                className="border-purple-200 hover:bg-purple-50 flex-shrink-0 p-2 sm:px-3"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="w-full">
              <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                <SelectTrigger className="border-purple-200 focus:border-purple-600 text-sm sm:text-base">
                  <SelectValue placeholder="Version" />
                </SelectTrigger>
                <SelectContent className="bg-white border-purple-200">
                  <SelectItem value="Louis Segond (1910)" className="hover:bg-purple-50 text-sm">Louis Segond (1910)</SelectItem>
                  <SelectItem value="Bible de Jérusalem" className="hover:bg-purple-50 text-sm">Bible de Jérusalem</SelectItem>
                  <SelectItem value="Traduction Œcuménique" className="hover:bg-purple-50 text-sm">Traduction Œcuménique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
        {showSearchResults && (
          <Card className="mb-4 sm:mb-6 bg-white border-purple-200">
            <CardHeader className="pb-3 px-4 sm:px-6">
              <h2 className="text-base sm:text-lg font-semibold text-purple-600 flex items-center gap-2">
                <Book className="h-4 w-4 sm:h-5 sm:w-5" />
                Résultats de recherche
                <span className="text-xs sm:text-sm font-normal text-purple-400">
                  {searchResults.length} résultat(s)
                </span>
              </h2>
            </CardHeader>
          </Card>
        )}

        {!showSearchResults && (
          <Card className="mb-4 sm:mb-6 bg-white border-purple-200">
            <CardHeader className="pb-3 px-4 sm:px-6">
              <h2 className="text-base sm:text-lg font-semibold text-purple-600 flex items-center gap-2">
                <Book className="h-4 w-4 sm:h-5 sm:w-5" />
                {selectedBook} - Chapitre {selectedChapter}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">Version {selectedVersion}</p>
            </CardHeader>
          </Card>
        )}

        <ScrollArea className="h-[calc(100vh-280px)] sm:h-[600px]">
          <div className="space-y-3 sm:space-y-4 pb-4">
            {displayedVerses.length > 0 ? (
              displayedVerses.map((verse) => (
                <div key={`${verse.book}-${verse.chapter}-${verse.verse}`} className="animate-fade-in">
                  <VerseCard verse={verse} />
                </div>
              ))
            ) : (
              <Card className="bg-white border-purple-200">
                <CardContent className="py-8 sm:py-12 text-center px-4">
                  <Book className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm sm:text-base">
                    {searchQuery.trim() ? 'Aucun verset trouvé pour cette recherche.' : 'Aucun verset disponible.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default BibleView;
