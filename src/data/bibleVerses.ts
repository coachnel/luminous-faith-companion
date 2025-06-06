
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
