
// Client optimisé pour les données bibliques avec chargement intelligent
import { verseLoader } from './verseLoader';
import { NeonBook, NeonVerse, NeonBibleVersion } from './bibleClient';

export class OptimizedBibleClient {
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
      console.log('🔄 Initialisation du client Bible optimisé...');
      
      // Charger toutes les données via le verseLoader
      await verseLoader.loadAllBibleData();
      
      this.initialized = true;
      
      const quality = verseLoader.getDataQuality();
      console.log(`✅ Client Bible optimisé initialisé: ${quality.total} versets (${quality.percentage}% réels)`);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation du client optimisé:', error);
      this.initPromise = null;
      throw error;
    }
  }

  async getBooks(): Promise<NeonBook[]> {
    await this.ensureInitialized();
    return verseLoader.getBooks();
  }

  async getVerses(bookId: string, chapterNumber: number, versionId: string = 'lsg1910'): Promise<NeonVerse[]> {
    await this.ensureInitialized();
    const verses = verseLoader.getVerses(bookId, chapterNumber);
    
    console.log(`📖 ${verses.length} versets chargés pour ${bookId} chapitre ${chapterNumber}`);
    return verses;
  }

  async searchVerses(query: string, versionId: string = 'lsg1910', limit: number = 50): Promise<NeonVerse[]> {
    await this.ensureInitialized();
    const results = verseLoader.searchVerses(query, limit);
    
    console.log(`🔍 ${results.length} versets trouvés pour "${query}"`);
    return results;
  }

  async searchByReference(reference: string, versionId: string = 'lsg1910'): Promise<NeonVerse[]> {
    await this.ensureInitialized();
    
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
    
    const chapterVerses = await this.getVerses(book.id, parseInt(chapter), versionId);
    
    if (verse) {
      return chapterVerses.filter(v => v.verse_number === parseInt(verse));
    } else {
      return chapterVerses;
    }
  }

  async getVersions(): Promise<NeonBibleVersion[]> {
    await this.ensureInitialized();
    
    return [
      { id: 'lsg1910', name: 'Louis Segond (1910)', abbreviation: 'LSG', language: 'fr', year: 1910 },
      { id: 'jerusalem', name: 'Bible de Jérusalem', abbreviation: 'BJ', language: 'fr', year: 1973 },
      { id: 'tob', name: 'Traduction Œcuménique', abbreviation: 'TOB', language: 'fr', year: 1975 }
    ];
  }

  async getDataQualityReport(): Promise<{
    totalVerses: number;
    realVerses: number;
    placeholders: number;
    qualityPercentage: number;
  }> {
    await this.ensureInitialized();
    
    const quality = verseLoader.getDataQuality();
    
    return {
      totalVerses: quality.total,
      realVerses: quality.real,
      placeholders: quality.total - quality.real,
      qualityPercentage: quality.percentage
    };
  }

  async forceReinitialize(): Promise<void> {
    console.log('🔄 Réinitialisation forcée du client optimisé...');
    
    this.initialized = false;
    this.initPromise = null;
    
    await verseLoader.forceReload();
    await this.ensureInitialized();
    
    console.log('✅ Réinitialisation forcée terminée');
  }
}

export const optimizedBibleClient = new OptimizedBibleClient();
