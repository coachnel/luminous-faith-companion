
// Chargeur de données bibliques optimisé - remplace l'ancien système
import { verseLoader } from './verseLoader';
import { NeonVerse, NeonBook } from './bibleClient';

export class BibleDataLoader {
  
  static async loadRealVerses(): Promise<NeonVerse[]> {
    console.log('🔄 Chargement des versets via le système optimisé...');
    
    // Utiliser le nouveau système de chargement
    await verseLoader.loadAllBibleData();
    
    // Récupérer tous les versets chargés
    const books = verseLoader.getBooks();
    const allVerses: NeonVerse[] = [];
    
    for (const book of books) {
      for (let chapter = 1; chapter <= book.chapters_count; chapter++) {
        const verses = verseLoader.getVerses(book.id, chapter);
        allVerses.push(...verses);
      }
    }
    
    console.log(`✅ ${allVerses.length} versets chargés via le système optimisé`);
    return allVerses;
  }
  
  static getAvailableBooks(): string[] {
    const books = verseLoader.getBooks();
    return books.map(b => b.id);
  }
  
  static getVersesForBook(bookId: string): NeonVerse[] {
    const book = verseLoader.getBooks().find(b => b.id === bookId);
    if (!book) return [];
    
    const allVerses: NeonVerse[] = [];
    for (let chapter = 1; chapter <= book.chapters_count; chapter++) {
      const verses = verseLoader.getVerses(bookId, chapter);
      allVerses.push(...verses);
    }
    
    return allVerses;
  }
  
  static getVersesForChapter(bookId: string, chapterNumber: number): NeonVerse[] {
    return verseLoader.getVerses(bookId, chapterNumber);
  }
  
  static searchVerses(query: string, limit: number = 50): NeonVerse[] {
    return verseLoader.searchVerses(query, limit);
  }
}
