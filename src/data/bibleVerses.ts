import { BibleVerse, BibleBook } from '../types';

export const bibleBooks: BibleBook[] = [
  { name: 'Genèse', abbreviation: 'Gen', chapters: 50 },
  { name: 'Exode', abbreviation: 'Ex', chapters: 40 },
  { name: 'Lévitique', abbreviation: 'Lev', chapters: 27 },
  { name: 'Matthieu', abbreviation: 'Mt', chapters: 28 },
  { name: 'Marc', abbreviation: 'Mc', chapters: 16 },
  { name: 'Luc', abbreviation: 'Lc', chapters: 24 },
  { name: 'Jean', abbreviation: 'Jn', chapters: 21 },
  { name: 'Actes', abbreviation: 'Ac', chapters: 28 },
  { name: 'Romains', abbreviation: 'Rm', chapters: 16 },
  { name: 'Psaumes', abbreviation: 'Ps', chapters: 150 },
  { name: 'Proverbes', abbreviation: 'Pr', chapters: 31 },
];

export const dailyVerses: BibleVerse[] = [
  {
    id: '1',
    book: 'Jean',
    chapter: 3,
    verse: 16,
    text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
    version: 'LSG',
    language: 'fr'
  },
  {
    id: '2',
    book: 'Philippiens',
    chapter: 4,
    verse: 13,
    text: "Je puis tout par celui qui me fortifie.",
    version: 'LSG',
    language: 'fr'
  },
  {
    id: '3',
    book: 'Psaumes',
    chapter: 23,
    verse: 1,
    text: "L'Éternel est mon berger: je ne manquerai de rien.",
    version: 'LSG',
    language: 'fr'
  },
  {
    id: '4',
    book: 'Proverbes',
    chapter: 3,
    verse: 5,
    text: "Confie-toi en l'Éternel de tout ton cœur, Et ne t'appuie pas sur ta sagesse.",
    version: 'LSG',
    language: 'fr'
  },
  {
    id: '5',
    book: 'Matthieu',
    chapter: 6,
    verse: 33,
    text: "Cherchez premièrement le royaume et la justice de Dieu; et toutes ces choses vous seront données par-dessus.",
    version: 'LSG',
    language: 'fr'
  },
  {
    id: '6',
    book: 'Romains',
    chapter: 8,
    verse: 28,
    text: "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.",
    version: 'LSG',
    language: 'fr'
  },
  {
    id: '7',
    book: 'Ésaïe',
    chapter: 40,
    verse: 31,
    text: "Mais ceux qui se confient en l'Éternel renouvellent leur force. Ils prennent le vol comme les aigles; Ils courent, et ne se lassent point, Ils marchent, et ne se fatiguent point.",
    version: 'LSG',
    language: 'fr'
  }
];

export const encouragementMessages = [
  "Que cette journée soit remplie de la paix de Dieu 🕊️",
  "N'oublie pas que Dieu a un plan merveilleux pour ta vie ✨",
  "Tu es précieux(se) aux yeux de Dieu 💎",
  "Prends un moment pour remercier Dieu aujourd'hui 🙏",
  "Que la joie du Seigneur soit ta force 💪",
  "Dieu est avec toi dans chaque épreuve 🤗",
  "Tes prières ont du pouvoir, continue à prier 🌟"
];

export const getDailyVerse = (): BibleVerse => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  return dailyVerses[dayOfYear % dailyVerses.length];
};

export const getRandomEncouragement = (): string => {
  return encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
};

// Versets bibliques complets avec des exemples pour chaque livre
export const bibleVerses: BibleVerse[] = [
  // Genèse
  { id: '1', book: 'Genèse', chapter: 1, verse: 1, text: "Au commencement, Dieu créa les cieux et la terre.", version: 'LSG', language: 'fr' },
  { id: '2', book: 'Genèse', chapter: 1, verse: 2, text: "La terre était informe et vide : il y avait des ténèbres à la surface de l'abîme, et l'esprit de Dieu se mouvait au-dessus des eaux.", version: 'LSG', language: 'fr' },
  { id: '3', book: 'Genèse', chapter: 1, verse: 3, text: "Dieu dit : Que la lumière soit ! Et la lumière fut.", version: 'LSG', language: 'fr' },
  // Psaumes
  { id: '4', book: 'Psaumes', chapter: 23, verse: 1, text: "L'Éternel est mon berger : je ne manquerai de rien.", version: 'LSG', language: 'fr' },
  { id: '5', book: 'Psaumes', chapter: 23, verse: 2, text: "Il me fait reposer dans de verts pâturages, Il me dirige près des eaux paisibles.", version: 'LSG', language: 'fr' },
  { id: '6', book: 'Psaumes', chapter: 23, verse: 3, text: "Il restaure mon âme, Il me conduit dans les sentiers de la justice, À cause de son nom.", version: 'LSG', language: 'fr' },
  { id: '7', book: 'Psaumes', chapter: 1, verse: 1, text: "Heureux l'homme qui ne marche pas selon le conseil des méchants, Qui ne s'arrête pas sur la voie des pécheurs, Et qui ne s'assied pas en compagnie des moqueurs,", version: 'LSG', language: 'fr' },
  { id: '8', book: 'Psaumes', chapter: 1, verse: 2, text: "Mais qui trouve son plaisir dans la loi de l'Éternel, Et qui la médite jour et nuit !", version: 'LSG', language: 'fr' },
  { id: '9', book: 'Psaumes', chapter: 1, verse: 3, text: "Il est comme un arbre planté près d'un courant d'eau, Qui donne son fruit en sa saison, Et dont le feuillage ne se flétrit point : Tout ce qu'il fait lui réussit.", version: 'LSG', language: 'fr' },
  // Jean
  { id: '10', book: 'Jean', chapter: 3, verse: 16, text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.", version: 'LSG', language: 'fr' },
  { id: '11', book: 'Jean', chapter: 1, verse: 1, text: "Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu.", version: 'LSG', language: 'fr' },
  { id: '12', book: 'Jean', chapter: 1, verse: 14, text: "Et la parole a été faite chair, et elle a habité parmi nous, pleine de grâce et de vérité; et nous avons contemplé sa gloire, une gloire comme la gloire du Fils unique venu du Père.", version: 'LSG', language: 'fr' },
  // Matthieu
  { id: '13', book: 'Matthieu', chapter: 5, verse: 3, text: "Heureux les pauvres en esprit, car le royaume des cieux est à eux !", version: 'LSG', language: 'fr' },
  { id: '14', book: 'Matthieu', chapter: 5, verse: 4, text: "Heureux les affligés, car ils seront consolés !", version: 'LSG', language: 'fr' },
  { id: '15', book: 'Matthieu', chapter: 5, verse: 5, text: "Heureux les débonnaires, car ils hériteront la terre !", version: 'LSG', language: 'fr' },
  { id: '16', book: 'Matthieu', chapter: 5, verse: 6, text: "Heureux ceux qui ont faim et soif de la justice, car ils seront rassasiés !", version: 'LSG', language: 'fr' },
  // Proverbes
  { id: '17', book: 'Proverbes', chapter: 3, verse: 5, text: "Confie-toi en l'Éternel de tout ton cœur, Et ne t'appuie pas sur ta sagesse;", version: 'LSG', language: 'fr' },
  { id: '18', book: 'Proverbes', chapter: 3, verse: 6, text: "Reconnais-le dans toutes tes voies, Et il aplanira tes sentiers.", version: 'LSG', language: 'fr' },
  // Romains
  { id: '19', book: 'Romains', chapter: 8, verse: 28, text: "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.", version: 'LSG', language: 'fr' },
  { id: '20', book: 'Romains', chapter: 8, verse: 31, text: "Que dirons-nous donc à l'égard de ces choses ? Si Dieu est pour nous, qui sera contre nous ?", version: 'LSG', language: 'fr' },
  // Philippiens
  { id: '21', book: 'Philippiens', chapter: 4, verse: 13, text: "Je puis tout par celui qui me fortifie.", version: 'LSG', language: 'fr' },
  { id: '22', book: 'Philippiens', chapter: 4, verse: 19, text: "Et mon Dieu pourvoira à tous vos besoins selon sa richesse, avec gloire, en Jésus-Christ.", version: 'LSG', language: 'fr' },
  // Ésaïe
  { id: '23', book: 'Ésaïe', chapter: 40, verse: 31, text: "Mais ceux qui se confient en l'Éternel renouvellent leur force. Ils prennent le vol comme les aigles; Ils courent, et ne se lassent point, Ils marchent, et ne se fatiguent point.", version: 'LSG', language: 'fr' },
  { id: '24', book: 'Ésaïe', chapter: 55, verse: 8, text: "Car mes pensées ne sont pas vos pensées, Et vos voies ne sont pas mes voies, Dit l'Éternel.", version: 'LSG', language: 'fr' },
  // 1 Corinthiens
  { id: '25', book: '1 Corinthiens', chapter: 13, verse: 4, text: "La charité est patiente, elle est pleine de bonté; la charité n'est point envieuse; la charité ne se vante point, elle ne s'enfle point d'orgueil,", version: 'LSG', language: 'fr' },
  { id: '26', book: '1 Corinthiens', chapter: 13, verse: 13, text: "Maintenant donc ces trois choses demeurent : la foi, l'espérance, la charité; mais la plus grande de ces choses, c'est la charité.", version: 'LSG', language: 'fr' }
];
