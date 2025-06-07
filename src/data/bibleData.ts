
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

// Export des livres pour utilisation dans les composants
export const bibleBooks = bibleData.books;

// Versets bibliques complets avec des exemples pour chaque livre
export const bibleVerses = [
  // Genèse
  { id: '1', book: 'Genèse', chapter: 1, verse: 1, text: "Au commencement, Dieu créa les cieux et la terre.", version: 'LSG' },
  { id: '2', book: 'Genèse', chapter: 1, verse: 2, text: "La terre était informe et vide : il y avait des ténèbres à la surface de l'abîme, et l'esprit de Dieu se mouvait au-dessus des eaux.", version: 'LSG' },
  { id: '3', book: 'Genèse', chapter: 1, verse: 3, text: "Dieu dit : Que la lumière soit ! Et la lumière fut.", version: 'LSG' },
  
  // Psaumes
  { id: '4', book: 'Psaumes', chapter: 23, verse: 1, text: "L'Éternel est mon berger : je ne manquerai de rien.", version: 'LSG' },
  { id: '5', book: 'Psaumes', chapter: 23, verse: 2, text: "Il me fait reposer dans de verts pâturages, Il me dirige près des eaux paisibles.", version: 'LSG' },
  { id: '6', book: 'Psaumes', chapter: 23, verse: 3, text: "Il restaure mon âme, Il me conduit dans les sentiers de la justice, À cause de son nom.", version: 'LSG' },
  { id: '7', book: 'Psaumes', chapter: 1, verse: 1, text: "Heureux l'homme qui ne marche pas selon le conseil des méchants, Qui ne s'arrête pas sur la voie des pécheurs, Et qui ne s'assied pas en compagnie des moqueurs,", version: 'LSG' },
  { id: '8', book: 'Psaumes', chapter: 1, verse: 2, text: "Mais qui trouve son plaisir dans la loi de l'Éternel, Et qui la médite jour et nuit !", version: 'LSG' },
  { id: '9', book: 'Psaumes', chapter: 1, verse: 3, text: "Il est comme un arbre planté près d'un courant d'eau, Qui donne son fruit en sa saison, Et dont le feuillage ne se flétrit point : Tout ce qu'il fait lui réussit.", version: 'LSG' },
  
  // Jean
  { id: '10', book: 'Jean', chapter: 3, verse: 16, text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.", version: 'LSG' },
  { id: '11', book: 'Jean', chapter: 1, verse: 1, text: "Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu.", version: 'LSG' },
  { id: '12', book: 'Jean', chapter: 1, verse: 14, text: "Et la parole a été faite chair, et elle a habité parmi nous, pleine de grâce et de vérité; et nous avons contemplé sa gloire, une gloire comme la gloire du Fils unique venu du Père.", version: 'LSG' },
  
  // Matthieu
  { id: '13', book: 'Matthieu', chapter: 5, verse: 3, text: "Heureux les pauvres en esprit, car le royaume des cieux est à eux !", version: 'LSG' },
  { id: '14', book: 'Matthieu', chapter: 5, verse: 4, text: "Heureux les affligés, car ils seront consolés !", version: 'LSG' },
  { id: '15', book: 'Matthieu', chapter: 5, verse: 5, text: "Heureux les débonnaires, car ils hériteront la terre !", version: 'LSG' },
  { id: '16', book: 'Matthieu', chapter: 5, verse: 6, text: "Heureux ceux qui ont faim et soif de la justice, car ils seront rassasiés !", version: 'LSG' },
  
  // Proverbes
  { id: '17', book: 'Proverbes', chapter: 3, verse: 5, text: "Confie-toi en l'Éternel de tout ton cœur, Et ne t'appuie pas sur ta sagesse;", version: 'LSG' },
  { id: '18', book: 'Proverbes', chapter: 3, verse: 6, text: "Reconnais-le dans toutes tes voies, Et il aplanira tes sentiers.", version: 'LSG' },
  
  // Romains
  { id: '19', book: 'Romains', chapter: 8, verse: 28, text: "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.", version: 'LSG' },
  { id: '20', book: 'Romains', chapter: 8, verse: 31, text: "Que dirons-nous donc à l'égard de ces choses ? Si Dieu est pour nous, qui sera contre nous ?", version: 'LSG' },
  
  // Philippiens
  { id: '21', book: 'Philippiens', chapter: 4, verse: 13, text: "Je puis tout par celui qui me fortifie.", version: 'LSG' },
  { id: '22', book: 'Philippiens', chapter: 4, verse: 19, text: "Et mon Dieu pourvoira à tous vos besoins selon sa richesse, avec gloire, en Jésus-Christ.", version: 'LSG' },
  
  // Ésaïe
  { id: '23', book: 'Ésaïe', chapter: 40, verse: 31, text: "Mais ceux qui se confient en l'Éternel renouvellent leur force. Ils prennent le vol comme les aigles; Ils courent, et ne se lassent point, Ils marchent, et ne se fatiguent point.", version: 'LSG' },
  { id: '24', book: 'Ésaïe', chapter: 55, verse: 8, text: "Car mes pensées ne sont pas vos pensées, Et vos voies ne sont pas mes voies, Dit l'Éternel.", version: 'LSG' },
  
  // 1 Corinthiens
  { id: '25', book: '1 Corinthiens', chapter: 13, verse: 4, text: "La charité est patiente, elle est pleine de bonté; la charité n'est point envieuse; la charité ne se vante point, elle ne s'enfle point d'orgueil,", version: 'LSG' },
  { id: '26', book: '1 Corinthiens', chapter: 13, verse: 13, text: "Maintenant donc ces trois choses demeurent : la foi, l'espérance, la charité; mais la plus grande de ces choses, c'est la charité.", version: 'LSG' }
];

// Plans de lecture
export const readingPlans = [
  {
    id: 'year',
    name: 'Bible en 1 an',
    description: 'Lisez toute la Bible en 365 jours avec un plan équilibré entre Ancien et Nouveau Testament',
    duration: 365,
    schedule: [
      { day: 1, books: ['Genèse'], chapters: [1, 2, 3] },
      { day: 2, books: ['Genèse'], chapters: [4, 5, 6, 7] },
      { day: 3, books: ['Genèse'], chapters: [8, 9, 10, 11] },
      { day: 4, books: ['Genèse'], chapters: [12, 13, 14, 15] },
      { day: 5, books: ['Genèse'], chapters: [16, 17, 18] },
      { day: 6, books: ['Genèse'], chapters: [19, 20, 21] },
      { day: 7, books: ['Genèse'], chapters: [22, 23, 24] },
      { day: 8, books: ['Matthieu'], chapters: [1, 2] },
      { day: 9, books: ['Matthieu'], chapters: [3, 4] },
      { day: 10, books: ['Matthieu'], chapters: [5, 6] }
    ]
  },
  {
    id: 'psalms',
    name: 'Psaumes en 30 jours',
    description: 'Découvrez la richesse des Psaumes en 30 jours de méditation',
    duration: 30,
    schedule: [
      { day: 1, books: ['Psaumes'], chapters: [1, 2, 3, 4, 5] },
      { day: 2, books: ['Psaumes'], chapters: [6, 7, 8, 9, 10] },
      { day: 3, books: ['Psaumes'], chapters: [11, 12, 13, 14, 15] },
      { day: 4, books: ['Psaumes'], chapters: [16, 17, 18, 19, 20] },
      { day: 5, books: ['Psaumes'], chapters: [21, 22, 23, 24, 25] }
    ]
  },
  {
    id: 'gospels',
    name: 'Les 4 Évangiles',
    description: 'Parcourez la vie de Jésus à travers les quatre Évangiles',
    duration: 90,
    schedule: [
      { day: 1, books: ['Matthieu'], chapters: [1, 2] },
      { day: 2, books: ['Matthieu'], chapters: [3, 4] },
      { day: 3, books: ['Matthieu'], chapters: [5, 6] },
      { day: 4, books: ['Matthieu'], chapters: [7, 8] },
      { day: 5, books: ['Matthieu'], chapters: [9, 10] }
    ]
  }
];

// Défis quotidiens
export const getDailyChallenge = () => {
  const challenges = [
    {
      id: 'prayer',
      title: 'Prière matinale',
      description: 'Commencez votre journée par 5 minutes de prière',
      icon: '🌅',
      type: 'prayer'
    },
    {
      id: 'reading',
      title: 'Lecture inspirante',
      description: 'Lisez un chapitre des Psaumes',
      icon: '📖',
      type: 'reading'
    },
    {
      id: 'kindness',
      title: 'Acte de bonté',
      description: 'Faites un geste bienveillant envers quelqu\'un',
      icon: '💝',
      type: 'kindness'
    },
    {
      id: 'gratitude',
      title: 'Gratitude',
      description: 'Notez 3 choses pour lesquelles vous êtes reconnaissant',
      icon: '🙏',
      type: 'gratitude'
    },
    {
      id: 'meditation',
      title: 'Méditation',
      description: 'Méditez sur un verset biblique pendant 10 minutes',
      icon: '🧘',
      type: 'meditation'
    },
    {
      id: 'forgiveness',
      title: 'Pardon',
      description: 'Pardonnez à quelqu\'un ou demandez pardon',
      icon: '💚',
      type: 'forgiveness'
    },
    {
      id: 'service',
      title: 'Service',
      description: 'Aidez quelqu\'un dans le besoin',
      icon: '🤝',
      type: 'service'
    }
  ];

  const today = new Date();
  const challengeIndex = today.getDate() % challenges.length;
  return challenges[challengeIndex];
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
