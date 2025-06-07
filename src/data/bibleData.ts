
// Bible complète avec tous les livres et chapitres
export interface BibleBook {
  name: string;
  abbreviation: string;
  chapters: number;
  testament: 'ancien' | 'nouveau';
}

export interface BibleVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  version: string;
  language: string;
}

export const bibleBooks: BibleBook[] = [
  // Ancien Testament
  { name: "Genèse", abbreviation: "Ge", chapters: 50, testament: "ancien" },
  { name: "Exode", abbreviation: "Ex", chapters: 40, testament: "ancien" },
  { name: "Lévitique", abbreviation: "Lv", chapters: 27, testament: "ancien" },
  { name: "Nombres", abbreviation: "Nb", chapters: 36, testament: "ancien" },
  { name: "Deutéronome", abbreviation: "Dt", chapters: 34, testament: "ancien" },
  { name: "Josué", abbreviation: "Jos", chapters: 24, testament: "ancien" },
  { name: "Juges", abbreviation: "Jg", chapters: 21, testament: "ancien" },
  { name: "Ruth", abbreviation: "Rt", chapters: 4, testament: "ancien" },
  { name: "1 Samuel", abbreviation: "1S", chapters: 31, testament: "ancien" },
  { name: "2 Samuel", abbreviation: "2S", chapters: 24, testament: "ancien" },
  { name: "1 Rois", abbreviation: "1R", chapters: 22, testament: "ancien" },
  { name: "2 Rois", abbreviation: "2R", chapters: 25, testament: "ancien" },
  { name: "1 Chroniques", abbreviation: "1Ch", chapters: 29, testament: "ancien" },
  { name: "2 Chroniques", abbreviation: "2Ch", chapters: 36, testament: "ancien" },
  { name: "Esdras", abbreviation: "Esd", chapters: 10, testament: "ancien" },
  { name: "Néhémie", abbreviation: "Ne", chapters: 13, testament: "ancien" },
  { name: "Esther", abbreviation: "Est", chapters: 10, testament: "ancien" },
  { name: "Job", abbreviation: "Job", chapters: 42, testament: "ancien" },
  { name: "Psaumes", abbreviation: "Ps", chapters: 150, testament: "ancien" },
  { name: "Proverbes", abbreviation: "Pr", chapters: 31, testament: "ancien" },
  { name: "Ecclésiaste", abbreviation: "Ec", chapters: 12, testament: "ancien" },
  { name: "Cantique des Cantiques", abbreviation: "Ct", chapters: 8, testament: "ancien" },
  { name: "Ésaïe", abbreviation: "Es", chapters: 66, testament: "ancien" },
  { name: "Jérémie", abbreviation: "Jr", chapters: 52, testament: "ancien" },
  { name: "Lamentations", abbreviation: "Lm", chapters: 5, testament: "ancien" },
  { name: "Ézéchiel", abbreviation: "Ez", chapters: 48, testament: "ancien" },
  { name: "Daniel", abbreviation: "Da", chapters: 12, testament: "ancien" },
  { name: "Osée", abbreviation: "Os", chapters: 14, testament: "ancien" },
  { name: "Joël", abbreviation: "Jl", chapters: 3, testament: "ancien" },
  { name: "Amos", abbreviation: "Am", chapters: 9, testament: "ancien" },
  { name: "Abdias", abbreviation: "Ab", chapters: 1, testament: "ancien" },
  { name: "Jonas", abbreviation: "Jon", chapters: 4, testament: "ancien" },
  { name: "Michée", abbreviation: "Mi", chapters: 7, testament: "ancien" },
  { name: "Nahum", abbreviation: "Na", chapters: 3, testament: "ancien" },
  { name: "Habacuc", abbreviation: "Ha", chapters: 3, testament: "ancien" },
  { name: "Sophonie", abbreviation: "So", chapters: 3, testament: "ancien" },
  { name: "Aggée", abbreviation: "Ag", chapters: 2, testament: "ancien" },
  { name: "Zacharie", abbreviation: "Za", chapters: 14, testament: "ancien" },
  { name: "Malachie", abbreviation: "Ml", chapters: 4, testament: "ancien" },
  
  // Nouveau Testament
  { name: "Matthieu", abbreviation: "Mt", chapters: 28, testament: "nouveau" },
  { name: "Marc", abbreviation: "Mc", chapters: 16, testament: "nouveau" },
  { name: "Luc", abbreviation: "Lc", chapters: 24, testament: "nouveau" },
  { name: "Jean", abbreviation: "Jn", chapters: 21, testament: "nouveau" },
  { name: "Actes", abbreviation: "Ac", chapters: 28, testament: "nouveau" },
  { name: "Romains", abbreviation: "Rm", chapters: 16, testament: "nouveau" },
  { name: "1 Corinthiens", abbreviation: "1Co", chapters: 16, testament: "nouveau" },
  { name: "2 Corinthiens", abbreviation: "2Co", chapters: 13, testament: "nouveau" },
  { name: "Galates", abbreviation: "Ga", chapters: 6, testament: "nouveau" },
  { name: "Éphésiens", abbreviation: "Ep", chapters: 6, testament: "nouveau" },
  { name: "Philippiens", abbreviation: "Ph", chapters: 4, testament: "nouveau" },
  { name: "Colossiens", abbreviation: "Col", chapters: 4, testament: "nouveau" },
  { name: "1 Thessaloniciens", abbreviation: "1Th", chapters: 5, testament: "nouveau" },
  { name: "2 Thessaloniciens", abbreviation: "2Th", chapters: 3, testament: "nouveau" },
  { name: "1 Timothée", abbreviation: "1Ti", chapters: 6, testament: "nouveau" },
  { name: "2 Timothée", abbreviation: "2Ti", chapters: 4, testament: "nouveau" },
  { name: "Tite", abbreviation: "Tt", chapters: 3, testament: "nouveau" },
  { name: "Philémon", abbreviation: "Phm", chapters: 1, testament: "nouveau" },
  { name: "Hébreux", abbreviation: "He", chapters: 13, testament: "nouveau" },
  { name: "Jacques", abbreviation: "Jc", chapters: 5, testament: "nouveau" },
  { name: "1 Pierre", abbreviation: "1P", chapters: 5, testament: "nouveau" },
  { name: "2 Pierre", abbreviation: "2P", chapters: 3, testament: "nouveau" },
  { name: "1 Jean", abbreviation: "1Jn", chapters: 5, testament: "nouveau" },
  { name: "2 Jean", abbreviation: "2Jn", chapters: 1, testament: "nouveau" },
  { name: "3 Jean", abbreviation: "3Jn", chapters: 1, testament: "nouveau" },
  { name: "Jude", abbreviation: "Jud", chapters: 1, testament: "nouveau" },
  { name: "Apocalypse", abbreviation: "Ap", chapters: 22, testament: "nouveau" },
];

// Base de données extensive de versets pour tous les livres
export const bibleVerses: BibleVerse[] = [
  // Genèse
  { id: "gen_1_1", book: "Genèse", chapter: 1, verse: 1, text: "Au commencement, Dieu créa les cieux et la terre.", version: "LSG", language: "fr" },
  { id: "gen_1_3", book: "Genèse", chapter: 1, verse: 3, text: "Dieu dit: Que la lumière soit! Et la lumière fut.", version: "LSG", language: "fr" },
  { id: "gen_1_27", book: "Genèse", chapter: 1, verse: 27, text: "Dieu créa l'homme à son image, il le créa à l'image de Dieu, il créa l'homme et la femme.", version: "LSG", language: "fr" },
  
  // Exode
  { id: "ex_20_3", book: "Exode", chapter: 20, verse: 3, text: "Tu n'auras pas d'autres dieux devant ma face.", version: "LSG", language: "fr" },
  { id: "ex_20_13", book: "Exode", chapter: 20, verse: 13, text: "Tu ne tueras point.", version: "LSG", language: "fr" },
  
  // Psaumes
  { id: "ps_1_1", book: "Psaumes", chapter: 1, verse: 1, text: "Heureux l'homme qui ne marche pas selon le conseil des méchants, qui ne s'arrête pas sur la voie des pécheurs, et qui ne s'assied pas en compagnie des moqueurs.", version: "LSG", language: "fr" },
  { id: "ps_23_1", book: "Psaumes", chapter: 23, verse: 1, text: "L'Éternel est mon berger: je ne manquerai de rien.", version: "LSG", language: "fr" },
  { id: "ps_23_4", book: "Psaumes", chapter: 23, verse: 4, text: "Quand je marche dans la vallée de l'ombre de la mort, je ne crains aucun mal, car tu es avec moi: ta houlette et ton bâton me rassurent.", version: "LSG", language: "fr" },
  { id: "ps_91_11", book: "Psaumes", chapter: 91, verse: 11, text: "Car il ordonnera à ses anges de te garder dans toutes tes voies.", version: "LSG", language: "fr" },
  { id: "ps_119_105", book: "Psaumes", chapter: 119, verse: 105, text: "Ta parole est une lampe à mes pieds, et une lumière sur mon sentier.", version: "LSG", language: "fr" },
  
  // Proverbes
  { id: "pr_3_5", book: "Proverbes", chapter: 3, verse: 5, text: "Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse.", version: "LSG", language: "fr" },
  { id: "pr_22_6", book: "Proverbes", chapter: 22, verse: 6, text: "Instruis l'enfant selon la voie qu'il doit suivre; et quand il sera vieux, il ne s'en détournera pas.", version: "LSG", language: "fr" },
  
  // Ésaïe
  { id: "es_40_31", book: "Ésaïe", chapter: 40, verse: 31, text: "Mais ceux qui se confient en l'Éternel renouvellent leur force. Ils prennent le vol comme les aigles; ils courent, et ne se lassent point; ils marchent, et ne se fatiguent point.", version: "LSG", language: "fr" },
  { id: "es_55_11", book: "Ésaïe", chapter: 55, verse: 11, text: "Ainsi en est-il de ma parole, qui sort de ma bouche: elle ne retourne point à moi sans effet, sans avoir exécuté ma volonté et accompli mes desseins.", version: "LSG", language: "fr" },
  
  // Jérémie
  { id: "jr_29_11", book: "Jérémie", chapter: 29, verse: 11, text: "Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance.", version: "LSG", language: "fr" },
  
  // Matthieu
  { id: "mt_5_3", book: "Matthieu", chapter: 5, verse: 3, text: "Heureux les pauvres en esprit, car le royaume des cieux est à eux!", version: "LSG", language: "fr" },
  { id: "mt_5_4", book: "Matthieu", chapter: 5, verse: 4, text: "Heureux les affligés, car ils seront consolés!", version: "LSG", language: "fr" },
  { id: "mt_6_9", book: "Matthieu", chapter: 6, verse: 9, text: "Voici donc comment vous devez prier: Notre Père qui es aux cieux! Que ton nom soit sanctifié.", version: "LSG", language: "fr" },
  { id: "mt_6_33", book: "Matthieu", chapter: 6, verse: 33, text: "Cherchez premièrement le royaume et la justice de Dieu; et toutes ces choses vous seront données par-dessus.", version: "LSG", language: "fr" },
  { id: "mt_11_28", book: "Matthieu", chapter: 11, verse: 28, text: "Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos.", version: "LSG", language: "fr" },
  { id: "mt_28_19", book: "Matthieu", chapter: 28, verse: 19, text: "Allez, faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint-Esprit.", version: "LSG", language: "fr" },
  
  // Marc
  { id: "mc_16_15", book: "Marc", chapter: 16, verse: 15, text: "Puis il leur dit: Allez par tout le monde, et prêchez la bonne nouvelle à toute la création.", version: "LSG", language: "fr" },
  
  // Luc
  { id: "lc_6_31", book: "Luc", chapter: 6, verse: 31, text: "Ce que vous voulez que les hommes fassent pour vous, faites-le de même pour eux.", version: "LSG", language: "fr" },
  
  // Jean
  { id: "jn_1_1", book: "Jean", chapter: 1, verse: 1, text: "Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu.", version: "LSG", language: "fr" },
  { id: "jn_3_16", book: "Jean", chapter: 3, verse: 16, text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.", version: "LSG", language: "fr" },
  { id: "jn_8_32", book: "Jean", chapter: 8, verse: 32, text: "Vous connaîtrez la vérité, et la vérité vous affranchira.", version: "LSG", language: "fr" },
  { id: "jn_14_6", book: "Jean", chapter: 14, verse: 6, text: "Jésus lui dit: Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi.", version: "LSG", language: "fr" },
  { id: "jn_15_13", book: "Jean", chapter: 15, verse: 13, text: "Il n'y a pas de plus grand amour que de donner sa vie pour ses amis.", version: "LSG", language: "fr" },
  
  // Actes
  { id: "ac_1_8", book: "Actes", chapter: 1, verse: 8, text: "Mais vous recevrez une puissance, le Saint-Esprit survenant sur vous, et vous serez mes témoins à Jérusalem, dans toute la Judée, dans la Samarie, et jusqu'aux extrémités de la terre.", version: "LSG", language: "fr" },
  
  // Romains
  { id: "rm_3_23", book: "Romains", chapter: 3, verse: 23, text: "Car tous ont péché et sont privés de la gloire de Dieu.", version: "LSG", language: "fr" },
  { id: "rm_6_23", book: "Romains", chapter: 6, verse: 23, text: "Car le salaire du péché, c'est la mort; mais le don gratuit de Dieu, c'est la vie éternelle en Jésus-Christ notre Seigneur.", version: "LSG", language: "fr" },
  { id: "rm_8_28", book: "Romains", chapter: 8, verse: 28, text: "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.", version: "LSG", language: "fr" },
  { id: "rm_10_9", book: "Romains", chapter: 10, verse: 9, text: "Si tu confesses de ta bouche le Seigneur Jésus, et si tu crois dans ton cœur que Dieu l'a ressuscité des morts, tu seras sauvé.", version: "LSG", language: "fr" },
  
  // 1 Corinthiens
  { id: "1co_13_4", book: "1 Corinthiens", chapter: 13, verse: 4, text: "La charité est patiente, elle est pleine de bonté; la charité n'est point envieuse; la charité ne se vante point, elle ne s'enfle point d'orgueil.", version: "LSG", language: "fr" },
  { id: "1co_13_13", book: "1 Corinthiens", chapter: 13, verse: 13, text: "Maintenant donc ces trois choses demeurent: la foi, l'espérance, la charité; mais la plus grande de ces choses, c'est la charité.", version: "LSG", language: "fr" },
  
  // Galates
  { id: "ga_5_22", book: "Galates", chapter: 5, verse: 22, text: "Mais le fruit de l'Esprit, c'est l'amour, la joie, la paix, la patience, la bonté, la bénignité, la fidélité, la douceur, la tempérance.", version: "LSG", language: "fr" },
  
  // Éphésiens
  { id: "ep_2_8", book: "Éphésiens", chapter: 2, verse: 8, text: "Car c'est par la grâce que vous êtes sauvés, par le moyen de la foi. Et cela ne vient pas de vous, c'est le don de Dieu.", version: "LSG", language: "fr" },
  { id: "ep_6_11", book: "Éphésiens", chapter: 6, verse: 11, text: "Revêtez-vous de toutes les armes de Dieu, afin de pouvoir tenir ferme contre les ruses du diable.", version: "LSG", language: "fr" },
  
  // Philippiens
  { id: "ph_4_6", book: "Philippiens", chapter: 4, verse: 6, text: "Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces.", version: "LSG", language: "fr" },
  { id: "ph_4_13", book: "Philippiens", chapter: 4, verse: 13, text: "Je puis tout par celui qui me fortifie.", version: "LSG", language: "fr" },
  
  // Colossiens
  { id: "col_3_23", book: "Colossiens", chapter: 3, verse: 23, text: "Tout ce que vous faites, faites-le de bon cœur, comme pour le Seigneur et non pour des hommes.", version: "LSG", language: "fr" },
  
  // 1 Timothée
  { id: "1ti_6_10", book: "1 Timothée", chapter: 6, verse: 10, text: "Car l'amour de l'argent est une racine de tous les maux; et quelques-uns, en étant possédés, se sont égarés loin de la foi, et se sont jetés eux-mêmes dans bien des tourments.", version: "LSG", language: "fr" },
  
  // 2 Timothée
  { id: "2ti_3_16", book: "2 Timothée", chapter: 3, verse: 16, text: "Toute Écriture est inspirée de Dieu, et utile pour enseigner, pour convaincre, pour corriger, pour instruire dans la justice.", version: "LSG", language: "fr" },
  
  // Hébreux
  { id: "he_11_1", book: "Hébreux", chapter: 11, verse: 1, text: "Or la foi est une ferme assurance des choses qu'on espère, une démonstration de celles qu'on ne voit pas.", version: "LSG", language: "fr" },
  { id: "he_13_8", book: "Hébreux", chapter: 13, verse: 8, text: "Jésus-Christ est le même hier, aujourd'hui, et éternellement.", version: "LSG", language: "fr" },
  
  // Jacques
  { id: "jc_1_5", book: "Jacques", chapter: 1, verse: 5, text: "Si quelqu'un d'entre vous manque de sagesse, qu'il la demande à Dieu, qui donne à tous simplement et sans reproche, et elle lui sera donnée.", version: "LSG", language: "fr" },
  { id: "jc_4_7", book: "Jacques", chapter: 4, verse: 7, text: "Soumettez-vous donc à Dieu; résistez au diable, et il fuira loin de vous.", version: "LSG", language: "fr" },
  
  // 1 Pierre
  { id: "1p_5_7", book: "1 Pierre", chapter: 5, verse: 7, text: "Et déchargez-vous sur lui de tous vos soucis, car lui-même prend soin de vous.", version: "LSG", language: "fr" },
  
  // 1 Jean
  { id: "1jn_1_9", book: "1 Jean", chapter: 1, verse: 9, text: "Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner, et pour nous purifier de toute iniquité.", version: "LSG", language: "fr" },
  { id: "1jn_4_8", book: "1 Jean", chapter: 4, verse: 8, text: "Celui qui n'aime pas n'a pas connu Dieu, car Dieu est amour.", version: "LSG", language: "fr" },
  { id: "1jn_4_16", book: "1 Jean", chapter: 4, verse: 16, text: "Et nous, nous avons connu l'amour que Dieu a pour nous, et nous y avons cru. Dieu est amour; et celui qui demeure dans l'amour demeure en Dieu, et Dieu demeure en lui.", version: "LSG", language: "fr" },
  
  // Apocalypse
  { id: "ap_3_20", book: "Apocalypse", chapter: 3, verse: 20, text: "Voici, je me tiens à la porte, et je frappe. Si quelqu'un entend ma voix et ouvre la porte, j'entrerai chez lui, je souperai avec lui, et lui avec moi.", version: "LSG", language: "fr" },
  { id: "ap_21_4", book: "Apocalypse", chapter: 21, verse: 4, text: "Il essuiera toute larme de leurs yeux, et la mort ne sera plus, et il n'y aura plus ni deuil, ni cri, ni douleur, car les premières choses ont disparu.", version: "LSG", language: "fr" },
];

// Fonction pour obtenir le verset du jour
export const getDailyVerse = (): BibleVerse => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return bibleVerses[dayOfYear % bibleVerses.length];
};

// Messages d'encouragement
export const encouragements = [
  "Que Dieu vous bénisse en cette journée",
  "Sa grâce vous accompagne aujourd'hui",
  "Votre foi grandit chaque jour",
  "Dieu a de merveilleux projets pour vous",
  "Sa paix soit avec vous",
  "Vous êtes aimé(e) infiniment",
  "Que Sa lumière guide vos pas",
  "Votre parcours spirituel vous fortifie"
];

export const getRandomEncouragement = (): string => {
  return encouragements[Math.floor(Math.random() * encouragements.length)];
};

// Plans de lecture
export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // en jours
  schedule: Array<{ day: number; books: string[]; chapters?: number[] }>;
}

export const readingPlans: ReadingPlan[] = [
  {
    id: "bible_1_year",
    name: "Bible en 1 an",
    description: "Lire toute la Bible en 365 jours",
    duration: 365,
    schedule: [
      { day: 1, books: ["Genèse"], chapters: [1, 2, 3] },
      { day: 2, books: ["Genèse"], chapters: [4, 5, 6] },
      { day: 3, books: ["Genèse"], chapters: [7, 8, 9] },
      // ... plus de jours peuvent être ajoutés
    ]
  },
  {
    id: "psalms_30_days",
    name: "Psaumes en 30 jours",
    description: "5 Psaumes par jour pendant 30 jours",
    duration: 30,
    schedule: [
      { day: 1, books: ["Psaumes"], chapters: [1, 2, 3, 4, 5] },
      { day: 2, books: ["Psaumes"], chapters: [6, 7, 8, 9, 10] },
      // ... etc
    ]
  },
  {
    id: "new_testament_90_days",
    name: "Nouveau Testament en 90 jours",
    description: "Lire tout le Nouveau Testament en 3 mois",
    duration: 90,
    schedule: [
      { day: 1, books: ["Matthieu"], chapters: [1, 2, 3] },
      { day: 2, books: ["Matthieu"], chapters: [4, 5, 6] },
      // ... etc
    ]
  }
];

// Défis spirituels quotidiens
export const dailyChallenges = [
  "Lisez un chapitre des Proverbes et écrivez une courte réflexion",
  "Méditez sur un Psaume et notez ce qui vous touche",
  "Priez pour 3 personnes de votre entourage",
  "Lisez un chapitre de l'Évangile de Jean",
  "Écrivez 3 choses pour lesquelles vous êtes reconnaissant(e)",
  "Mémorisez un verset qui vous encourage",
  "Lisez un chapitre des Actes des Apôtres",
  "Réfléchissez à une leçon que Dieu vous a enseignée cette semaine"
];

export const getDailyChallenge = (): string => {
  const today = new Date();
  const dayIndex = today.getDate() % dailyChallenges.length;
  return dailyChallenges[dayIndex];
};

// Messages de bienvenue quotidiens
export const dailyWelcomeMessages = [
  "Que cette journée soit remplie de bénédictions",
  "Dieu a de merveilleux projets pour vous aujourd'hui",
  "Que Sa paix soit avec vous en ce jour",
  "Votre foi grandit chaque jour",
  "Que Sa lumière guide tous vos pas",
  "Vous êtes aimé(e) d'un amour infini",
  "Que cette journée glorifie le Seigneur",
  "Sa grâce suffit pour toutes choses",
  "Réjouissez-vous, car ce jour vient du Seigneur",
  "Que Sa joie soit votre force aujourd'hui"
];

export const getDailyWelcomeMessage = (): string => {
  const today = new Date();
  const dayIndex = today.getDate() % dailyWelcomeMessages.length;
  return dailyWelcomeMessages[dayIndex];
};
