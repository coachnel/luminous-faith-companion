
import { BibleData, BookInfo, Verse, Chapter } from '../types/bible';
import louisSegondData from '../data/louis-segond.json';

// Liste complète des 73 livres de la Bible Louis Segond
const COMPLETE_BIBLE_BOOKS = {
  oldTestament: [
    'Genèse', 'Exode', 'Lévitique', 'Nombres', 'Deutéronome', 'Josué', 'Juges', 'Ruth',
    '1 Samuel', '2 Samuel', '1 Rois', '2 Rois', '1 Chroniques', '2 Chroniques', 'Esdras', 'Néhémie',
    'Esther', 'Job', 'Psaumes', 'Proverbes', 'Ecclésiaste', 'Cantique des Cantiques', 'Ésaïe', 'Jérémie',
    'Lamentations', 'Ézéchiel', 'Daniel', 'Osée', 'Joël', 'Amos', 'Abdias', 'Jonas', 'Michée', 'Nahum',
    'Habacuc', 'Sophonie', 'Aggée', 'Zacharie', 'Malachie', 'Tobie', 'Judith', 'Sagesse', 'Siracide',
    'Baruch', '1 Macchabées', '2 Macchabées'
  ],
  newTestament: [
    'Matthieu', 'Marc', 'Luc', 'Jean', 'Actes', 'Romains', '1 Corinthiens', '2 Corinthiens',
    'Galates', 'Éphésiens', 'Philippiens', 'Colossiens', '1 Thessaloniciens', '2 Thessaloniciens',
    '1 Timothée', '2 Timothée', 'Tite', 'Philémon', 'Hébreux', 'Jacques', '1 Pierre', '2 Pierre',
    '1 Jean', '2 Jean', '3 Jean', 'Jude', 'Apocalypse'
  ]
};

class BibleDataManager {
  private static instance: BibleDataManager;
  private data: BibleData | null = null;

  static getInstance(): BibleDataManager {
    if (!BibleDataManager.instance) {
      BibleDataManager.instance = new BibleDataManager();
    }
    return BibleDataManager.instance;
  }

  private generateSampleChapters(bookName: string, bookType: 'old' | 'new'): Chapter[] {
    // Générer des chapitres d'exemple pour tous les livres
    const chapterCounts = this.getChapterCounts(bookName);
    const chapters: Chapter[] = [];
    
    for (let i = 1; i <= chapterCounts; i++) {
      chapters.push({
        chapter: i,
        verses: this.generateSampleVerses(bookName, i)
      });
    }
    
    return chapters;
  }

  private getChapterCounts(bookName: string): number {
    // Nombre approximatif de chapitres par livre (simplifié)
    const chapterCounts: { [key: string]: number } = {
      'Genèse': 50, 'Exode': 40, 'Lévitique': 27, 'Nombres': 36, 'Deutéronome': 34,
      'Josué': 24, 'Juges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
      '1 Rois': 22, '2 Rois': 25, '1 Chroniques': 29, '2 Chroniques': 36,
      'Esdras': 10, 'Néhémie': 13, 'Esther': 10, 'Job': 42, 'Psaumes': 150,
      'Proverbes': 31, 'Ecclésiaste': 12, 'Cantique des Cantiques': 8,
      'Ésaïe': 66, 'Jérémie': 52, 'Lamentations': 5, 'Ézéchiel': 48, 'Daniel': 12,
      'Osée': 14, 'Joël': 3, 'Amos': 9, 'Abdias': 1, 'Jonas': 4, 'Michée': 7,
      'Nahum': 3, 'Habacuc': 3, 'Sophonie': 3, 'Aggée': 2, 'Zacharie': 14, 'Malachie': 4,
      'Matthieu': 28, 'Marc': 16, 'Luc': 24, 'Jean': 21, 'Actes': 28, 'Romains': 16,
      '1 Corinthiens': 16, '2 Corinthiens': 13, 'Galates': 6, 'Éphésiens': 6,
      'Philippiens': 4, 'Colossiens': 4, '1 Thessaloniciens': 5, '2 Thessaloniciens': 3,
      '1 Timothée': 6, '2 Timothée': 4, 'Tite': 3, 'Philémon': 1, 'Hébreux': 13,
      'Jacques': 5, '1 Pierre': 5, '2 Pierre': 3, '1 Jean': 5, '2 Jean': 1, '3 Jean': 1,
      'Jude': 1, 'Apocalypse': 22
    };
    
    return chapterCounts[bookName] || 10;
  }

  private generateSampleVerses(bookName: string, chapterNumber: number): Verse[] {
    // Générer des versets d'exemple
    const verseCount = Math.floor(Math.random() * 30) + 10; // Entre 10 et 40 versets
    const verses: Verse[] = [];
    
    for (let i = 1; i <= verseCount; i++) {
      verses.push({
        book: bookName,
        chapter: chapterNumber,
        verse: i,
        text: `Verset ${i} du chapitre ${chapterNumber} de ${bookName}. Ce verset contient la parole divine et spirituelle pour nourrir votre âme.`
      });
    }
    
    return verses;
  }

  private loadData(): BibleData {
    if (this.data) return this.data;

    // Utiliser les données existantes et compléter avec les livres manquants
    const existingOldTestament = louisSegondData.oldTestament || [];
    const existingNewTestament = louisSegondData.newTestament || [];
    
    // Compléter l'Ancien Testament
    const completeOldTestament = COMPLETE_BIBLE_BOOKS.oldTestament.map(bookName => {
      const existingBook = existingOldTestament.find(book => book.name === bookName);
      if (existingBook) {
        return existingBook;
      }
      
      return {
        name: bookName,
        chapters: this.generateSampleChapters(bookName, 'old')
      };
    });
    
    // Compléter le Nouveau Testament
    const completeNewTestament = COMPLETE_BIBLE_BOOKS.newTestament.map(bookName => {
      const existingBook = existingNewTestament.find(book => book.name === bookName);
      if (existingBook) {
        return existingBook;
      }
      
      return {
        name: bookName,
        chapters: this.generateSampleChapters(bookName, 'new')
      };
    });

    this.data = {
      oldTestament: completeOldTestament,
      newTestament: completeNewTestament
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
