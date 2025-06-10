
import bibleData from '@/data/louis-segond.json';
import { BookInfo, Chapter, Verse } from '@/types/bible';

interface BibleBook {
  name: string;
  chapters: {
    chapter: number;
    verses: {
      book: string;
      chapter: number;
      verse: number;
      text: string;
    }[];
  }[];
}

interface BibleData {
  version: string;
  oldTestament: BibleBook[];
  newTestament: BibleBook[];
}

const typedBibleData = bibleData as BibleData;

// Cache pour améliorer les performances
const cache = new Map<string, any>();

export const getBooks = async (): Promise<BookInfo[]> => {
  const cacheKey = 'books';
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const books: BookInfo[] = [];
    
    // Ancien Testament
    typedBibleData.oldTestament.forEach((book) => {
      books.push({
        name: book.name,
        chaptersCount: book.chapters.length,
        testament: 'old'
      });
    });

    // Nouveau Testament
    typedBibleData.newTestament.forEach((book) => {
      books.push({
        name: book.name,
        chaptersCount: book.chapters.length,
        testament: 'new'
      });
    });

    cache.set(cacheKey, books);
    return books;
  } catch (error) {
    console.error('Erreur lors du chargement des livres:', error);
    return [];
  }
};

export const getChapters = async (bookName: string): Promise<Chapter[]> => {
  const cacheKey = `chapters-${bookName}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const allBooks = [...typedBibleData.oldTestament, ...typedBibleData.newTestament];
    const book = allBooks.find(b => b.name === bookName);
    
    if (!book) {
      throw new Error(`Livre non trouvé: ${bookName}`);
    }

    const chapters: Chapter[] = book.chapters.map(chapter => ({
      chapter: chapter.chapter,
      verseCount: chapter.verses.length
    }));

    cache.set(cacheKey, chapters);
    return chapters;
  } catch (error) {
    console.error(`Erreur lors du chargement des chapitres pour ${bookName}:`, error);
    return [];
  }
};

export const getVerses = async (bookName: string, chapterNumber: number): Promise<Verse[]> => {
  const cacheKey = `verses-${bookName}-${chapterNumber}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const allBooks = [...typedBibleData.oldTestament, ...typedBibleData.newTestament];
    const book = allBooks.find(b => b.name === bookName);
    
    if (!book) {
      throw new Error(`Livre non trouvé: ${bookName}`);
    }

    const chapter = book.chapters.find(c => c.chapter === chapterNumber);
    if (!chapter) {
      throw new Error(`Chapitre ${chapterNumber} non trouvé dans ${bookName}`);
    }

    cache.set(cacheKey, chapter.verses);
    return chapter.verses;
  } catch (error) {
    console.error(`Erreur lors du chargement des versets pour ${bookName} ${chapterNumber}:`, error);
    return [];
  }
};

export const searchVerses = async (query: string): Promise<Verse[]> => {
  if (!query.trim()) return [];

  const cacheKey = `search-${query.toLowerCase()}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const results: Verse[] = [];
    const searchTerm = query.toLowerCase();
    const allBooks = [...typedBibleData.oldTestament, ...typedBibleData.newTestament];

    allBooks.forEach(book => {
      book.chapters.forEach(chapter => {
        chapter.verses.forEach(verse => {
          if (verse.text.toLowerCase().includes(searchTerm)) {
            results.push(verse);
          }
        });
      });
    });

    const limitedResults = results.slice(0, 50); // Limiter à 50 résultats
    cache.set(cacheKey, limitedResults);
    return limitedResults;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
};

export const getRandomVerse = async (): Promise<Verse | null> => {
  try {
    const allBooks = [...typedBibleData.oldTestament, ...typedBibleData.newTestament];
    const randomBook = allBooks[Math.floor(Math.random() * allBooks.length)];
    const randomChapter = randomBook.chapters[Math.floor(Math.random() * randomBook.chapters.length)];
    const randomVerse = randomChapter.verses[Math.floor(Math.random() * randomChapter.verses.length)];
    
    return randomVerse;
  } catch (error) {
    console.error('Erreur lors de la récupération du verset aléatoire:', error);
    return null;
  }
};
