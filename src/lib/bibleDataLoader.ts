// src/lib/bibleDataLoader.ts
// Gestion centralisée des données bibliques locales (JSON/XML) + fallback API
// Utilise le cache mémoire pour la performance

const cache: Record<string, any> = {};

/**
 * Charge dynamiquement le fichier JSON local pour une version donnée.
 * Fallback API si le fichier n'existe pas.
 */
export async function loadBibleData(version: string): Promise<any> {
  if (cache[version]) return cache[version];
  try {
    // On tente de charger le JSON local (ex: en_kjv.json, fr_lsg.json, etc.)
    const data = await import(`../data/json/${version.toLowerCase()}.json`);
    cache[version] = data.default || data;
    return cache[version];
  } catch (e) {
    // Fallback API si le fichier n'existe pas
    // TODO: Ajouter ici l'appel API si besoin
    throw new Error("Aucune donnée locale ni API disponible pour cette version");
  }
}

/**
 * Retourne la liste des livres pour une version donnée.
 */
export async function getBooks(version: string): Promise<string[]> {
  const data = await loadBibleData(version);
  return Object.keys(data);
}

/**
 * Retourne la liste des chapitres pour un livre/version donné.
 */
export async function getChapters(version: string, book: string): Promise<string[]> {
  const data = await loadBibleData(version);
  return Object.keys(data[book]);
}

/**
 * Retourne la liste des versets pour un chapitre/livre/version donné.
 */
export async function getVerses(version: string, book: string, chapter: string | number): Promise<any[]> {
  const data = await loadBibleData(version);
  // On retourne un tableau d'objets {verse: numéro, text: texte}
  const chapterData = data[book][chapter];
  if (Array.isArray(chapterData)) return chapterData;
  // Si c'est un objet {1: 'texte', 2: 'texte', ...}
  return Object.entries(chapterData).map(([verse, text]) => ({ verse, text }));
}

// Ajoute des commentaires clairs pour chaque fonction.
