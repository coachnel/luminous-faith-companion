export interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface Chapter {
  chapter: number;
  verses: Verse[];
}

export interface Book {
  name: string;
  chapters: Chapter[];
}

export interface BibleData {
  oldTestament: Book[];
  newTestament: Book[];
}

export interface BookInfo {
  name: string;
  testament: 'old' | 'new';
  chaptersCount: number;
}
