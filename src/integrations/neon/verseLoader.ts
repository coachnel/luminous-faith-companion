
// Système de chargement intelligent des versets bibliques
import { NeonVerse, NeonBook, NeonBibleVersion } from './bibleClient';

// Interface pour les données brutes du fichier JSON
interface RawBibleData {
  [bookKey: string]: {
    [chapterKey: string]: string[];
  }
}

// Interface pour le format Louis Segond
interface LouisSegondData {
  version: string;
  oldTestament: Array<{
    name: string;
    chapters: Array<{
      chapter: number;
      verses: Array<{
        book: string;
        chapter: number;
        verse: number;
        text: string;
      }>;
    }>;
  }>;
  newTestament: Array<{
    name: string;
    chapters: Array<{
      chapter: number;
      verses: Array<{
        book: string;
        chapter: number;
        verse: number;
        text: string;
      }>;
    }>;
  }>;
}

// Mapping des noms de livres pour la version française
const FRENCH_BOOK_NAMES: { [key: string]: string } = {
  'genesis': 'Genèse',
  'exodus': 'Exode',
  'leviticus': 'Lévitique',
  'numbers': 'Nombres',
  'deuteronomy': 'Deutéronome',
  'joshua': 'Josué',
  'judges': 'Juges',
  'ruth': 'Ruth',
  '1-samuel': '1 Samuel',
  '2-samuel': '2 Samuel',
  '1-kings': '1 Rois',
  '2-kings': '2 Rois',
  '1-chronicles': '1 Chroniques',
  '2-chronicles': '2 Chroniques',
  'ezra': 'Esdras',
  'nehemiah': 'Néhémie',
  'tobit': 'Tobie',
  'judith': 'Judith',
  'esther': 'Esther',
  'job': 'Job',
  'psalms': 'Psaumes',
  'proverbs': 'Proverbes',
  'ecclesiastes': 'Ecclésiaste',
  'song-of-songs': 'Cantique des Cantiques',
  'wisdom': 'Sagesse',
  'sirach': 'Siracide',
  'isaiah': 'Isaïe',
  'jeremiah': 'Jérémie',
  'lamentations': 'Lamentations',
  'baruch': 'Baruch',
  'ezekiel': 'Ézéchiel',
  'daniel': 'Daniel',
  'hosea': 'Osée',
  'joel': 'Joël',
  'amos': 'Amos',
  'obadiah': 'Abdias',
  'jonah': 'Jonas',
  'micah': 'Michée',
  'nahum': 'Nahum',
  'habakkuk': 'Habacuc',
  'zephaniah': 'Sophonie',
  'haggai': 'Aggée',
  'zechariah': 'Zacharie',
  'malachi': 'Malachie',
  '1-maccabees': '1 Maccabées',
  '2-maccabees': '2 Maccabées',
  'matthew': 'Matthieu',
  'mark': 'Marc',
  'luke': 'Luc',
  'john': 'Jean',
  'acts': 'Actes',
  'romans': 'Romains',
  '1-corinthians': '1 Corinthiens',
  '2-corinthians': '2 Corinthiens',
  'galatians': 'Galates',
  'ephesians': 'Éphésiens',
  'philippians': 'Philippiens',
  'colossians': 'Colossiens',
  '1-thessalonians': '1 Thessaloniciens',
  '2-thessalonians': '2 Thessaloniciens',
  '1-timothy': '1 Timothée',
  '2-timothy': '2 Timothée',
  'titus': 'Tite',
  'philemon': 'Philémon',
  'hebrews': 'Hébreux',
  'james': 'Jacques',
  '1-peter': '1 Pierre',
  '2-peter': '2 Pierre',
  '1-john': '1 Jean',
  '2-john': '2 Jean',
  '3-john': '3 Jean',
  'jude': 'Jude',
  'revelation': 'Apocalypse'
};

// Générateur d'IDs de livres standard
const generateBookId = (bookName: string): string => {
  const normalized = bookName.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Mappings spéciaux pour correspondre aux standards
  const mappings: { [key: string]: string } = {
    'genese': 'gen',
    'exode': 'exo',
    'levitique': 'lev',
    'nombres': 'num',
    'deuteronome': 'deu',
    'josue': 'jos',
    'juges': 'jdg',
    'ruth': 'rut',
    '1-samuel': '1sa',
    '2-samuel': '2sa',
    '1-rois': '1ki',
    '2-rois': '2ki',
    '1-chroniques': '1ch',
    '2-chroniques': '2ch',
    'esdras': 'ezr',
    'nehemie': 'neh',
    'tobie': 'tob',
    'judith': 'jdt',
    'esther': 'est',
    'job': 'job',
    'psaumes': 'psa',
    'proverbes': 'pro',
    'ecclesiaste': 'ecc',
    'cantique-des-cantiques': 'sng',
    'sagesse': 'wis',
    'siracide': 'sir',
    'isaie': 'isa',
    'jeremie': 'jer',
    'lamentations': 'lam',
    'baruch': 'bar',
    'ezechiel': 'eze',
    'daniel': 'dan',
    'osee': 'hos',
    'joel': 'joe',
    'amos': 'amo',
    'abdias': 'oba',
    'jonas': 'jon',
    'michee': 'mic',
    'nahum': 'nah',
    'habacuc': 'hab',
    'sophonie': 'zep',
    'aggee': 'hag',
    'zacharie': 'zec',
    'malachie': 'mal',
    '1-maccabees': '1ma',
    '2-maccabees': '2ma',
    'matthieu': 'mat',
    'marc': 'mar',
    'luc': 'luk',
    'jean': 'joh',
    'actes': 'act',
    'romains': 'rom',
    '1-corinthiens': '1co',
    '2-corinthiens': '2co',
    'galates': 'gal',
    'ephesiens': 'eph',
    'philippiens': 'phi',
    'colossiens': 'col',
    '1-thessaloniciens': '1th',
    '2-thessaloniciens': '2th',
    '1-timothee': '1ti',
    '2-timothee': '2ti',
    'tite': 'tit',
    'philemon': 'phm',
    'hebreux': 'heb',
    'jacques': 'jas',
    '1-pierre': '1pe',
    '2-pierre': '2pe',
    '1-jean': '1jo',
    '2-jean': '2jo',
    '3-jean': '3jo',
    'jude': 'jud',
    'apocalypse': 'rev'
  };
  
  return mappings[normalized] || normalized;
};

export class VerseLoader {
  private static instance: VerseLoader;
  private loadedVerses: NeonVerse[] = [];
  private loadedBooks: NeonBook[] = [];
  private isLoaded = false;

  public static getInstance(): VerseLoader {
    if (!VerseLoader.instance) {
      VerseLoader.instance = new VerseLoader();
    }
    return VerseLoader.instance;
  }

  async loadAllBibleData(): Promise<void> {
    if (this.isLoaded) return;

    console.log('🔄 Chargement complet de la Bible depuis les fichiers JSON...');
    
    try {
      // Essayer d'abord le fichier Louis Segond qui est plus structuré
      const bibleData = await this.loadLouisSegondData();
      
      if (bibleData && this.processLouisSegondData(bibleData)) {
        console.log('✅ Données chargées depuis louis-segond.json');
      } else {
        console.log('⚠️ Fichier louis-segond.json non trouvé, utilisation du fallback');
        this.createFallbackData();
      }
      
      // Sauvegarder dans le localStorage pour un accès rapide
      this.saveToLocalStorage();
      
      this.isLoaded = true;
      
      const quality = this.getDataQuality();
      console.log(`✅ Bible complète chargée: ${this.loadedBooks.length} livres, ${this.loadedVerses.length} versets (${quality.percentage}% réels)`);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      this.createFallbackData();
      this.isLoaded = true;
    }
  }

  private async loadLouisSegondData(): Promise<LouisSegondData | null> {
    try {
      const response = await fetch('/src/data/louis-segond.json');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Fichier louis-segond.json chargé avec succès');
        return data;
      }
    } catch (error) {
      console.log('⚠️ louis-segond.json non accessible:', error);
    }
    return null;
  }

  private processLouisSegondData(data: LouisSegondData): boolean {
    try {
      const books: NeonBook[] = [];
      const verses: NeonVerse[] = [];
      let orderNumber = 1;

      // Traiter l'Ancien Testament
      if (data.oldTestament && Array.isArray(data.oldTestament)) {
        data.oldTestament.forEach(bookData => {
          const bookId = generateBookId(bookData.name);
          const maxChapter = Math.max(...bookData.chapters.map(ch => ch.chapter));
          
          const book: NeonBook = {
            id: bookId,
            name: bookData.name,
            testament: 'old',
            chapters_count: maxChapter,
            order_number: orderNumber++
          };
          books.push(book);

          // Traiter les chapitres et versets
          bookData.chapters.forEach(chapterData => {
            chapterData.verses.forEach(verseData => {
              verses.push({
                id: `${bookId}-${verseData.chapter}-${verseData.verse}`,
                book_id: bookId,
                book_name: bookData.name,
                chapter_number: verseData.chapter,
                verse_number: verseData.verse,
                text: verseData.text.trim(),
                version_id: 'lsg1910',
                version_name: 'Louis Segond (1910)'
              });
            });
          });
        });
      }

      // Traiter le Nouveau Testament
      if (data.newTestament && Array.isArray(data.newTestament)) {
        data.newTestament.forEach(bookData => {
          const bookId = generateBookId(bookData.name);
          const maxChapter = Math.max(...bookData.chapters.map(ch => ch.chapter));
          
          const book: NeonBook = {
            id: bookId,
            name: bookData.name,
            testament: 'new',
            chapters_count: maxChapter,
            order_number: orderNumber++
          };
          books.push(book);

          // Traiter les chapitres et versets
          bookData.chapters.forEach(chapterData => {
            chapterData.verses.forEach(verseData => {
              verses.push({
                id: `${bookId}-${verseData.chapter}-${verseData.verse}`,
                book_id: bookId,
                book_name: bookData.name,
                chapter_number: verseData.chapter,
                verse_number: verseData.verse,
                text: verseData.text.trim(),
                version_id: 'lsg1910',
                version_name: 'Louis Segond (1910)'
              });
            });
          });
        });
      }

      // Compléter avec des livres manquants si nécessaire
      this.addMissingCatholicBooks(books, verses);

      this.loadedBooks = books;
      this.loadedVerses = verses;

      console.log(`✅ Traitement terminé: ${books.length} livres, ${verses.length} versets authentiques`);
      return true;

    } catch (error) {
      console.error('❌ Erreur lors du traitement des données Louis Segond:', error);
      return false;
    }
  }

  private addMissingCatholicBooks(books: NeonBook[], verses: NeonVerse[]): void {
    // Liste complète des 73 livres catholiques
    const catholicBooks = [
      // Ancien Testament (46 livres)
      { id: 'gen', name: 'Genèse', chapters: 50, testament: 'old' },
      { id: 'exo', name: 'Exode', chapters: 40, testament: 'old' },
      { id: 'lev', name: 'Lévitique', chapters: 27, testament: 'old' },
      { id: 'num', name: 'Nombres', chapters: 36, testament: 'old' },
      { id: 'deu', name: 'Deutéronome', chapters: 34, testament: 'old' },
      { id: 'jos', name: 'Josué', chapters: 24, testament: 'old' },
      { id: 'jdg', name: 'Juges', chapters: 21, testament: 'old' },
      { id: 'rut', name: 'Ruth', chapters: 4, testament: 'old' },
      { id: '1sa', name: '1 Samuel', chapters: 31, testament: 'old' },
      { id: '2sa', name: '2 Samuel', chapters: 24, testament: 'old' },
      { id: '1ki', name: '1 Rois', chapters: 22, testament: 'old' },
      { id: '2ki', name: '2 Rois', chapters: 25, testament: 'old' },
      { id: '1ch', name: '1 Chroniques', chapters: 29, testament: 'old' },
      { id: '2ch', name: '2 Chroniques', chapters: 36, testament: 'old' },
      { id: 'ezr', name: 'Esdras', chapters: 10, testament: 'old' },
      { id: 'neh', name: 'Néhémie', chapters: 13, testament: 'old' },
      { id: 'tob', name: 'Tobie', chapters: 14, testament: 'old' },
      { id: 'jdt', name: 'Judith', chapters: 16, testament: 'old' },
      { id: 'est', name: 'Esther', chapters: 10, testament: 'old' },
      { id: 'job', name: 'Job', chapters: 42, testament: 'old' },
      { id: 'psa', name: 'Psaumes', chapters: 150, testament: 'old' },
      { id: 'pro', name: 'Proverbes', chapters: 31, testament: 'old' },
      { id: 'ecc', name: 'Ecclésiaste', chapters: 12, testament: 'old' },
      { id: 'sng', name: 'Cantique des Cantiques', chapters: 8, testament: 'old' },
      { id: 'wis', name: 'Sagesse', chapters: 19, testament: 'old' },
      { id: 'sir', name: 'Siracide', chapters: 51, testament: 'old' },
      { id: 'isa', name: 'Isaïe', chapters: 66, testament: 'old' },
      { id: 'jer', name: 'Jérémie', chapters: 52, testament: 'old' },
      { id: 'lam', name: 'Lamentations', chapters: 5, testament: 'old' },
      { id: 'bar', name: 'Baruch', chapters: 6, testament: 'old' },
      { id: 'eze', name: 'Ézéchiel', chapters: 48, testament: 'old' },
      { id: 'dan', name: 'Daniel', chapters: 14, testament: 'old' },
      { id: 'hos', name: 'Osée', chapters: 14, testament: 'old' },
      { id: 'joe', name: 'Joël', chapters: 3, testament: 'old' },
      { id: 'amo', name: 'Amos', chapters: 9, testament: 'old' },
      { id: 'oba', name: 'Abdias', chapters: 1, testament: 'old' },
      { id: 'jon', name: 'Jonas', chapters: 4, testament: 'old' },
      { id: 'mic', name: 'Michée', chapters: 7, testament: 'old' },
      { id: 'nah', name: 'Nahum', chapters: 3, testament: 'old' },
      { id: 'hab', name: 'Habacuc', chapters: 3, testament: 'old' },
      { id: 'zep', name: 'Sophonie', chapters: 3, testament: 'old' },
      { id: 'hag', name: 'Aggée', chapters: 2, testament: 'old' },
      { id: 'zec', name: 'Zacharie', chapters: 14, testament: 'old' },
      { id: 'mal', name: 'Malachie', chapters: 4, testament: 'old' },
      { id: '1ma', name: '1 Maccabées', chapters: 16, testament: 'old' },
      { id: '2ma', name: '2 Maccabées', chapters: 15, testament: 'old' },
      // Nouveau Testament (27 livres)
      { id: 'mat', name: 'Matthieu', chapters: 28, testament: 'new' },
      { id: 'mar', name: 'Marc', chapters: 16, testament: 'new' },
      { id: 'luk', name: 'Luc', chapters: 24, testament: 'new' },
      { id: 'joh', name: 'Jean', chapters: 21, testament: 'new' },
      { id: 'act', name: 'Actes', chapters: 28, testament: 'new' },
      { id: 'rom', name: 'Romains', chapters: 16, testament: 'new' },
      { id: '1co', name: '1 Corinthiens', chapters: 16, testament: 'new' },
      { id: '2co', name: '2 Corinthiens', chapters: 13, testament: 'new' },
      { id: 'gal', name: 'Galates', chapters: 6, testament: 'new' },
      { id: 'eph', name: 'Éphésiens', chapters: 6, testament: 'new' },
      { id: 'phi', name: 'Philippiens', chapters: 4, testament: 'new' },
      { id: 'col', name: 'Colossiens', chapters: 4, testament: 'new' },
      { id: '1th', name: '1 Thessaloniciens', chapters: 5, testament: 'new' },
      { id: '2th', name: '2 Thessaloniciens', chapters: 3, testament: 'new' },
      { id: '1ti', name: '1 Timothée', chapters: 6, testament: 'new' },
      { id: '2ti', name: '2 Timothée', chapters: 4, testament: 'new' },
      { id: 'tit', name: 'Tite', chapters: 3, testament: 'new' },
      { id: 'phm', name: 'Philémon', chapters: 1, testament: 'new' },
      { id: 'heb', name: 'Hébreux', chapters: 13, testament: 'new' },
      { id: 'jas', name: 'Jacques', chapters: 5, testament: 'new' },
      { id: '1pe', name: '1 Pierre', chapters: 5, testament: 'new' },
      { id: '2pe', name: '2 Pierre', chapters: 3, testament: 'new' },
      { id: '1jo', name: '1 Jean', chapters: 5, testament: 'new' },
      { id: '2jo', name: '2 Jean', chapters: 1, testament: 'new' },
      { id: '3jo', name: '3 Jean', chapters: 1, testament: 'new' },
      { id: 'jud', name: 'Jude', chapters: 1, testament: 'new' },
      { id: 'rev', name: 'Apocalypse', chapters: 22, testament: 'new' }
    ];

    // Ajouter les livres manquants avec des placeholders minimal
    catholicBooks.forEach((catholicBook, index) => {
      const existingBook = books.find(b => b.id === catholicBook.id);
      if (!existingBook) {
        console.log(`📖 Ajout du livre manquant: ${catholicBook.name}`);
        
        const book: NeonBook = {
          id: catholicBook.id,
          name: catholicBook.name,
          testament: catholicBook.testament as 'old' | 'new',
          chapters_count: catholicBook.chapters,
          order_number: books.length + 1
        };
        books.push(book);

        // Ajouter seulement quelques versets de base pour que le livre soit navigable
        for (let chapter = 1; chapter <= Math.min(catholicBook.chapters, 3); chapter++) {
          verses.push({
            id: `${catholicBook.id}-${chapter}-1`,
            book_id: catholicBook.id,
            book_name: catholicBook.name,
            chapter_number: chapter,
            verse_number: 1,
            text: `Texte à compléter - ${catholicBook.name} ${chapter}:1`,
            version_id: 'lsg1910',
            version_name: 'Louis Segond (1910)'
          });
        }
      }
    });

    // Réordonner selon l'ordre biblique
    books.sort((a, b) => {
      const aIndex = catholicBooks.findIndex(cb => cb.id === a.id);
      const bIndex = catholicBooks.findIndex(cb => cb.id === b.id);
      return aIndex - bIndex;
    });

    // Réassigner les numéros d'ordre
    books.forEach((book, index) => {
      book.order_number = index + 1;
    });
  }

  private createFallbackData(): void {
    console.log('🔄 Création des données de fallback minimales...');
    
    // Créer uniquement les livres avec très peu de versets pour éviter la surcharge
    const essentialBooks = [
      { id: 'gen', name: 'Genèse', chapters: 50, testament: 'old' },
      { id: 'psa', name: 'Psaumes', chapters: 150, testament: 'old' },
      { id: 'mat', name: 'Matthieu', chapters: 28, testament: 'new' },
      { id: 'joh', name: 'Jean', chapters: 21, testament: 'new' }
    ];

    const books: NeonBook[] = [];
    const verses: NeonVerse[] = [];

    essentialBooks.forEach((bookData, index) => {
      const book: NeonBook = {
        id: bookData.id,
        name: bookData.name,
        testament: bookData.testament as 'old' | 'new',
        chapters_count: bookData.chapters,
        order_number: index + 1
      };
      books.push(book);

      // Créer seulement le premier verset de chaque chapitre
      for (let chapter = 1; chapter <= Math.min(bookData.chapters, 5); chapter++) {
        verses.push({
          id: `${bookData.id}-${chapter}-1`,
          book_id: bookData.id,
          book_name: bookData.name,
          chapter_number: chapter,
          verse_number: 1,
          text: `Contenu biblique à charger pour ${bookData.name} ${chapter}:1`,
          version_id: 'lsg1910',
          version_name: 'Louis Segond (1910)'
        });
      }
    });

    this.loadedBooks = books;
    this.loadedVerses = verses;
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('bible_books', JSON.stringify(this.loadedBooks));
      localStorage.setItem('bible_verses_metadata', JSON.stringify({
        total: this.loadedVerses.length,
        lastUpdate: new Date().toISOString(),
        version: 'lsg1910'
      }));
      console.log('✅ Données sauvegardées dans le localStorage');
    } catch (error) {
      console.warn('⚠️ Erreur lors de la sauvegarde localStorage:', error);
    }
  }

  // Méthodes publiques pour accéder aux données
  getBooks(): NeonBook[] {
    return this.loadedBooks;
  }

  getVerses(bookId: string, chapter: number): NeonVerse[] {
    return this.loadedVerses.filter(v => 
      v.book_id === bookId && v.chapter_number === chapter
    );
  }

  searchVerses(query: string, limit: number = 50): NeonVerse[] {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return [];

    return this.loadedVerses
      .filter(v => v.text.toLowerCase().includes(searchTerm))
      .slice(0, limit);
  }

  getDataQuality(): { total: number; real: number; percentage: number } {
    const total = this.loadedVerses.length;
    const real = this.loadedVerses.filter(v => 
      !v.text.includes('Texte à compléter') && 
      !v.text.includes('Contenu biblique à charger') &&
      v.text.length > 20
    ).length;
    
    return {
      total,
      real,
      percentage: total > 0 ? Math.round((real / total) * 100) : 0
    };
  }

  async forceReload(): Promise<void> {
    console.log('🔄 Rechargement forcé des données bibliques...');
    
    // Vider le cache
    localStorage.removeItem('bible_books');
    localStorage.removeItem('bible_verses_metadata');
    
    this.loadedBooks = [];
    this.loadedVerses = [];
    this.isLoaded = false;
    
    // Recharger
    await this.loadAllBibleData();
  }
}

export const verseLoader = VerseLoader.getInstance();
