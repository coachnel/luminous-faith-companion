
// Client API pour les données bibliques stockées dans Neon
import { neonClient } from './restClient';
import { bibleDataInitializer } from './bibleDataInitializer';

// Types pour les données bibliques Neon
export interface NeonBook {
  id: string;
  name: string;
  testament: 'old' | 'new';
  chapters_count: number;
  order_number: number;
}

export interface NeonChapter {
  id: string;
  book_id: string;
  chapter_number: number;
  verses_count: number;
}

export interface NeonVerse {
  id: string;
  book_id: string;
  book_name: string;
  chapter_number: number;
  verse_number: number;
  text: string;
  version_id: string;
  version_name: string;
}

export interface NeonBibleVersion {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
  year: number;
}

// Client pour les données bibliques Neon
class NeonBibleClient {
  private initialized = false;

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await bibleDataInitializer.initializeCompleteBibleData();
      this.initialized = true;
    }
  }

  // Récupérer tous les livres
  async getBooks(): Promise<NeonBook[]> {
    try {
      await this.ensureInitialized();
      console.log('Fetching books from Neon...');
      
      // Charger depuis le stockage local initialisé
      const books = JSON.parse(localStorage.getItem('neon_books') || '[]');
      return books.sort((a: NeonBook, b: NeonBook) => a.order_number - b.order_number);
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  }

  // Récupérer les chapitres d'un livre
  async getChapters(bookId: string): Promise<NeonChapter[]> {
    try {
      console.log('Fetching chapters for book:', bookId);
      const books = await this.getBooks();
      const book = books.find(b => b.id === bookId);
      
      if (!book) return [];

      const chapters: NeonChapter[] = [];
      for (let i = 1; i <= book.chapters_count; i++) {
        chapters.push({
          id: `${bookId}-${i}`,
          book_id: bookId,
          chapter_number: i,
          verses_count: await this.getVerseCountForChapter(bookId, i)
        });
      }
      
      return chapters;
    } catch (error) {
      console.error('Error fetching chapters:', error);
      return [];
    }
  }

  // Récupérer les versets d'un chapitre
  async getVerses(bookId: string, chapterNumber: number, versionId: string = 'lsg1910'): Promise<NeonVerse[]> {
    try {
      await this.ensureInitialized();
      console.log('Fetching verses for book:', bookId, 'chapter:', chapterNumber, 'version:', versionId);
      
      // Charger tous les versets depuis le stockage
      const allVerses = JSON.parse(localStorage.getItem('neon_verses') || '[]');
      
      // Filtrer par livre, chapitre et version
      let verses = allVerses.filter((verse: NeonVerse) => 
        verse.book_id === bookId && 
        verse.chapter_number === chapterNumber &&
        verse.version_id === versionId
      );

      // Si aucun verset trouvé, générer des versets par défaut
      if (verses.length === 0) {
        verses = await bibleDataInitializer.generateMissingVerses(bookId, chapterNumber);
        
        // Sauvegarder les nouveaux versets
        const updatedVerses = [...allVerses, ...verses];
        localStorage.setItem('neon_verses', JSON.stringify(updatedVerses));
      }

      return verses.sort((a: NeonVerse, b: NeonVerse) => a.verse_number - b.verse_number);
    } catch (error) {
      console.error('Error fetching verses:', error);
      return [];
    }
  }

  // Recherche de versets
  async searchVerses(query: string, versionId: string = 'lsg1910', limit: number = 50): Promise<NeonVerse[]> {
    try {
      await this.ensureInitialized();
      console.log('Searching verses with query:', query);
      
      const allVerses = JSON.parse(localStorage.getItem('neon_verses') || '[]');
      
      const filteredVerses = allVerses
        .filter((verse: NeonVerse) => 
          verse.version_id === versionId &&
          verse.text.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, limit);
      
      return filteredVerses.sort((a: NeonVerse, b: NeonVerse) => {
        if (a.book_name !== b.book_name) return a.book_name.localeCompare(b.book_name);
        if (a.chapter_number !== b.chapter_number) return a.chapter_number - b.chapter_number;
        return a.verse_number - b.verse_number;
      });
    } catch (error) {
      console.error('Error searching verses:', error);
      return [];
    }
  }

  // Récupérer les versions bibliques disponibles
  async getVersions(): Promise<NeonBibleVersion[]> {
    try {
      await this.ensureInitialized();
      console.log('Fetching bible versions...');
      
      const versions = JSON.parse(localStorage.getItem('neon_bible_versions') || '[]');
      return versions.sort((a: NeonBibleVersion, b: NeonBibleVersion) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching versions:', error);
      // Fallback vers les versions par défaut
      return [
        { id: 'lsg1910', name: 'Louis Segond (1910)', abbreviation: 'LSG', language: 'fr', year: 1910 },
        { id: 'jerusalem', name: 'Bible de Jérusalem', abbreviation: 'BJ', language: 'fr', year: 1973 },
        { id: 'tob', name: 'Traduction Œcuménique', abbreviation: 'TOB', language: 'fr', year: 1975 }
      ];
    }
  }

  // Recherche par référence (ex: "Jean 3:16")
  async searchByReference(reference: string, versionId: string = 'lsg1910'): Promise<NeonVerse[]> {
    try {
      console.log('Searching by reference:', reference);
      
      // Parser la référence (format: "Livre Chapitre:Verset")
      const refPattern = /^(.+?)\s+(\d+)(?::(\d+))?$/;
      const match = reference.trim().match(refPattern);
      
      if (!match) return [];
      
      const [, bookName, chapter, verse] = match;
      
      // Chercher le livre
      const books = await this.getBooks();
      const book = books.find(b => 
        b.name.toLowerCase().includes(bookName.toLowerCase()) ||
        bookName.toLowerCase().includes(b.name.toLowerCase())
      );
      
      if (!book) return [];
      
      // Chercher les versets
      if (verse) {
        // Verset spécifique
        const verses = await this.getVerses(book.id, parseInt(chapter), versionId);
        return verses.filter(v => v.verse_number === parseInt(verse));
      } else {
        // Chapitre entier
        return await this.getVerses(book.id, parseInt(chapter), versionId);
      }
    } catch (error) {
      console.error('Error searching by reference:', error);
      return [];
    }
  }

  private async getVerseCountForChapter(bookId: string, chapterNumber: number): Promise<number> {
    const verses = await this.getVerses(bookId, chapterNumber);
    return verses.length || 15; // 15 versets par défaut si aucun trouvé
  }
}

export const neonBibleClient = new NeonBibleClient();

// Initialisation des données de test (fallback localStorage) - OBSOLÈTE
// Cette fonction est maintenant remplacée par BibleDataInitializer
export const initializeBibleData = () => {
  console.log('⚠️ initializeBibleData est obsolète. Utiliser BibleDataInitializer à la place.');
  // Garder pour compatibilité mais rediriger vers le nouveau système
  return bibleDataInitializer.initializeCompleteBibleData();
};
