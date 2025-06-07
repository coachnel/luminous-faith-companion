// Plans de lecture (conservés si utilisés ailleurs)
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

// Ajout dynamique des versions API
import { dynamicBibleVersions } from '@/lib/bibleApi';

export const bibleVersions = [
  { id: 'LSG', name: 'Louis Segond', language: 'fr' },
  ...dynamicBibleVersions
];
