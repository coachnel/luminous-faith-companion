
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
}

const bibleData: BibleData = {
  oldTestament: [
    {
      name: 'Genesis',
      chapters: [
        {
          chapter: 1,
          verseCount: 2,
          verses: [
            { book: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning God created the heaven and the earth.' },
            { book: 'Genesis', chapter: 1, verse: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep.' },
            // ... more verses ...
          ],
        },
        // ... more chapters ...
      ],
    },
    // ... more books ...
  ],
  newTestament: [
    {
      name: 'Matthew',
      chapters: [
        {
          chapter: 1,
          verseCount: 2,
          verses: [
            { book: 'Matthew', chapter: 1, verse: 1, text: 'The book of the generation of Jesus Christ, the son of David, the son of Abraham.' },
            { book: 'Matthew', chapter: 1, verse: 2, text: 'Abraham begat Isaac; and Isaac begat Jacob; and Jacob begat Judas and his brethren;' },
            // ... more verses ...
          ],
        },
        // ... more chapters ...
      ],
    },
    // ... more books ...
  ],
};

export const getBooks = async (): Promise<BookInfo[]> => {
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
  const book = [...bibleData.oldTestament, ...bibleData.newTestament].find(b => b.name === bookName);
  if (!book) {
    throw new Error(`Book not found: ${bookName}`);
  }
  return book.chapters;
};

export const getVerses = async (bookName: string, chapterNumber: number): Promise<Verse[]> => {
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
