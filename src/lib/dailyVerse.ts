
import { Verse } from '../types/bible';
import louisSegondData from '../data/louis-segond.json';

class DailyVerseService {
  private static instance: DailyVerseService;
  private allVerses: Verse[] = [];

  static getInstance(): DailyVerseService {
    if (!DailyVerseService.instance) {
      DailyVerseService.instance = new DailyVerseService();
    }
    return DailyVerseService.instance;
  }

  constructor() {
    this.loadAllVerses();
  }

  private loadAllVerses() {
    const data = louisSegondData;
    this.allVerses = [];
    
    // Collecte tous les versets de l'Ancien Testament
    data.oldTestament.forEach(book => {
      book.chapters.forEach(chapter => {
        chapter.verses.forEach(verse => {
          this.allVerses.push(verse);
        });
      });
    });

    // Collecte tous les versets du Nouveau Testament
    data.newTestament.forEach(book => {
      book.chapters.forEach(chapter => {
        chapter.verses.forEach(verse => {
          this.allVerses.push(verse);
        });
      });
    });
  }

  getDailyVerse(): Verse {
    if (this.allVerses.length === 0) {
      // Verset par défaut si aucune donnée n'est disponible
      return {
        book: 'Jean',
        chapter: 3,
        verse: 16,
        text: 'Car Dieu a tant aimé le monde qu\'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu\'il ait la vie éternelle.'
      };
    }

    // Utilise la date actuelle pour obtenir un verset "aléatoire" mais reproductible pour la même journée
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % this.allVerses.length;
    
    return this.allVerses[index];
  }

  getRandomVerse(): Verse {
    if (this.allVerses.length === 0) {
      return this.getDailyVerse();
    }
    
    const randomIndex = Math.floor(Math.random() * this.allVerses.length);
    return this.allVerses[randomIndex];
  }
}

export const dailyVerseService = DailyVerseService.getInstance();
export const getDailyVerse = () => dailyVerseService.getDailyVerse();
export const getRandomVerse = () => dailyVerseService.getRandomVerse();
