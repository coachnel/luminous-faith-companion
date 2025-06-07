/* ===================================================================
   File: src/lib/bibleDataLoader.ts
   Responsibility: Centralized loader for Bible data (JSON/XML) with in-memory cache
   =================================================================== */

import { BibleData, BookInfo, Verse, Chapter } from '../types/bible';

// src/lib/bibleDataLoader.ts
class BibleDataCache {
  private static instance: BibleDataCache;
  private cache: BibleData | null = null;
  private loading: Promise<BibleData> | null = null;

  static getInstance(): BibleDataCache {
    if (!BibleDataCache.instance) {
      BibleDataCache.instance = new BibleDataCache();
    }
    return BibleDataCache.instance;
  }

  async loadBibleData(): Promise<BibleData> {
    if (this.cache) {
      return this.cache;
    }

    if (this.loading) {
      return this.loading;
    }

    this.loading = this.fetchBibleData();
    this.cache = await this.loading;
    this.loading = null;

    return this.cache;
  }

  private async fetchBibleData(): Promise<BibleData> {
    try {
      const response = await fetch('/louis-segond.json');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(
        'Impossible de charger louis-segond.json, utilisation des données de démonstration'
      );
    }

    return this.createMockBibleData();
  }

  private createMockBibleData(): BibleData {
    const oldTestamentBooks = ['Genèse', 'Exode'];
    const newTestamentBooks = ['Matthieu', 'Jean'];

    const createBook = (name: string, chaptersCount: number = 3) => ({
      name,
      chapters: Array.from({ length: chaptersCount }, (_, chapterIndex) => ({
        chapter: chapterIndex + 1,
        verses: Array.from({ length: 10 }, (_, verseIndex) => ({
          book: name,
          chapter: chapterIndex + 1,
          verse: verseIndex + 1,
          text: `Ceci est le verset ${verseIndex + 1} du chapitre ${chapterIndex + 1} de ${name}.`,
        })),
      })),
    });

    return {
      oldTestament: oldTestamentBooks.map(name => createBook(name, 3)),
      newTestament: newTestamentBooks.map(name => createBook(name, 3)),
    };
  }
}

export const loadBibleData = async (): Promise<BibleData> => {
  return BibleDataCache.getInstance().loadBibleData();
};

export const getBooks = async (): Promise<BookInfo[]> => {
  const bibleData = await loadBibleData();
  const oldTestamentBooks = bibleData.oldTestament.map(book => ({
    name: book.name,
    testament: 'old' as const,
    chaptersCount: book.chapters.length,
  }));

  const newTestamentBooks = bibleData.newTestament.map(book => ({
    name: book.name,
    testament: 'new' as const,
    chaptersCount: book.chapters.length,
  }));

  return [...oldTestamentBooks, ...newTestamentBooks];
};

export const getChapters = async (bookName: string): Promise<Chapter[]> => {
  const bibleData = await loadBibleData();
  const book = [...bibleData.oldTestament, ...bibleData.newTestament].find(b => b.name === bookName);
  if (!book) {
    throw new Error(`Book not found: ${bookName}`);
  }
  return book.chapters;
};

export const getVerses = async (bookName: string, chapterNumber: number): Promise<Verse[]> => {
  const bibleData = await loadBibleData();
  const book = [...bibleData.oldTestament, ...bibleData.newTestament].find(b => b.name === bookName);
  if (!book) {
    throw new Error(`Book not found: ${bookName}`);
  }
  const chapter = book.chapters.find(c => c.chapter === chapterNumber);
  if (!chapter) {
    throw new Error(`Chapter not found: ${chapterNumber} in book ${bookName}`);
  }
  return chapter.verses;
};
