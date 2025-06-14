
import { BibleData, Book, Chapter, Verse, BookInfo } from '../types/bible';

export const loadBibleData = async (): Promise<BibleData> => {
  try {
    const response = await fetch('/src/data/louis-segond.json');
    if (!response.ok) {
      throw new Error(`Failed to load Bible data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading Bible data:', error);
    throw error;
  }
};

export const getAllBooks = (bibleData: BibleData): BookInfo[] => {
  const books: BookInfo[] = [];
  
  // Add Old Testament books
  bibleData.oldTestament.forEach(book => {
    books.push({
      name: book.name,
      testament: 'old',
      chaptersCount: book.chapters.length
    });
  });
  
  // Add New Testament books
  bibleData.newTestament.forEach(book => {
    books.push({
      name: book.name,
      testament: 'new', 
      chaptersCount: book.chapters.length
    });
  });
  
  return books;
};

export const getBookChapters = (bibleData: BibleData, bookName: string): number[] => {
  const allBooks = [...bibleData.oldTestament, ...bibleData.newTestament];
  const book = allBooks.find(b => b.name === bookName);
  return book ? book.chapters.map(chapter => chapter.chapter) : [];
};

export const getChapterVerses = (bibleData: BibleData, bookName: string, chapterNumber: number): Verse[] => {
  const allBooks = [...bibleData.oldTestament, ...bibleData.newTestament];
  const book = allBooks.find(b => b.name === bookName);
  const chapter = book?.chapters.find(c => c.chapter === chapterNumber);
  return chapter ? chapter.verses : [];
};

export const searchVerses = (bibleData: BibleData, query: string, limit: number = 50): Verse[] => {
  const results: Verse[] = [];
  const searchQuery = query.toLowerCase();
  
  const allBooks = [...bibleData.oldTestament, ...bibleData.newTestament];
  
  for (const book of allBooks) {
    for (const chapter of book.chapters) {
      for (const verse of chapter.verses) {
        if (verse.text.toLowerCase().includes(searchQuery)) {
          results.push(verse);
          if (results.length >= limit) {
            return results;
          }
        }
      }
    }
  }
  
  return results;
};
