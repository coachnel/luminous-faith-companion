// --- src/hooks/useBible.ts ---
import { useState } from 'react';
import bibleData from '../data/louis-segond.json';

const useBible = () => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (verse) => {
    setFavorites([...favorites, verse]);
  };

  const removeFavorite = (verse) => {
    setFavorites(favorites.filter(fav => fav !== verse));
  };

  const search = (query) => {
    // Implement search logic here
    return [];
  };

  return {
    books: bibleData.books,
    chapters: (book) => book.chapters,
    verses: (chapter) => chapter.verses,
    search,
    favorites,
    addFavorite,
    removeFavorite
  };
};

export default useBible;
