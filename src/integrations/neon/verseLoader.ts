
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

// Liste canonique des 73 livres catholiques avec IDs standardisés
const CANONICAL_CATHOLIC_BOOKS = [
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

// Mapping des noms de livres pour la correspondance
const BOOK_NAME_MAPPINGS: { [key: string]: string } = {
  'genèse': 'gen', 'genesis': 'gen',
  'exode': 'exo', 'exodus': 'exo',
  'lévitique': 'lev', 'leviticus': 'lev',
  'nombres': 'num', 'numbers': 'num',
  'deutéronome': 'deu', 'deuteronomy': 'deu',
  'josué': 'jos', 'joshua': 'jos',
  'juges': 'jdg', 'judges': 'jdg',
  'ruth': 'rut', 'ruth': 'rut',
  '1 samuel': '1sa', '1samuel': '1sa',
  '2 samuel': '2sa', '2samuel': '2sa',
  '1 rois': '1ki', '1kings': '1ki',
  '2 rois': '2ki', '2kings': '2ki',
  '1 chroniques': '1ch', '1chronicles': '1ch',
  '2 chroniques': '2ch', '2chronicles': '2ch',
  'esdras': 'ezr', 'ezra': 'ezr',
  'néhémie': 'neh', 'nehemiah': 'neh',
  'esther': 'est', 'esther': 'est',
  'job': 'job', 'job': 'job',
  'psaumes': 'psa', 'psalms': 'psa',
  'proverbes': 'pro', 'proverbs': 'pro',
  'ecclésiaste': 'ecc', 'ecclesiastes': 'ecc',
  'cantique des cantiques': 'sng', 'song of solomon': 'sng',
  'isaïe': 'isa', 'isaiah': 'isa',
  'jérémie': 'jer', 'jeremiah': 'jer',
  'lamentations': 'lam', 'lamentations': 'lam',
  'ézéchiel': 'eze', 'ezekiel': 'eze',
  'daniel': 'dan', 'daniel': 'dan',
  'osée': 'hos', 'hosea': 'hos',
  'joël': 'joe', 'joel': 'joe',
  'amos': 'amo', 'amos': 'amo',
  'abdias': 'oba', 'obadiah': 'oba',
  'jonas': 'jon', 'jonah': 'jon',
  'michée': 'mic', 'micah': 'mic',
  'nahum': 'nah', 'nahum': 'nah',
  'habacuc': 'hab', 'habakkuk': 'hab',
  'sophonie': 'zep', 'zephaniah': 'zep',
  'aggée': 'hag', 'haggai': 'hag',
  'zacharie': 'zec', 'zechariah': 'zec',
  'malachie': 'mal', 'malachi': 'mal',
  'matthieu': 'mat', 'matthew': 'mat',
  'marc': 'mar', 'mark': 'mar',
  'luc': 'luk', 'luke': 'luk',
  'jean': 'joh', 'john': 'joh',
  'actes': 'act', 'acts': 'act',
  'romains': 'rom', 'romans': 'rom',
  '1 corinthiens': '1co', '1corinthians': '1co',
  '2 corinthiens': '2co', '2corinthians': '2co',
  'galates': 'gal', 'galatians': 'gal',
  'éphésiens': 'eph', 'ephesians': 'eph',
  'philippiens': 'phi', 'philippians': 'phi',
  'colossiens': 'col', 'colossians': 'col',
  '1 thessaloniciens': '1th', '1thessalonians': '1th',
  '2 thessaloniciens': '2th', '2thessalonians': '2th',
  '1 timothée': '1ti', '1timothy': '1ti',
  '2 timothée': '2ti', '2timothy': '2ti',
  'tite': 'tit', 'titus': 'tit',
  'philémon': 'phm', 'philemon': 'phm',
  'hébreux': 'heb', 'hebrews': 'heb',
  'jacques': 'jas', 'james': 'jas',
  '1 pierre': '1pe', '1peter': '1pe',
  '2 pierre': '2pe', '2peter': '2pe',
  '1 jean': '1jo', '1john': '1jo',
  '2 jean': '2jo', '2john': '2jo',
  '3 jean': '3jo', '3john': '3jo',
  'jude': 'jud', 'jude': 'jud',
  'apocalypse': 'rev', 'revelation': 'rev'
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

    console.log('🔄 Chargement complet de la Bible (73 livres canoniques)...');
    
    try {
      // Initialiser avec les 73 livres canoniques exacts
      this.initializeCanonicalBooks();
      
      // Charger les versets réels depuis les sources disponibles
      await this.loadVersesFromSources();
      
      // Sauvegarder dans le localStorage
      this.saveToLocalStorage();
      
      this.isLoaded = true;
      
      const quality = this.getDataQuality();
      const oldTestament = this.loadedBooks.filter(b => b.testament === 'old').length;
      const newTestament = this.loadedBooks.filter(b => b.testament === 'new').length;
      
      console.log(`✅ Bible complète chargée: ${this.loadedBooks.length} livres (${oldTestament} AT + ${newTestament} NT)`);
      console.log(`📊 Qualité: ${quality.real}/${quality.total} versets réels (${quality.percentage}%)`);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      this.createMinimalFallback();
      this.isLoaded = true;
    }
  }

  private initializeCanonicalBooks(): void {
    console.log('📚 Initialisation des 73 livres canoniques...');
    
    this.loadedBooks = CANONICAL_CATHOLIC_BOOKS.map((book, index) => ({
      id: book.id,
      name: book.name,
      testament: book.testament as 'old' | 'new',
      chapters_count: book.chapters,
      order_number: index + 1
    }));
    
    console.log(`✅ ${this.loadedBooks.length} livres initialisés (${this.loadedBooks.filter(b => b.testament === 'old').length} AT + ${this.loadedBooks.filter(b => b.testament === 'new').length} NT)`);
  }

  private async loadVersesFromSources(): Promise<void> {
    console.log('📖 Chargement des versets depuis les sources disponibles...');
    
    const verses: NeonVerse[] = [];
    
    // Essayer de charger depuis louis-segond.json
    const louisSegondData = await this.tryLoadLouisSegond();
    if (louisSegondData) {
      console.log('✅ Traitement des données Louis Segond...');
      this.processLouisSegondData(louisSegondData, verses);
    }
    
    // Essayer de charger depuis fr_apee.json
    await this.tryLoadFromJSON('fr_apee', verses);
    
    this.loadedVerses = verses;
    console.log(`📊 Total des versets chargés: ${verses.length}`);
    
    // Ne pas ajouter de versets minimaux si nous avons déjà du contenu réel
    if (verses.length === 0) {
      console.log('⚠️ Aucun verset chargé, ajout de versets minimaux...');
      this.addMinimalVerses(verses);
    }
  }

  private async tryLoadLouisSegond(): Promise<LouisSegondData | null> {
    try {
      const response = await fetch('/src/data/louis-segond.json');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Louis Segond chargé avec succès');
        return data;
      }
    } catch (error) {
      console.log('⚠️ louis-segond.json non accessible:', error);
    }
    return null;
  }

  private async tryLoadFromJSON(filename: string, verses: NeonVerse[]): Promise<void> {
    try {
      const response = await fetch(`/src/data/json/${filename}.json`);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Chargement depuis ${filename}.json...`);
        this.processJSONData(data, verses, filename);
      }
    } catch (error) {
      console.log(`⚠️ ${filename}.json non accessible:`, error);
    }
  }

  private processLouisSegondData(data: LouisSegondData, verses: NeonVerse[]): void {
    try {
      let versesAdded = 0;
      
      // Traiter l'Ancien Testament
      if (data.oldTestament && Array.isArray(data.oldTestament)) {
        data.oldTestament.forEach(bookData => {
          const bookId = this.findBookId(bookData.name);
          if (bookId && bookData.chapters && Array.isArray(bookData.chapters)) {
            bookData.chapters.forEach(chapterData => {
              if (chapterData.verses && Array.isArray(chapterData.verses)) {
                chapterData.verses.forEach(verseData => {
                  if (verseData.text && typeof verseData.text === 'string' && verseData.text.trim().length > 10) {
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
                    versesAdded++;
                  }
                });
              }
            });
          }
        });
      }

      // Traiter le Nouveau Testament
      if (data.newTestament && Array.isArray(data.newTestament)) {
        data.newTestament.forEach(bookData => {
          const bookId = this.findBookId(bookData.name);
          if (bookId && bookData.chapters && Array.isArray(bookData.chapters)) {
            bookData.chapters.forEach(chapterData => {
              if (chapterData.verses && Array.isArray(chapterData.verses)) {
                chapterData.verses.forEach(verseData => {
                  if (verseData.text && typeof verseData.text === 'string' && verseData.text.trim().length > 10) {
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
                    versesAdded++;
                  }
                });
              }
            });
          }
        });
      }
      
      console.log(`✅ ${versesAdded} versets Louis Segond ajoutés`);
    } catch (error) {
      console.error('❌ Erreur lors du traitement des données Louis Segond:', error);
    }
  }

  private processJSONData(data: any, verses: NeonVerse[], version: string): void {
    try {
      let versesAdded = 0;
      
      if (data && typeof data === 'object') {
        Object.keys(data).forEach(bookKey => {
          const bookId = this.findBookId(bookKey);
          if (bookId) {
            const book = this.loadedBooks.find(b => b.id === bookId);
            if (book && data[bookKey] && typeof data[bookKey] === 'object') {
              Object.keys(data[bookKey]).forEach(chapterKey => {
                const chapterNum = parseInt(chapterKey);
                if (!isNaN(chapterNum) && data[bookKey][chapterKey] && Array.isArray(data[bookKey][chapterKey])) {
                  data[bookKey][chapterKey].forEach((verseText: any, index: number) => {
                    // Vérification robuste du type de verset
                    if (verseText && typeof verseText === 'string' && verseText.trim().length > 10) {
                      const verseId = `${bookId}-${chapterNum}-${index + 1}`;
                      // Éviter les doublons
                      if (!verses.find(v => v.id === verseId)) {
                        verses.push({
                          id: verseId,
                          book_id: bookId,
                          book_name: book.name,
                          chapter_number: chapterNum,
                          verse_number: index + 1,
                          text: verseText.trim(),
                          version_id: version,
                          version_name: version === 'fr_apee' ? 'Bible Française APEE' : version
                        });
                        versesAdded++;
                      }
                    }
                  });
                }
              });
            }
          }
        });
      }
      
      console.log(`✅ ${versesAdded} versets ${version} ajoutés`);
    } catch (error) {
      console.error(`❌ Erreur lors du traitement de ${version}:`, error);
    }
  }

  private findBookId(bookName: string): string | null {
    if (!bookName || typeof bookName !== 'string') return null;
    
    const normalized = bookName.toLowerCase().trim();
    
    // Recherche directe dans le mapping
    if (BOOK_NAME_MAPPINGS[normalized]) {
      return BOOK_NAME_MAPPINGS[normalized];
    }
    
    // Recherche dans les livres canoniques
    const book = CANONICAL_CATHOLIC_BOOKS.find(b => 
      b.name.toLowerCase() === normalized || 
      normalized.includes(b.name.toLowerCase()) ||
      b.name.toLowerCase().includes(normalized)
    );
    
    return book ? book.id : null;
  }

  private addMinimalVerses(verses: NeonVerse[]): void {
    // Ajouter au moins un verset par livre pour la navigation
    this.loadedBooks.forEach(book => {
      const hasVerses = verses.some(v => v.book_id === book.id);
      if (!hasVerses) {
        verses.push({
          id: `${book.id}-1-1`,
          book_id: book.id,
          book_name: book.name,
          chapter_number: 1,
          verse_number: 1,
          text: `[Verset à charger] ${book.name} 1:1 - Contenu en cours d'importation depuis les sources authentiques.`,
          version_id: 'lsg1910',
          version_name: 'Louis Segond (1910)'
        });
      }
    });
  }

  private createMinimalFallback(): void {
    console.log('🔄 Création du fallback minimal...');
    
    this.initializeCanonicalBooks();
    
    const verses: NeonVerse[] = [];
    this.addMinimalVerses(verses);
    
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

  // Méthodes publiques
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
      !v.text.includes('[Verset à charger]') && 
      !v.text.includes('Contenu en cours') &&
      !v.text.includes('Texte à compléter') &&
      v.text.length > 15 &&
      !v.text.startsWith('Verset') &&
      !v.text.startsWith('Chapitre')
    ).length;
    
    return {
      total,
      real,
      percentage: total > 0 ? Math.round((real / total) * 100) : 0
    };
  }

  async forceReload(): Promise<void> {
    console.log('🔄 Rechargement forcé des données bibliques...');
    
    localStorage.removeItem('bible_books');
    localStorage.removeItem('bible_verses_metadata');
    
    this.loadedBooks = [];
    this.loadedVerses = [];
    this.isLoaded = false;
    
    await this.loadAllBibleData();
  }
}

export const verseLoader = VerseLoader.getInstance();
