
import { BibleData, BookInfo, Verse, Chapter } from '../types/bible';
import louisSegondData from '../data/louis-segond.json';

class BibleDataManager {
  private static instance: BibleDataManager;
  private data: BibleData | null = null;

  static getInstance(): BibleDataManager {
    if (!BibleDataManager.instance) {
      BibleDataManager.instance = new BibleDataManager();
    }
    return BibleDataManager.instance;
  }

  private loadData(): BibleData {
    if (this.data) return this.data;

    // Utiliser les vraies données Louis Segond
    this.data = {
      oldTestament: louisSegondData.oldTestament || [],
      newTestament: louisSegondData.newTestament || []
    };

    return this.data;
  }

  getBooks(): BookInfo[] {
    const data = this.loadData();
    
    const oldTestamentBooks = data.oldTestament.map(book => ({
      name: book.name,
      testament: 'old' as const,
      chaptersCount: book.chapters.length,
    }));

    const newTestamentBooks = data.newTestament.map(book => ({
      name: book.name,
      testament: 'new' as const,
      chaptersCount: book.chapters.length,
    }));

    return [...oldTestamentBooks, ...newTestamentBooks];
  }

  getChapters(bookName: string): Chapter[] {
    const data = this.loadData();
    const book = [...data.oldTestament, ...data.newTestament].find(b => b.name === bookName);
    
    if (!book) {
      console.warn(`Livre non trouvé: ${bookName}`);
      return [];
    }
    
    return book.chapters || [];
  }

  getVerses(bookName: string, chapterNumber: number): Verse[] {
    const chapters = this.getChapters(bookName);
    const chapter = chapters.find(c => c.chapter === chapterNumber);
    
    if (!chapter) {
      console.warn(`Chapitre ${chapterNumber} non trouvé dans ${bookName}`);
      return [];
    }
    
    return chapter.verses || [];
  }

  searchVerses(query: string): Verse[] {
    if (!query.trim()) return [];
    
    const data = this.loadData();
    const allVerses: Verse[] = [];
    
    // Recherche dans tous les livres
    [...data.oldTestament, ...data.newTestament].forEach(book => {
      book.chapters.forEach(chapter => {
        chapter.verses.forEach(verse => {
          if (verse.text.toLowerCase().includes(query.toLowerCase())) {
            allVerses.push(verse);
          }
        });
      });
    });
    
    return allVerses.slice(0, 50); // Limite à 50 résultats
  }
}

const bibleManager = BibleDataManager.getInstance();

export const getBooks = async (): Promise<BookInfo[]> => {
  return bibleManager.getBooks();
};

export const getChapters = async (bookName: string): Promise<Chapter[]> => {
  return bibleManager.getChapters(bookName);
};

export const getVerses = async (bookName: string, chapterNumber: number): Promise<Verse[]> => {
  return bibleManager.getVerses(bookName, chapterNumber);
};

export const searchVerses = async (query: string): Promise<Verse[]> => {
  return bibleManager.searchVerses(query);
};
