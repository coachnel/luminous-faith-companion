
// Chargeur de données bibliques réelles depuis les fichiers JSON
import frApeeData from '@/data/json/fr_apee.json';
import { NeonVerse, NeonBook, NeonBibleVersion } from './bibleClient';

// Interface pour les données JSON fr_apee
interface FrApeeEntry {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

// Mapping des noms de livres JSON vers nos IDs
const BOOK_NAME_TO_ID: { [key: string]: string } = {
  'Genesis': 'gen',
  'Exodus': 'exo',
  'Leviticus': 'lev',
  'Numbers': 'num',
  'Deuteronomy': 'deu',
  'Joshua': 'jos',
  'Judges': 'jdg',
  'Ruth': 'rut',
  '1 Samuel': '1sa',
  '2 Samuel': '2sa',
  '1 Kings': '1ki',
  '2 Kings': '2ki',
  '1 Chronicles': '1ch',
  '2 Chronicles': '2ch',
  'Ezra': 'ezr',
  'Nehemiah': 'neh',
  'Tobit': 'tob',
  'Judith': 'jdt',
  'Esther': 'est',
  'Job': 'job',
  'Psalms': 'psa',
  'Proverbs': 'pro',
  'Ecclesiastes': 'ecc',
  'Song of Solomon': 'sng',
  'Wisdom': 'wis',
  'Sirach': 'sir',
  'Isaiah': 'isa',
  'Jeremiah': 'jer',
  'Lamentations': 'lam',
  'Baruch': 'bar',
  'Ezekiel': 'eze',
  'Daniel': 'dan',
  'Hosea': 'hos',
  'Joel': 'joe',
  'Amos': 'amo',
  'Obadiah': 'oba',
  'Jonah': 'jon',
  'Micah': 'mic',
  'Nahum': 'nah',
  'Habakkuk': 'hab',
  'Zephaniah': 'zep',
  'Haggai': 'hag',
  'Zechariah': 'zec',
  'Malachi': 'mal',
  '1 Maccabees': '1ma',
  '2 Maccabees': '2ma',
  'Matthew': 'mat',
  'Mark': 'mar',
  'Luke': 'luk',
  'John': 'joh',
  'Acts': 'act',
  'Romans': 'rom',
  '1 Corinthians': '1co',
  '2 Corinthians': '2co',
  'Galatians': 'gal',
  'Ephesians': 'eph',
  'Philippians': 'phi',
  'Colossians': 'col',
  '1 Thessalonians': '1th',
  '2 Thessalonians': '2th',
  '1 Timothy': '1ti',
  '2 Timothy': '2ti',
  'Titus': 'tit',
  'Philemon': 'phm',
  'Hebrews': 'heb',
  'James': 'jas',
  '1 Peter': '1pe',
  '2 Peter': '2pe',
  '1 John': '1jo',
  '2 John': '2jo',
  '3 John': '3jo',
  'Jude': 'jud',
  'Revelation': 'rev'
};

// Mapping inverse pour récupérer le nom français
const ID_TO_FRENCH_NAME: { [key: string]: string } = {
  'gen': 'Genèse',
  'exo': 'Exode',
  'lev': 'Lévitique',
  'num': 'Nombres',
  'deu': 'Deutéronome',
  'jos': 'Josué',
  'jdg': 'Juges',
  'rut': 'Ruth',
  '1sa': '1 Samuel',
  '2sa': '2 Samuel',
  '1ki': '1 Rois',
  '2ki': '2 Rois',
  '1ch': '1 Chroniques',
  '2ch': '2 Chroniques',
  'ezr': 'Esdras',
  'neh': 'Néhémie',
  'tob': 'Tobie',
  'jdt': 'Judith',
  'est': 'Esther',
  'job': 'Job',
  'psa': 'Psaumes',
  'pro': 'Proverbes',
  'ecc': 'Ecclésiaste',
  'sng': 'Cantique des Cantiques',
  'wis': 'Sagesse',
  'sir': 'Siracide',
  'isa': 'Isaïe',
  'jer': 'Jérémie',
  'lam': 'Lamentations',
  'bar': 'Baruch',
  'eze': 'Ézéchiel',
  'dan': 'Daniel',
  'hos': 'Osée',
  'joe': 'Joël',
  'amo': 'Amos',
  'oba': 'Abdias',
  'jon': 'Jonas',
  'mic': 'Michée',
  'nah': 'Nahum',
  'hab': 'Habacuc',
  'zep': 'Sophonie',
  'hag': 'Aggée',
  'zec': 'Zacharie',
  'mal': 'Malachie',
  '1ma': '1 Maccabées',
  '2ma': '2 Maccabées',
  'mat': 'Matthieu',
  'mar': 'Marc',
  'luk': 'Luc',
  'joh': 'Jean',
  'act': 'Actes',
  'rom': 'Romains',
  '1co': '1 Corinthiens',
  '2co': '2 Corinthiens',
  'gal': 'Galates',
  'eph': 'Éphésiens',
  'phi': 'Philippiens',
  'col': 'Colossiens',
  '1th': '1 Thessaloniciens',
  '2th': '2 Thessaloniciens',
  '1ti': '1 Timothée',
  '2ti': '2 Timothée',
  'tit': 'Tite',
  'phm': 'Philémon',
  'heb': 'Hébreux',
  'jas': 'Jacques',
  '1pe': '1 Pierre',
  '2pe': '2 Pierre',
  '1jo': '1 Jean',
  '2jo': '2 Jean',
  '3jo': '3 Jean',
  'jud': 'Jude',
  'rev': 'Apocalypse'
};

export class BibleDataLoader {
  
  static loadRealVerses(): NeonVerse[] {
    console.log('🔄 Chargement des versets réels depuis fr_apee.json...');
    
    const verses: NeonVerse[] = [];
    
    // Vérifier si frApeeData est un tableau
    if (Array.isArray(frApeeData)) {
      console.log(`📊 ${frApeeData.length} versets trouvés dans fr_apee.json`);
      
      frApeeData.forEach((entry: FrApeeEntry) => {
        const bookId = BOOK_NAME_TO_ID[entry.book];
        const bookName = ID_TO_FRENCH_NAME[bookId] || entry.book;
        
        if (bookId && entry.text && entry.text.trim().length > 0) {
          verses.push({
            id: `${bookId}-${entry.chapter}-${entry.verse}`,
            book_id: bookId,
            book_name: bookName,
            chapter_number: entry.chapter,
            verse_number: entry.verse,
            text: entry.text.trim(),
            version_id: 'fr_apee',
            version_name: 'Bible Française APEE'
          });
        }
      });
    } else {
      console.warn('Format de données fr_apee non reconnu, utilisation des données de fallback');
    }
    
    console.log(`✅ ${verses.length} versets réels chargés et formatés`);
    
    // Grouper par livre pour statistiques
    const bookStats: { [key: string]: number } = {};
    verses.forEach(v => {
      bookStats[v.book_name] = (bookStats[v.book_name] || 0) + 1;
    });
    
    console.log('📚 Répartition par livre:');
    Object.entries(bookStats).forEach(([book, count]) => {
      console.log(`  ${book}: ${count} versets`);
    });
    
    return verses;
  }
  
  static getAvailableBooks(): string[] {
    const verses = this.loadRealVerses();
    const books = new Set(verses.map(v => v.book_id));
    return Array.from(books);
  }
  
  static getVersesForBook(bookId: string): NeonVerse[] {
    const allVerses = this.loadRealVerses();
    return allVerses.filter(v => v.book_id === bookId);
  }
  
  static getVersesForChapter(bookId: string, chapterNumber: number): NeonVerse[] {
    const allVerses = this.loadRealVerses();
    return allVerses.filter(v => 
      v.book_id === bookId && v.chapter_number === chapterNumber
    ).sort((a, b) => a.verse_number - b.verse_number);
  }
  
  static searchVerses(query: string, limit: number = 50): NeonVerse[] {
    const allVerses = this.loadRealVerses();
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) return [];
    
    return allVerses
      .filter(v => v.text.toLowerCase().includes(searchTerm))
      .slice(0, limit)
      .sort((a, b) => {
        if (a.book_name !== b.book_name) return a.book_name.localeCompare(b.book_name);
        if (a.chapter_number !== b.chapter_number) return a.chapter_number - b.chapter_number;
        return a.verse_number - b.verse_number;
      });
  }
}
