// --- src/components/BibleView.tsx ---
import React, { useState } from 'react';
import useBible from '../hooks/useBible';

const BibleView = () => {
  const { books, favorites, addFavorite, removeFavorite } = useBible();
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  return (
    <div className="bible-view">
      <h1 className="title">Genèse - Chapitre 1</h1>
      <div className="navigation">
        <select onChange={(e) => setSelectedBook(e.target.value)}>
          {books.map((book) => (
            <option key={book.name} value={book.name}>{book.name}</option>
          ))}
        </select>
        <select onChange={(e) => setSelectedChapter(e.target.value)}>
          {selectedBook?.chapters.map((chapter) => (
            <option key={chapter.number} value={chapter.number}>Chapitre {chapter.number}</option>
          ))}
        </select>
      </div>
      <div className="verses">
        {selectedChapter?.verses.map((verse, index) => (
          <div key={index} className="verse">
            <p>{verse}</p>
            <button onClick={() => addFavorite(verse)}>⭐</button>
            <button onClick={() => navigator.share({ text: verse })}>Partager</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BibleView;
