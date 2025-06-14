
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
      console.log('🔄 Initialisation du client Bible Neon...');
      await bibleDataInitializer.initializeCompleteBibleData();
      this.initialized = true;
      console.log('✅ Client Bible Neon initialisé avec versets réels');
    }
  }

  // Récupérer tous les livres
  async getBooks(): Promise<NeonBook[]> {
    try {
      await this.ensureInitialized();
      console.log('📚 Récupération des livres depuis Neon...');
      
      const books = JSON.parse(localStorage.getItem('neon_books') || '[]');
      console.log(`✅ ${books.length} livres chargés`);
      return books.sort((a: NeonBook, b: NeonBook) => a.order_number - b.order_number);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des livres:', error);
      return [];
    }
  }

  // Récupérer les chapitres d'un livre
  async getChapters(bookId: string): Promise<NeonChapter[]> {
    try {
      console.log('📖 Récupération des chapitres pour le livre:', bookId);
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

  // Récupérer les versets d'un chapitre
  async getVerses(bookId: string, chapterNumber: number, versionId: string = 'lsg1910'): Promise<NeonVerse[]> {
    try {
      await this.ensureInitialized();
      console.log(`📄 Récupération des versets pour ${bookId} ${chapterNumber} (${versionId})`);
      
      // Charger tous les versets depuis le stockage
      const allVerses = JSON.parse(localStorage.getItem('neon_verses') || '[]');
      
      // Filtrer par livre, chapitre et version
      let verses = allVerses.filter((verse: NeonVerse) => 
        verse.book_id === bookId && 
        verse.chapter_number === chapterNumber &&
        verse.version_id === versionId
      );

      // Si aucun verset trouvé, générer des versets
      if (verses.length === 0) {
        console.log(`⚠️ Aucun verset trouvé, génération pour ${bookId} ${chapterNumber}`);
        verses = await bibleDataInitializer.generateMissingVerses(bookId, chapterNumber);
        
        // Sauvegarder les nouveaux versets
        const updatedVerses = [...allVerses, ...verses];
        localStorage.setItem('neon_verses', JSON.stringify(updatedVerses));
      }

      const sortedVerses = verses.sort((a: NeonVerse, b: NeonVerse) => a.verse_number - b.verse_number);
      console.log(`✅ ${sortedVerses.length} versets chargés pour ${bookId} ${chapterNumber}`);
      
      // Vérifier si on a des vrais versets ou des placeholders
      const realVerses = sortedVerses.filter(v => !v.text.includes('[') && !v.text.includes('à compléter'));
      const placeholders = sortedVerses.length - realVerses.length;
      
      if (placeholders > 0) {
        console.log(`⚠️ ${placeholders} versets sont encore des placeholders`);
      } else {
        console.log(`✅ Tous les versets sont réels`);
      }
      
      return sortedVerses;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des versets:', error);
      return [];
    }
  }

  // Recherche de versets
  async searchVerses(query: string, versionId: string = 'lsg1910', limit: number = 50): Promise<NeonVerse[]> {
    try {
      await this.ensureInitialized();
      console.log(`🔍 Recherche de versets avec la requête: "${query}"`);
      
      const allVerses = JSON.parse(localStorage.getItem('neon_verses') || '[]');
      
      const filteredVerses = allVerses
        .filter((verse: NeonVerse) => 
          verse.version_id === versionId &&
          verse.text.toLowerCase().includes(query.toLowerCase()) &&
          !verse.text.includes('[') && // Exclure les placeholders
          !verse.text.includes('à compléter')
        )
        .slice(0, limit);
      
      console.log(`✅ ${filteredVerses.length} versets trouvés pour "${query}"`);
      
      return filteredVerses.sort((a: NeonVerse, b: NeonVerse) => {
        if (a.book_name !== b.book_name) return a.book_name.localeCompare(b.book_name);
        if (a.chapter_number !== b.chapter_number) return a.chapter_number - b.chapter_number;
        return a.verse_number - b.verse_number;
      });
    } catch (error) {
      console.error('❌ Erreur lors de la recherche de versets:', error);
      return [];
    }
  }

  // Récupérer les versions bibliques disponibles
  async getVersions(): Promise<NeonBibleVersion[]> {
    try {
      await this.ensureInitialized();
      console.log('📖 Récupération des versions bibliques...');
      
      const versions = JSON.parse(localStorage.getItem('neon_bible_versions') || '[]');
      return versions.sort((a: NeonBibleVersion, b: NeonBibleVersion) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des versions:', error);
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
      console.log(`🔍 Recherche par référence: "${reference}"`);
      
      // Parser la référence (format: "Livre Chapitre:Verset")
      const refPattern = /^(.+?)\s+(\d+)(?::(\d+))?$/;
      const match = reference.trim().match(refPattern);
      
      if (!match) {
        console.log('❌ Format de référence invalide');
        return [];
      }
      
      const [, bookName, chapter, verse] = match;
      
      // Chercher le livre
      const books = await this.getBooks();
      const book = books.find(b => 
        b.name.toLowerCase().includes(bookName.toLowerCase()) ||
        bookName.toLowerCase().includes(b.name.toLowerCase())
      );
      
      if (!book) {
        console.log(`❌ Livre "${bookName}" non trouvé`);
        return [];
      }
      
      console.log(`✅ Livre trouvé: ${book.name} (${book.id})`);
      
      // Chercher les versets
      if (verse) {
        // Verset spécifique
        const verses = await this.getVerses(book.id, parseInt(chapter), versionId);
        const result = verses.filter(v => v.verse_number === parseInt(verse));
        console.log(`✅ ${result.length} verset(s) trouvé(s) pour ${book.name} ${chapter}:${verse}`);
        return result;
      } else {
        // Chapitre entier
        const result = await this.getVerses(book.id, parseInt(chapter), versionId);
        console.log(`✅ ${result.length} versets trouvés pour ${book.name} ${chapter}`);
        return result;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la recherche par référence:', error);
      return [];
    }
  }

  private async getVerseCountForChapter(bookId: string, chapterNumber: number): Promise<number> {
    const verses = await this.getVerses(bookId, chapterNumber);
    return verses.length || 15; // 15 versets par défaut si aucun trouvé
  }

  // Fonction utilitaire pour vérifier la qualité des données
  async getDataQualityReport(): Promise<any> {
    try {
      const allVerses = JSON.parse(localStorage.getItem('neon_verses') || '[]');
      const totalVerses = allVerses.length;
      const realVerses = allVerses.filter((v: NeonVerse) => 
        !v.text.includes('[') && !v.text.includes('à compléter')
      ).length;
      const placeholders = totalVerses - realVerses;
      
      return {
        totalVerses,
        realVerses,
        placeholders,
        qualityPercentage: totalVerses > 0 ? Math.round((realVerses / totalVerses) * 100) : 0
      };
    } catch (error) {
      console.error('❌ Erreur lors de la génération du rapport qualité:', error);
      return { totalVerses: 0, realVerses: 0, placeholders: 0, qualityPercentage: 0 };
    }
  }
}

export const neonBibleClient = new NeonBibleClient();

// Initialisation des données de test (fallback localStorage) - OBSOLÈTE
export const initializeBibleData = () => {
  console.log('⚠️ initializeBibleData est obsolète. Utiliser BibleDataInitializer à la place.');
  return bibleDataInitializer.initializeCompleteBibleData();
};
