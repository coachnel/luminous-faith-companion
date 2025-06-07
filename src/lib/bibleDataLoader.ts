/* ===================================================================
   File: src/lib/bibleDataLoader.ts
   Responsibility: Centralized loader for Bible data (JSON/XML) with in-memory cache
   =================================================================== */

// src/lib/bibleDataLoader.ts
const cache: Record<string, any> = {};

/**
 * Load Bible data for a given version, preferring JSON, then XML, then fallback API.
 */
export async function loadBibleData(version: string): Promise<any> {
  if (cache[version]) {
    return cache[version];
  }

  // 1. Try JSON import
  try {
    const module = await import(
      /* webpackChunkName: "bible-[request]" */
      `../data/json/${version.toLowerCase()}.json`
    );
    cache[version] = module.default ?? module;
    return cache[version];
  } catch (jsonErr) {
    // JSON not available, continue to XML
  }

  // 2. Try XML import and parse
  try {
    // Note: ensure your bundler supports raw import for XML files
    // e.g., import xml as text: xml?raw
    const xmlText = await import(
      `../data/xml/${version.toLowerCase()}.xml?raw`
    );
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText.default ?? xmlText, 'application/xml');
    const data: any = {};
    // Assuming XML structure: <Bible><Book name="Genesis"><Chapter num="1"><Verse num="1">...</Verse></Chapter>...</Book>...</Bible>
    xmlDoc.querySelectorAll('Book').forEach(bookEl => {
      const bookName = bookEl.getAttribute('name')!;
      data[bookName] = {};
      bookEl.querySelectorAll('Chapter').forEach(chEl => {
        const chapNum = chEl.getAttribute('num')!;
        data[bookName][chapNum] = {};
        chEl.querySelectorAll('Verse').forEach(vEl => {
          const verseNum = vEl.getAttribute('num')!;
          data[bookName][chapNum][verseNum] = vEl.textContent || '';
        });
      });
    });
    cache[version] = data;
    return data;
  } catch (xmlErr) {
    // XML not available, continue to API fallback
  }

  // 3. Fallback to external API (if implemented)
  // TODO: implement fetch() to remote Bible API for missing versions
  throw new Error(
    `Aucune donnée locale (JSON/XML) ni API disponible pour la version ${version}`
  );
}

export async function getBooks(version: string): Promise<string[]> {
  const data = await loadBibleData(version);
  return Object.keys(data);
}

export async function getChapters(
  version: string,
  book: string
): Promise<string[]> {
  const data = await loadBibleData(version);
  if (!data[book]) {
    throw new Error(`Livre non trouvé: ${book}`);
  }
  return Object.keys(data[book]);
}

export async function getVerses(
  version: string,
  book: string,
  chapter: string | number
): Promise<Array<{ verse: string; text: string }>> {
  const data = await loadBibleData(version);
  const chapterData = data[book]?.[chapter];
  if (!chapterData) {
    throw new Error(
      `Chapitre non trouvé: ${book} ${chapter}`
    );
  }
  if (Array.isArray(chapterData)) {
    // Already array of {verse, text}
    return chapterData;
  }
  // Convert object map to array, en forçant text:string
  return Object.entries(chapterData).map(([verse, text]) => ({ verse, text: String(text) }));
}
