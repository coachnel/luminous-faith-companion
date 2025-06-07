// --- src/hooks/useBible.ts ---
import { useState, useEffect } from 'react';
import { Verse } from '../types/bible';

const useBible = () => {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const storedFavorites = localStorage.getItem('bibleFavorites');
    return storedFavorites ? new Set(JSON.parse(storedFavorites)) : new Set();
  });
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Remplacer par des données fictives ou une autre source de données
    const fetchBooks = async () => {
      // Exemple de données fictives
      const data = {
        oldTestament: [],
        newTestament: [],
      };
      setBooks(data.oldTestament.concat(data.newTestament));
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    localStorage.setItem('bibleFavorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggleFavorite = (verseId: string) => {
    setFavorites(prev => {
      const updatedFavorites = new Set(prev);
      if (updatedFavorites.has(verseId)) {
        updatedFavorites.delete(verseId);
      } else {
        updatedFavorites.add(verseId);
      }
      return updatedFavorites;
    });
  };

  const isFavorite = (verseId: string) => favorites.has(verseId);

  const search = (query: string) => {
    const results: Verse[] = [];
    books.forEach(book => {
      book.chapters.forEach(chapter => {
        chapter.verses.forEach(verse => {
          if (verse.text.toLowerCase().includes(query.toLowerCase())) {
            results.push(verse);
          }
        });
      });
    });
    return results.slice(0, 50);
  };

  return {
    books,
    favorites: Array.from(favorites),
    toggleFavorite,
    isFavorite,
    search,
  };
};

export default useBible;
