
// Bible complète en français (Louis Segond)
export const bibleData = {
  versions: [
    { id: 'lsg', name: 'Louis Segond', language: 'fr' },
    { id: 'niv', name: 'New International Version', language: 'en' },
    { id: 'kjv', name: 'King James Version', language: 'en' }
  ],
  books: [
    // Ancien Testament
    { id: 'genese', name: 'Genèse', testament: 'old', chapters: 50 },
    { id: 'exode', name: 'Exode', testament: 'old', chapters: 40 },
    { id: 'levitique', name: 'Lévitique', testament: 'old', chapters: 27 },
    { id: 'nombres', name: 'Nombres', testament: 'old', chapters: 36 },
    { id: 'deuteronome', name: 'Deutéronome', testament: 'old', chapters: 34 },
    { id: 'josue', name: 'Josué', testament: 'old', chapters: 24 },
    { id: 'juges', name: 'Juges', testament: 'old', chapters: 21 },
    { id: 'ruth', name: 'Ruth', testament: 'old', chapters: 4 },
    { id: '1samuel', name: '1 Samuel', testament: 'old', chapters: 31 },
    { id: '2samuel', name: '2 Samuel', testament: 'old', chapters: 24 },
    { id: '1rois', name: '1 Rois', testament: 'old', chapters: 22 },
    { id: '2rois', name: '2 Rois', testament: 'old', chapters: 25 },
    { id: '1chroniques', name: '1 Chroniques', testament: 'old', chapters: 29 },
    { id: '2chroniques', name: '2 Chroniques', testament: 'old', chapters: 36 },
    { id: 'esdras', name: 'Esdras', testament: 'old', chapters: 10 },
    { id: 'nehemie', name: 'Néhémie', testament: 'old', chapters: 13 },
    { id: 'esther', name: 'Esther', testament: 'old', chapters: 10 },
    { id: 'job', name: 'Job', testament: 'old', chapters: 42 },
    { id: 'psaumes', name: 'Psaumes', testament: 'old', chapters: 150 },
    { id: 'proverbes', name: 'Proverbes', testament: 'old', chapters: 31 },
    { id: 'ecclesiaste', name: 'Ecclésiaste', testament: 'old', chapters: 12 },
    { id: 'cantique', name: 'Cantique des cantiques', testament: 'old', chapters: 8 },
    { id: 'esaie', name: 'Ésaïe', testament: 'old', chapters: 66 },
    { id: 'jeremie', name: 'Jérémie', testament: 'old', chapters: 52 },
    { id: 'lamentations', name: 'Lamentations', testament: 'old', chapters: 5 },
    { id: 'ezechiel', name: 'Ézéchiel', testament: 'old', chapters: 48 },
    { id: 'daniel', name: 'Daniel', testament: 'old', chapters: 12 },
    { id: 'osee', name: 'Osée', testament: 'old', chapters: 14 },
    { id: 'joel', name: 'Joël', testament: 'old', chapters: 3 },
    { id: 'amos', name: 'Amos', testament: 'old', chapters: 9 },
    { id: 'abdias', name: 'Abdias', testament: 'old', chapters: 1 },
    { id: 'jonas', name: 'Jonas', testament: 'old', chapters: 4 },
    { id: 'michee', name: 'Michée', testament: 'old', chapters: 7 },
    { id: 'nahum', name: 'Nahum', testament: 'old', chapters: 3 },
    { id: 'habacuc', name: 'Habacuc', testament: 'old', chapters: 3 },
    { id: 'sophonie', name: 'Sophonie', testament: 'old', chapters: 3 },
    { id: 'aggee', name: 'Aggée', testament: 'old', chapters: 2 },
    { id: 'zacharie', name: 'Zacharie', testament: 'old', chapters: 14 },
    { id: 'malachie', name: 'Malachie', testament: 'old', chapters: 4 },
    
    // Nouveau Testament
    { id: 'matthieu', name: 'Matthieu', testament: 'new', chapters: 28 },
    { id: 'marc', name: 'Marc', testament: 'new', chapters: 16 },
    { id: 'luc', name: 'Luc', testament: 'new', chapters: 24 },
    { id: 'jean', name: 'Jean', testament: 'new', chapters: 21 },
    { id: 'actes', name: 'Actes', testament: 'new', chapters: 28 },
    { id: 'romains', name: 'Romains', testament: 'new', chapters: 16 },
    { id: '1corinthiens', name: '1 Corinthiens', testament: 'new', chapters: 16 },
    { id: '2corinthiens', name: '2 Corinthiens', testament: 'new', chapters: 13 },
    { id: 'galates', name: 'Galates', testament: 'new', chapters: 6 },
    { id: 'ephesiens', name: 'Éphésiens', testament: 'new', chapters: 6 },
    { id: 'philippiens', name: 'Philippiens', testament: 'new', chapters: 4 },
    { id: 'colossiens', name: 'Colossiens', testament: 'new', chapters: 4 },
    { id: '1thessaloniciens', name: '1 Thessaloniciens', testament: 'new', chapters: 5 },
    { id: '2thessaloniciens', name: '2 Thessaloniciens', testament: 'new', chapters: 3 },
    { id: '1timothee', name: '1 Timothée', testament: 'new', chapters: 6 },
    { id: '2timothee', name: '2 Timothée', testament: 'new', chapters: 4 },
    { id: 'tite', name: 'Tite', testament: 'new', chapters: 3 },
    { id: 'philemon', name: 'Philémon', testament: 'new', chapters: 1 },
    { id: 'hebreux', name: 'Hébreux', testament: 'new', chapters: 13 },
    { id: 'jacques', name: 'Jacques', testament: 'new', chapters: 5 },
    { id: '1pierre', name: '1 Pierre', testament: 'new', chapters: 5 },
    { id: '2pierre', name: '2 Pierre', testament: 'new', chapters: 3 },
    { id: '1jean', name: '1 Jean', testament: 'new', chapters: 5 },
    { id: '2jean', name: '2 Jean', testament: 'new', chapters: 1 },
    { id: '3jean', name: '3 Jean', testament: 'new', chapters: 1 },
    { id: 'jude', name: 'Jude', testament: 'new', chapters: 1 },
    { id: 'apocalypse', name: 'Apocalypse', testament: 'new', chapters: 22 }
  ]
};

// Exemples de versets pour chaque livre
export const sampleVerses = {
  genese: {
    1: {
      1: "Au commencement, Dieu créa les cieux et la terre.",
      2: "La terre était informe et vide : il y avait des ténèbres à la surface de l'abîme, et l'esprit de Dieu se mouvait au-dessus des eaux.",
      3: "Dieu dit : Que la lumière soit ! Et la lumière fut."
    }
  },
  psaumes: {
    23: {
      1: "L'Éternel est mon berger : je ne manquerai de rien.",
      2: "Il me fait reposer dans de verts pâturages, Il me dirige près des eaux paisibles.",
      3: "Il restaure mon âme, Il me conduit dans les sentiers de la justice, À cause de son nom."
    },
    1: {
      1: "Heureux l'homme qui ne marche pas selon le conseil des méchants, Qui ne s'arrête pas sur la voie des pécheurs, Et qui ne s'assied pas en compagnie des moqueurs,",
      2: "Mais qui trouve son plaisir dans la loi de l'Éternel, Et qui la médite jour et nuit !",
      3: "Il est comme un arbre planté près d'un courant d'eau, Qui donne son fruit en sa saison, Et dont le feuillage ne se flétrit point : Tout ce qu'il fait lui réussit."
    }
  },
  jean: {
    3: {
      16: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle."
    },
    1: {
      1: "Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu.",
      14: "Et la parole a été faite chair, et elle a habité parmi nous, pleine de grâce et de vérité; et nous avons contemplé sa gloire, une gloire comme la gloire du Fils unique venu du Père."
    }
  },
  matthieu: {
    5: {
      3: "Heureux les pauvres en esprit, car le royaume des cieux est à eux !",
      4: "Heureux les affligés, car ils seront consolés !",
      5: "Heureux les débonnaires, car ils hériteront la terre !",
      6: "Heureux ceux qui ont faim et soif de la justice, car ils seront rassasiés !"
    }
  }
};

export default bibleData;
