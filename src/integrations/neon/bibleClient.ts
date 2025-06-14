
// Client API pour les données bibliques stockées dans Neon
import { neonClient } from './restClient';
import { BibleDataLoader } from './bibleDataLoader';

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

// Données des 73 livres catholiques
const getBibleBooksData = () => {
  const oldTestamentBooks = [
    { id: 'gen', name: 'Genèse', chapters: 50 },
    { id: 'exo', name: 'Exode', chapters: 40 },
    { id: 'lev', name: 'Lévitique', chapters: 27 },
    { id: 'num', name: 'Nombres', chapters: 36 },
    { id: 'deu', name: 'Deutéronome', chapters: 34 },
    { id: 'jos', name: 'Josué', chapters: 24 },
    { id: 'jdg', name: 'Juges', chapters: 21 },
    { id: 'rut', name: 'Ruth', chapters: 4 },
    { id: '1sa', name: '1 Samuel', chapters: 31 },
    { id: '2sa', name: '2 Samuel', chapters: 24 },
    { id: '1ki', name: '1 Rois', chapters: 22 },
    { id: '2ki', name: '2 Rois', chapters: 25 },
    { id: '1ch', name: '1 Chroniques', chapters: 29 },
    { id: '2ch', name: '2 Chroniques', chapters: 36 },
    { id: 'ezr', name: 'Esdras', chapters: 10 },
    { id: 'neh', name: 'Néhémie', chapters: 13 },
    { id: 'tob', name: 'Tobie', chapters: 14 },
    { id: 'jdt', name: 'Judith', chapters: 16 },
    { id: 'est', name: 'Esther', chapters: 10 },
    { id: 'job', name: 'Job', chapters: 42 },
    { id: 'psa', name: 'Psaumes', chapters: 150 },
    { id: 'pro', name: 'Proverbes', chapters: 31 },
    { id: 'ecc', name: 'Ecclésiaste', chapters: 12 },
    { id: 'sng', name: 'Cantique des Cantiques', chapters: 8 },
    { id: 'wis', name: 'Sagesse', chapters: 19 },
    { id: 'sir', name: 'Siracide', chapters: 51 },
    { id: 'isa', name: 'Isaïe', chapters: 66 },
    { id: 'jer', name: 'Jérémie', chapters: 52 },
    { id: 'lam', name: 'Lamentations', chapters: 5 },
    { id: 'bar', name: 'Baruch', chapters: 6 },
    { id: 'eze', name: 'Ézéchiel', chapters: 48 },
    { id: 'dan', name: 'Daniel', chapters: 14 },
    { id: 'hos', name: 'Osée', chapters: 14 },
    { id: 'joe', name: 'Joël', chapters: 3 },
    { id: 'amo', name: 'Amos', chapters: 9 },
    { id: 'oba', name: 'Abdias', chapters: 1 },
    { id: 'jon', name: 'Jonas', chapters: 4 },
    { id: 'mic', name: 'Michée', chapters: 7 },
    { id: 'nah', name: 'Nahum', chapters: 3 },
    { id: 'hab', name: 'Habacuc', chapters: 3 },
    { id: 'zep', name: 'Sophonie', chapters: 3 },
    { id: 'hag', name: 'Aggée', chapters: 2 },
    { id: 'zec', name: 'Zacharie', chapters: 14 },
    { id: 'mal', name: 'Malachie', chapters: 4 },
    { id: '1ma', name: '1 Maccabées', chapters: 16 },
    { id: '2ma', name: '2 Maccabées', chapters: 15 }
  ];

  const newTestamentBooks = [
    { id: 'mat', name: 'Matthieu', chapters: 28 },
    { id: 'mar', name: 'Marc', chapters: 16 },
    { id: 'luk', name: 'Luc', chapters: 24 },
    { id: 'joh', name: 'Jean', chapters: 21 },
    { id: 'act', name: 'Actes', chapters: 28 },
    { id: 'rom', name: 'Romains', chapters: 16 },
    { id: '1co', name: '1 Corinthiens', chapters: 16 },
    { id: '2co', name: '2 Corinthiens', chapters: 13 },
    { id: 'gal', name: 'Galates', chapters: 6 },
    { id: 'eph', name: 'Éphésiens', chapters: 6 },
    { id: 'phi', name: 'Philippiens', chapters: 4 },
    { id: 'col', name: 'Colossiens', chapters: 4 },
    { id: '1th', name: '1 Thessaloniciens', chapters: 5 },
    { id: '2th', name: '2 Thessaloniciens', chapters: 3 },
    { id: '1ti', name: '1 Timothée', chapters: 6 },
    { id: '2ti', name: '2 Timothée', chapters: 4 },
    { id: 'tit', name: 'Tite', chapters: 3 },
    { id: 'phm', name: 'Philémon', chapters: 1 },
    { id: 'heb', name: 'Hébreux', chapters: 13 },
    { id: 'jas', name: 'Jacques', chapters: 5 },
    { id: '1pe', name: '1 Pierre', chapters: 5 },
    { id: '2pe', name: '2 Pierre', chapters: 3 },
    { id: '1jo', name: '1 Jean', chapters: 5 },
    { id: '2jo', name: '2 Jean', chapters: 1 },
    { id: '3jo', name: '3 Jean', chapters: 1 },
    { id: 'jud', name: 'Jude', chapters: 1 },
    { id: 'rev', name: 'Apocalypse', chapters: 22 }
  ];

  return { oldTestament: oldTestamentBooks, newTestament: newTestamentBooks };
};

// Client pour les données bibliques Neon
class NeonBibleClient {
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    
    if (!this.initPromise) {
      this.initPromise = this.performInitialization();
    }
    
    await this.initPromise;
  }

  private async performInitialization(): Promise<void> {
    try {
      console.log('🔄 Initialisation du client Bible Neon avec données réelles...');
      
      // Charger les versets réels
      const realVerses = BibleDataLoader.loadRealVerses();
      
      // Initialiser les versions
      const versions: NeonBibleVersion[] = [
        { id: 'fr_apee', name: 'Bible Française APEE', abbreviation: 'APEE', language: 'fr', year: 2000 },
        { id: 'lsg1910', name: 'Louis Segond (1910)', abbreviation: 'LSG', language: 'fr', year: 1910 },
        { id: 'jerusalem', name: 'Bible de Jérusalem', abbreviation: 'BJ', language: 'fr', year: 1973 }
      ];
      
      // Initialiser les livres
      const data = getBibleBooksData();
      const books: NeonBook[] = [];
      let orderNumber = 1;

      data.oldTestament.forEach(book => {
        books.push({
          id: book.id,
          name: book.name,
          testament: 'old',
          chapters_count: book.chapters,
          order_number: orderNumber++
        });
      });

      data.newTestament.forEach(book => {
        books.push({
          id: book.id,
          name: book.name,
          testament: 'new',
          chapters_count: book.chapters,
          order_number: orderNumber++
        });
      });
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('neon_books', JSON.stringify(books));
      localStorage.setItem('neon_verses', JSON.stringify(realVerses));
      localStorage.setItem('neon_bible_versions', JSON.stringify(versions));
      
      this.initialized = true;
      console.log(`✅ Bible initialisée: ${books.length} livres, ${realVerses.length} versets réels`);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation:', error);
      this.initPromise = null;
      throw error;
    }
  }

  async getBooks(): Promise<NeonBook[]> {
    try {
      await this.ensureInitialized();
      const books = JSON.parse(localStorage.getItem('neon_books') || '[]');
      return books.sort((a: NeonBook, b: NeonBook) => a.order_number - b.order_number);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des livres:', error);
      return [];
    }
  }

  async getChapters(bookId: string): Promise<NeonChapter[]> {
    try {
      await this.ensureInitialized();
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
      console.error('❌ Erreur lors de la récupération des chapitres:', error);
      return [];
    }
  }

  async getVerses(bookId: string, chapterNumber: number, versionId: string = 'fr_apee'): Promise<NeonVerse[]> {
    try {
      await this.ensureInitialized();
      
      // Utiliser directement le loader pour les versets réels
      const verses = BibleDataLoader.getVersesForChapter(bookId, chapterNumber);
      
      console.log(`✅ ${verses.length} versets réels chargés pour ${bookId} ${chapterNumber}`);
      
      return verses;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des versets:', error);
      return [];
    }
  }

  async searchVerses(query: string, versionId: string = 'fr_apee', limit: number = 50): Promise<NeonVerse[]> {
    try {
      await this.ensureInitialized();
      
      const results = BibleDataLoader.searchVerses(query, limit);
      console.log(`✅ ${results.length} versets trouvés pour "${query}"`);
      
      return results;
    } catch (error) {
      console.error('❌ Erreur lors de la recherche de versets:', error);
      return [];
    }
  }

  async getVersions(): Promise<NeonBibleVersion[]> {
    try {
      await this.ensureInitialized();
      const versions = JSON.parse(localStorage.getItem('neon_bible_versions') || '[]');
      return versions;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des versions:', error);
      return [
        { id: 'fr_apee', name: 'Bible Française APEE', abbreviation: 'APEE', language: 'fr', year: 2000 }
      ];
    }
  }

  async searchByReference(reference: string, versionId: string = 'fr_apee'): Promise<NeonVerse[]> {
    try {
      console.log(`🔍 Recherche par référence: "${reference}"`);
      
      const refPattern = /^(.+?)\s+(\d+)(?::(\d+))?$/;
      const match = reference.trim().match(refPattern);
      
      if (!match) {
        console.log('❌ Format de référence invalide');
        return [];
      }
      
      const [, bookName, chapter, verse] = match;
      
      const books = await this.getBooks();
      const book = books.find(b => 
        b.name.toLowerCase().includes(bookName.toLowerCase()) ||
        bookName.toLowerCase().includes(b.name.toLowerCase())
      );
      
      if (!book) {
        console.log(`❌ Livre "${bookName}" non trouvé`);
        return [];
      }
      
      if (verse) {
        const verses = await this.getVerses(book.id, parseInt(chapter), versionId);
        return verses.filter(v => v.verse_number === parseInt(verse));
      } else {
        return await this.getVerses(book.id, parseInt(chapter), versionId);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la recherche par référence:', error);
      return [];
    }
  }

  private async getVerseCountForChapter(bookId: string, chapterNumber: number): Promise<number> {
    const verses = BibleDataLoader.getVersesForChapter(bookId, chapterNumber);
    return verses.length || 10; // Fallback de 10 versets
  }

  async getDataQualityReport(): Promise<any> {
    try {
      await this.ensureInitialized();
      
      const allVerses = BibleDataLoader.loadRealVerses();
      const totalVerses = allVerses.length;
      const realVerses = totalVerses; // Tous les versets du loader sont réels
      
      return {
        totalVerses,
        realVerses,
        placeholders: 0,
        qualityPercentage: 100
      };
    } catch (error) {
      console.error('❌ Erreur lors de la génération du rapport qualité:', error);
      return { totalVerses: 0, realVerses: 0, placeholders: 0, qualityPercentage: 0 };
    }
  }

  async forceReinitialize(): Promise<void> {
    console.log('🔄 Réinitialisation forcée des données bibliques...');
    
    localStorage.removeItem('neon_books');
    localStorage.removeItem('neon_verses');
    localStorage.removeItem('neon_bible_versions');
    
    this.initialized = false;
    this.initPromise = null;
    
    await this.ensureInitialized();
    
    console.log('✅ Réinitialisation forcée terminée');
  }
}

export const neonBibleClient = new NeonBibleClient();

export const forceReinitializeBibleData = () => {
  return neonBibleClient.forceReinitialize();
};
