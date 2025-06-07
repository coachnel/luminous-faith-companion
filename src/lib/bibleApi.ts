// src/lib/bibleApi.ts
// Intégration de l'API https://api.scripture.api.bible pour les versions KJV, NIV, ESV
// Clé API à sécuriser ensuite via variable d'environnement

const API_BASE = 'https://api.scripture.api.bible/v1';
const VERSION_IDS = {
  KJV: 'de4e12af7f28f599-01', // King James Version
  NIV: '06125adad2d5898a-01', // New International Version
  ESV: '592420522e16049f-01', // English Standard Version
};

// Utilise la clé API en dur pour le développement, à remplacer ensuite
const API_KEY = process.env.BIBLE_API_KEY || '20a2d5e5be291fab27c9111fa96b292f';

// Simple cache local (mémoire) pour limiter les appels API
const cache: Record<string, any> = {};

// Ajoute dynamiquement les versions manquantes à la liste des versions disponibles
export const dynamicBibleVersions = [
  { id: 'KJV', name: 'King James Version', language: 'en' },
  { id: 'NIV', name: 'New International Version', language: 'en' },
  { id: 'ESV', name: 'English Standard Version', language: 'en' },
];

// Exemple d'utilisation :
// const books = await fetchBooksForVersion('KJV');
