
import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Heart, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

// Version Lite du Nouveau Testament
const newTestamentBooks = [
  { id: 1, name: 'Matthieu', chapters: 28 },
  { id: 2, name: 'Marc', chapters: 16 },
  { id: 3, name: 'Luc', chapters: 24 },
  { id: 4, name: 'Jean', chapters: 21 },
  { id: 5, name: 'Actes', chapters: 28 },
  { id: 6, name: 'Romains', chapters: 16 },
  { id: 7, name: '1 Corinthiens', chapters: 16 },
  { id: 8, name: '2 Corinthiens', chapters: 13 },
  { id: 9, name: 'Galates', chapters: 6 },
  { id: 10, name: 'Éphésiens', chapters: 6 },
  { id: 11, name: 'Philippiens', chapters: 4 },
  { id: 12, name: 'Colossiens', chapters: 4 },
  { id: 13, name: '1 Thessaloniciens', chapters: 5 },
  { id: 14, name: '2 Thessaloniciens', chapters: 3 },
  { id: 15, name: '1 Timothée', chapters: 6 },
  { id: 16, name: '2 Timothée', chapters: 4 },
  { id: 17, name: 'Tite', chapters: 3 },
  { id: 18, name: 'Philémon', chapters: 1 },
  { id: 19, name: 'Hébreux', chapters: 13 },
  { id: 20, name: 'Jacques', chapters: 5 },
  { id: 21, name: '1 Pierre', chapters: 5 },
  { id: 22, name: '2 Pierre', chapters: 3 },
  { id: 23, name: '1 Jean', chapters: 5 },
  { id: 24, name: '2 Jean', chapters: 1 },
  { id: 25, name: '3 Jean', chapters: 1 },
  { id: 26, name: 'Jude', chapters: 1 },
  { id: 27, name: 'Apocalypse', chapters: 22 }
];

// Versets complets pour plusieurs livres
const sampleVerses = {
  1: { // Matthieu
    1: [
      { number: 1, text: "Généalogie de Jésus Christ, fils de David, fils d'Abraham." },
      { number: 2, text: "Abraham engendra Isaac; Isaac engendra Jacob; Jacob engendra Juda et ses frères;" },
      { number: 3, text: "Juda engendra Pharès et Zara de Thamar; Pharès engendra Esrom; Esrom engendra Aram;" },
      { number: 4, text: "Aram engendra Aminadab; Aminadab engendra Naasson; Naasson engendra Salmon;" },
      { number: 5, text: "Salmon engendra Boaz de Rahab; Boaz engendra Obed de Ruth;" },
      { number: 6, text: "Obed engendra Isaï; Isaï engendra David. Le roi David engendra Salomon de la femme d'Urie;" },
      { number: 7, text: "Salomon engendra Roboam; Roboam engendra Abia; Abia engendra Asa;" },
      { number: 8, text: "Asa engendra Josaphat; Josaphat engendra Joram; Joram engendra Ozias;" },
      { number: 9, text: "Ozias engendra Joatham; Joatham engendra Achaz; Achaz engendra Ézéchias;" },
      { number: 10, text: "Ézéchias engendra Manassé; Manassé engendra Amon; Amon engendra Josias;" }
    ]
  },
  4: { // Jean
    1: [
      { number: 1, text: "Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu." },
      { number: 2, text: "Elle était au commencement avec Dieu." },
      { number: 3, text: "Toutes choses ont été faites par elle, et rien de ce qui a été fait n'a été fait sans elle." },
      { number: 4, text: "En elle était la vie, et la vie était la lumière des hommes." },
      { number: 5, text: "La lumière luit dans les ténèbres, et les ténèbres ne l'ont point reçue." },
      { number: 6, text: "Il y eut un homme envoyé de Dieu: son nom était Jean." },
      { number: 7, text: "Il vint pour servir de témoin, pour rendre témoignage à la lumière, afin que tous crussent par lui." },
      { number: 8, text: "Il n'était pas la lumière, mais il parut pour rendre témoignage à la lumière." }
    ],
    3: [
      { number: 16, text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle." },
      { number: 17, text: "Dieu, en effet, n'a pas envoyé son Fils dans le monde pour qu'il juge le monde, mais pour que le monde soit sauvé par lui." },
      { number: 18, text: "Celui qui croit en lui n'est point jugé; mais celui qui ne croit pas est déjà jugé, parce qu'il n'a pas cru au nom du Fils unique de Dieu." }
    ]
  },
  6: { // Romains
    1: [
      { number: 1, text: "Paul, serviteur de Jésus Christ, appelé à être apôtre, mis à part pour annoncer l'Évangile de Dieu." },
      { number: 2, text: "Cet Évangile, il l'avait promis auparavant par ses prophètes dans les saintes Écritures." },
      { number: 3, text: "Il concerne son Fils né de la postérité de David, selon la chair." },
      { number: 4, text: "Et déclaré Fils de Dieu avec puissance, selon l'Esprit de sainteté, par sa résurrection d'entre les morts, Jésus Christ notre Seigneur." }
    ]
  }
};

const BibleLite = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentVerses, setCurrentVerses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [readingProgress, setReadingProgress] = useState({});

  useEffect(() => {
    // Charger la progression de lecture
    const saved = localStorage.getItem('bibleReadingProgress');
    if (saved) {
      setReadingProgress(JSON.parse(saved));
    }
  }, []);

  const selectBook = (book) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setCurrentVerses([]);
  };

  const selectChapter = (chapterNumber) => {
    if (!selectedBook) return;
    
    setSelectedChapter(chapterNumber);
    
    // Charger les versets (utiliser les exemples ou générer du contenu par défaut)
    const verses = sampleVerses[selectedBook.id]?.[chapterNumber] || [
      { number: 1, text: `Contenu du chapitre ${chapterNumber} de ${selectedBook.name}. Ce verset fait partie de la version Lite de la Bible.` },
      { number: 2, text: `Deuxième verset du chapitre ${chapterNumber}. La version complète sera bientôt disponible.` },
      { number: 3, text: `Troisième verset avec un contenu spirituel enrichissant pour votre méditation quotidienne.` }
    ];
    
    setCurrentVerses(verses);
    
    // Sauvegarder la dernière lecture
    localStorage.setItem('lastBibleRead', new Date().toISOString());
  };

  const markChapterAsRead = () => {
    if (!selectedBook || !selectedChapter) return;
    
    const key = `${selectedBook.id}-${selectedChapter}`;
    const newProgress = {
      ...readingProgress,
      [key]: {
        bookId: selectedBook.id,
        bookName: selectedBook.name,
        chapter: selectedChapter,
        readAt: new Date().toISOString()
      }
    };
    
    setReadingProgress(newProgress);
    localStorage.setItem('bibleReadingProgress', JSON.stringify(newProgress));
    toast.success(`${selectedBook.name} ${selectedChapter} marqué comme lu !`);
  };

  const isChapterRead = (bookId, chapter) => {
    const key = `${bookId}-${chapter}`;
    return readingProgress[key] !== undefined;
  };

  const getReadingStats = () => {
    const totalChapters = newTestamentBooks.reduce((sum, book) => sum + book.chapters, 0);
    const readChapters = Object.keys(readingProgress).length;
    return { read: readChapters, total: totalChapters, percentage: Math.round((readChapters / totalChapters) * 100) };
  };

  const stats = getReadingStats();

  return (
    <div 
      className="p-4 space-y-6 max-w-6xl mx-auto min-h-screen"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* En-tête */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--accent-primary)' }}
            >
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Bible Lite</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Nouveau Testament - {stats.read}/{stats.total} chapitres lus ({stats.percentage}%)
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-primary)]"
              />
            </div>
          </div>
        </div>
      </ModernCard>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Liste des livres */}
        <div className="lg:col-span-1">
          <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
            <div className="p-4 border-b border-[var(--border-default)]">
              <h3 className="font-semibold text-[var(--text-primary)]">Nouveau Testament</h3>
              <p className="text-sm text-[var(--text-secondary)]">{newTestamentBooks.length} livres</p>
            </div>
            
            <ScrollArea className="h-[400px]">
              <div className="p-2 space-y-1">
                {newTestamentBooks.map((book) => (
                  <ModernButton
                    key={book.id}
                    variant={selectedBook?.id === book.id ? "primary" : "ghost"}
                    className="w-full justify-start text-sm"
                    onClick={() => selectBook(book)}
                  >
                    <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{book.name}</span>
                  </ModernButton>
                ))}
              </div>
            </ScrollArea>
          </ModernCard>
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-3">
          {!selectedBook ? (
            <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)] h-[500px] flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-[var(--text-secondary)] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Sélectionnez un livre</h3>
                <p className="text-[var(--text-secondary)]">Choisissez un livre du Nouveau Testament pour commencer</p>
              </div>
            </ModernCard>
          ) : !selectedChapter ? (
            <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
              <div className="p-4 border-b border-[var(--border-default)]">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{selectedBook.name}</h3>
                <p className="text-sm text-[var(--text-secondary)]">Sélectionnez un chapitre</p>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2">
                  {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapter) => (
                    <ModernButton
                      key={chapter}
                      variant="outline"
                      size="sm"
                      onClick={() => selectChapter(chapter)}
                      className={`relative ${isChapterRead(selectedBook.id, chapter) ? 'bg-green-50 border-green-200' : ''}`}
                    >
                      {chapter}
                      {isChapterRead(selectedBook.id, chapter) && (
                        <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-600" />
                      )}
                    </ModernButton>
                  ))}
                </div>
              </div>
            </ModernCard>
          ) : (
            <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
              <div className="p-4 border-b border-[var(--border-default)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      {selectedBook.name} - Chapitre {selectedChapter}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {currentVerses.length} verset(s)
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ModernButton
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedChapter(null)}
                    >
                      Retour
                    </ModernButton>
                    <ModernButton
                      variant={isChapterRead(selectedBook.id, selectedChapter) ? "secondary" : "primary"}
                      size="sm"
                      onClick={markChapterAsRead}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {isChapterRead(selectedBook.id, selectedChapter) ? 'Lu' : 'Marquer comme lu'}
                    </ModernButton>
                  </div>
                </div>
              </div>
              
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-4">
                  {currentVerses.map((verse) => (
                    <div key={verse.number} className="flex gap-4">
                      <span className="font-semibold text-[var(--accent-primary)] text-sm min-w-[2rem] flex-shrink-0">
                        {verse.number}.
                      </span>
                      <p className="text-[var(--text-primary)] leading-relaxed">{verse.text}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </ModernCard>
          )}
        </div>
      </div>

      {/* Comment ça marche */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Comment ça marche ?
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Sélectionnez un livre du Nouveau Testament dans la liste de gauche, puis choisissez un chapitre. 
              Votre progression de lecture est automatiquement sauvegardée. Marquez les chapitres comme lus 
              pour suivre votre avancement. Cette version Lite contient les 27 livres du Nouveau Testament 
              avec un contenu de base qui sera enrichi progressivement.
            </p>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default BibleLite;
