
// Chargeur de données bibliques optimisé avec correctifs de qualité
import { verseLoader } from './verseLoader';
import { NeonVerse, NeonBook } from './bibleClient';

export class BibleDataLoader {
  
  static async loadRealVerses(): Promise<NeonVerse[]> {
    console.log('🔄 Chargement des versets via le système optimisé...');
    
    try {
      // Utiliser le nouveau système de chargement
      await verseLoader.loadAllBibleData();
      
      // Récupérer tous les versets chargés
      const books = verseLoader.getBooks();
      const allVerses: NeonVerse[] = [];
      
      // Collecter tous les versets de tous les livres
      for (const book of books) {
        for (let chapter = 1; chapter <= Math.min(book.chapters_count, 5); chapter++) {
          const verses = verseLoader.getVerses(book.id, chapter);
          allVerses.push(...verses);
        }
      }
      
      console.log(`✅ ${allVerses.length} versets chargés via le système optimisé`);
      
      // Analyser la qualité des données
      const realVerses = allVerses.filter(verse => {
        const isReal = !verse.text.includes('[Verset à charger]') && 
                      !verse.text.includes('Contenu en cours') &&
                      !verse.text.includes('Texte à compléter') && 
                      !verse.text.includes('Verset') && 
                      !verse.text.includes('chapitre') &&
                      verse.text.length > 15 &&
                      !verse.text.includes('Parole divine pour nourrir') &&
                      !verse.text.startsWith('Verset') &&
                      !verse.text.startsWith('Chapitre');
        return isReal;
      });
      
      console.log(`📊 Qualité des données: ${realVerses.length}/${allVerses.length} versets authentiques (${Math.round((realVerses.length / allVerses.length) * 100)}%)`);
      
      return allVerses;
    } catch (error) {
      console.error('❌ Erreur lors du chargement des versets:', error);
      return [];
    }
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
