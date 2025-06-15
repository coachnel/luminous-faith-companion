
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Book, Heart } from 'lucide-react';
import { useBible } from '@/hooks/useBible';

interface BibleReaderProps {
  book: string;
  chapter: number;
  onNavigate: (book: string, chapter: number) => void;
  onAddToFavorites?: (verse: any) => void;
}

const BibleReader: React.FC<BibleReaderProps> = ({
  book,
  chapter,
  onNavigate,
  onAddToFavorites
}) => {
  const { getChapter, getBookInfo, loading } = useBible();
  const [verses, setVerses] = useState<any[]>([]);
  const [bookInfo, setBookInfo] = useState<any>(null);

  useEffect(() => {
    const loadChapter = async () => {
      try {
        const chapterData = await getChapter(book, chapter);
        const info = await getBookInfo(book);
        setVerses(chapterData || []);
        setBookInfo(info);
      } catch (error) {
        console.error('Erreur lors du chargement du chapitre:', error);
        setVerses([]);
      }
    };

    loadChapter();
  }, [book, chapter, getChapter, getBookInfo]);

  const handlePrevious = () => {
    if (chapter > 1) {
      onNavigate(book, chapter - 1);
    }
  };

  const handleNext = () => {
    if (bookInfo && chapter < bookInfo.chapters) {
      onNavigate(book, chapter + 1);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            {book} {chapter}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={chapter === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>
            <Badge variant="outline">
              Chapitre {chapter}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!bookInfo || chapter >= bookInfo.chapters}
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {verses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun verset trouvé pour ce chapitre.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {verses.map((verse) => (
              <div
                key={verse.verse}
                className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Badge variant="secondary" className="flex-shrink-0">
                  {verse.verse}
                </Badge>
                <div className="flex-1">
                  <p className="text-gray-800 leading-relaxed">{verse.text}</p>
                </div>
                {onAddToFavorites && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddToFavorites(verse)}
                    className="flex-shrink-0"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BibleReader;
