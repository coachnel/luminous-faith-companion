// --- src/hooks/useBible.ts ---
import { useState, useEffect } from 'react';
import { Verse } from '../types/bible';

const useBible = () => {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const storedFavorites = localStorage.getItem('bibleFavorites');
    return storedFavorites ? new Set(JSON.parse(storedFavorites)) : new Set();
  });
  const [books, setBooks] = useState([]);

  // Ajout de journaux pour diagnostiquer les problèmes liés aux favoris et aux livres
  useEffect(() => {
    console.log('Chargement des livres de la Bible...');
    const fetchBooks = async () => {
      try {
        const data = {
          oldTestament: [],
          newTestament: [],
        };
        setBooks(data.oldTestament.concat(data.newTestament));
        console.log('Livres chargés avec succès:', data);
      } catch (error) {
        console.error('Erreur lors du chargement des livres:', error);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    console.log('Mise à jour des favoris:', Array.from(favorites));
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
