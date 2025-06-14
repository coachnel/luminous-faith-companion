
// Client API pour les données bibliques stockées dans Neon
import { neonClient } from './restClient';

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
  // Récupérer tous les livres
  async getBooks(): Promise<NeonBook[]> {
    try {
      console.log('Fetching books from Neon...');
      const books = await neonClient.select<NeonBook>('books');
      return books.sort((a, b) => a.order_number - b.order_number);
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  }

  // Récupérer les chapitres d'un livre
  async getChapters(bookId: string): Promise<NeonChapter[]> {
    try {
      console.log('Fetching chapters for book:', bookId);
      const chapters = await neonClient.select<NeonChapter>('chapters', { book_id: bookId });
      return chapters.sort((a, b) => a.chapter_number - b.chapter_number);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      return [];
    }
  }

  // Récupérer les versets d'un chapitre
  async getVerses(bookId: string, chapterNumber: number, versionId: string = 'lsg1910'): Promise<NeonVerse[]> {
    try {
      console.log('Fetching verses for book:', bookId, 'chapter:', chapterNumber, 'version:', versionId);
      const verses = await neonClient.select<NeonVerse>('verses', { 
        book_id: bookId, 
        chapter_number: chapterNumber,
        version_id: versionId
      });
      return verses.sort((a, b) => a.verse_number - b.verse_number);
    } catch (error) {
      console.error('Error fetching verses:', error);
      return [];
    }
  }

  // Recherche de versets
  async searchVerses(query: string, versionId: string = 'lsg1910', limit: number = 50): Promise<NeonVerse[]> {
    try {
      console.log('Searching verses with query:', query);
      // Pour le moment, utilisons une recherche simple via le client local
      const allVerses = await neonClient.select<NeonVerse>('verses', { version_id: versionId });
      
      const filteredVerses = allVerses
        .filter(verse => verse.text.toLowerCase().includes(query.toLowerCase()))
        .slice(0, limit);
      
      return filteredVerses.sort((a, b) => {
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
      console.log('Fetching bible versions...');
      const versions = await neonClient.select<NeonBibleVersion>('bible_versions');
      return versions.sort((a, b) => a.name.localeCompare(b.name));
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
        const verses = await neonClient.select<NeonVerse>('verses', {
          book_id: book.id,
          chapter_number: parseInt(chapter),
          verse_number: parseInt(verse),
          version_id: versionId
        });
        return verses;
      } else {
        // Chapitre entier
        return await this.getVerses(book.id, parseInt(chapter), versionId);
      }
    } catch (error) {
      console.error('Error searching by reference:', error);
      return [];
    }
  }
}

export const neonBibleClient = new NeonBibleClient();

// Initialisation des données de test (fallback localStorage)
export const initializeBibleData = () => {
  console.log('🗄️ Initialisation des données bibliques (mode développement)');
  
  // Créer des données de test si elles n'existent pas
  const testBooks: NeonBook[] = [
    { id: 'gen', name: 'Genèse', testament: 'old', chapters_count: 50, order_number: 1 },
    { id: 'exo', name: 'Exode', testament: 'old', chapters_count: 40, order_number: 2 },
    { id: 'mat', name: 'Matthieu', testament: 'new', chapters_count: 28, order_number: 40 },
    { id: 'joh', name: 'Jean', testament: 'new', chapters_count: 21, order_number: 43 }
  ];
  
  const testVerses: NeonVerse[] = [
    {
      id: 'gen-1-1',
      book_id: 'gen',
      book_name: 'Genèse',
      chapter_number: 1,
      verse_number: 1,
      text: 'Au commencement, Dieu créa les cieux et la terre.',
      version_id: 'lsg1910',
      version_name: 'Louis Segond (1910)'
    },
    {
      id: 'joh-3-16',
      book_id: 'joh',
      book_name: 'Jean',
      chapter_number: 3,
      verse_number: 16,
      text: 'Car Dieu a tant aimé le monde qu\'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu\'il ait la vie éternelle.',
      version_id: 'lsg1910',
      version_name: 'Louis Segond (1910)'
    }
  ];
  
  // Stocker les données de test
  localStorage.setItem('neon_books', JSON.stringify(testBooks));
  localStorage.setItem('neon_verses', JSON.stringify(testVerses));
  
  console.log('✅ Données bibliques de test initialisées');
};
