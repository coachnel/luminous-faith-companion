/* ===================================================================
   File: src/components/BibleApp.tsx
   Responsibility: Main React component for Bible navigation & search
   =================================================================== */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getBooks, getChapters, getVerses } from '@/lib/bibleDataLoader';

const BIBLE_VERSION = 'fr_apee';

const BibleApp: React.FC = () => {
  const [books, setBooks] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [chapters, setChapters] = useState<string[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [verses, setVerses] = useState<Array<{ verse: string; text: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chargement des livres au montage
  useEffect(() => {
    setLoading(true);
    getBooks(BIBLE_VERSION)
      .then(setBooks)
      .catch(() => setError('Erreur lors du chargement des livres'))
      .finally(() => setLoading(false));
  }, []);

  // Chargement des chapitres quand un livre est sélectionné
  useEffect(() => {
    if (!selectedBook) return;
    setLoading(true);
    getChapters(BIBLE_VERSION, selectedBook)
      .then(list => {
        setChapters(list);
        setSelectedChapter(1);
      })
      .catch(() => setError('Erreur lors du chargement des chapitres'))
      .finally(() => setLoading(false));
  }, [selectedBook]);

  // Chargement des versets quand un chapitre est sélectionné
  useEffect(() => {
    if (!selectedBook || !selectedChapter) return;
    setLoading(true);
    getVerses(BIBLE_VERSION, selectedBook, selectedChapter)
      .then(setVerses)
      .catch(() => setError('Erreur lors du chargement des versets'))
      .finally(() => setLoading(false));
  }, [selectedBook, selectedChapter]);

  // Navigation chapitres
  const goToPrevChapter = () => {
    if (selectedChapter > 1) setSelectedChapter(selectedChapter - 1);
  };
  const goToNextChapter = () => {
    if (selectedChapter < chapters.length) setSelectedChapter(selectedChapter + 1);
  };

  // Retour à la liste des livres
  const handleBackToBooks = () => {
    setSelectedBook(null);
    setChapters([]);
    setSelectedChapter(1);
    setVerses([]);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-gray-500 mb-4">Chargement...</div>}

      {/* Liste des livres */}
      {!selectedBook && !loading && (
        <div>
          <h2 className="text-xl font-bold mb-4">Livres de la Bible</h2>
          <ul className="divide-y divide-gray-200">
            {books.map(book => (
              <li key={book}>
                <Button variant="ghost" className="w-full justify-between py-3 text-left" onClick={() => setSelectedBook(book)}>
                  {book}
                  <span className="ml-2">&gt;</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation chapitre + affichage versets */}
      {selectedBook && (
        <div>
          <div className="flex items-center mb-4">
            <Button variant="ghost" onClick={handleBackToBooks}>&lt;</Button>
            <h2 className="flex-1 text-center text-lg font-semibold">{selectedBook}</h2>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={goToPrevChapter} disabled={selectedChapter === 1}>&lt;</Button>
            <span>Chapitre {selectedChapter} / {chapters.length}</span>
            <Button variant="outline" size="sm" onClick={goToNextChapter} disabled={selectedChapter === chapters.length}>&gt;</Button>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            {verses.map(v => (
              <div key={v.verse} className="flex items-start gap-2 mb-2">
                <span className="font-bold w-6 text-right text-gray-500">{v.verse}</span>
                <span className="flex-1 text-gray-900">{v.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BibleApp;
