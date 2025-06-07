// --- src/hooks/useBible.ts ---
import { useState, useEffect } from 'react';
import { loadBibleData } from '../lib/bibleDataLoader';

const useBible = () => {
  const [favorites, setFavorites] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const data = await loadBibleData('louis-segond');
      setBooks(data.books);
    };
    fetchBooks();
  }, []);

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
    books,
    favorites,
    addFavorite,
    removeFavorite,
    search,
  };
};

export default useBible;
