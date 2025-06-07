// --- src/components/BibleView.tsx ---
import React, { useState } from 'react';
import useBible from '../hooks/useBible';

const BibleView = () => {
  const { books, favorites, addFavorite, removeFavorite } = useBible();
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const handleBookChange = (bookName) => {
    const book = books.find((b) => b.name === bookName);
    setSelectedBook(book);
    setSelectedChapter(null); // Reset chapter selection
  };

  const handleChapterChange = (chapterNumber) => {
    const chapter = selectedBook?.chapters.find((c) => c.number === parseInt(chapterNumber));
    setSelectedChapter(chapter);
  };

  return (
    <div className="bible-view">
      <h1 className="title">{selectedBook?.name || 'Livres de la Bible'}</h1>
      <div className="navigation">
        <select onChange={(e) => handleBookChange(e.target.value)}>
          <option value="">Sélectionnez un livre</option>
          {books.map((book) => (
            <option key={book.name} value={book.name}>{book.name}</option>
          ))}
        </select>
        {selectedBook && (
          <select onChange={(e) => handleChapterChange(e.target.value)}>
            <option value="">Sélectionnez un chapitre</option>
            {selectedBook.chapters.map((chapter) => (
              <option key={chapter.number} value={chapter.number}>Chapitre {chapter.number}</option>
            ))}
          </select>
        )}
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
