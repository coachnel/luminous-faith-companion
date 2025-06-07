// --- src/components/BibleView.tsx ---
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
    searchQuery,
    searchResults,
    currentVerses,
    setSelectedBook,
    setSelectedChapter,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="bg-white shadow-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-bible-primary to-bible-secondary rounded-full flex items-center justify-center">
              <Book className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Compagnon Spirituel</h1>
              <p className="text-gray-600 text-xs sm:text-sm">Votre parcours de foi</p>
            </div>
          </div>

          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              placeholder="Rechercher un verset, un mot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 py-2 sm:py-3 text-sm sm:text-base border-purple-200 focus:border-bible-primary focus:ring-bible-primary"
            />
          </div>

          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-4">
            <div className="w-full">
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger className="border-purple-200 focus:border-bible-primary text-sm sm:text-base">
                  <SelectValue placeholder="Sélectionner un livre" />
                </SelectTrigger>
                <SelectContent className="bg-white border-purple-200 max-h-60 sm:max-h-80">
                  <div className="px-3 py-2 text-xs sm:text-sm font-semibold text-gray-500">Ancien Testament</div>
                  {oldTestamentBooks.map((book) => (
                    <SelectItem key={book.name} value={book.name} className="hover:bg-purple-50 text-sm">
                      {book.name}
                    </SelectItem>
                  ))}
                  <Separator className="my-2" />
                  <div className="px-3 py-2 text-xs sm:text-sm font-semibold text-gray-500">Nouveau Testament</div>
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
                <SelectTrigger className="border-purple-200 focus:border-bible-primary text-sm sm:text-base">
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
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
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
                    Aucun verset disponible.
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
