
export interface Translation {
  // Navigation
  dashboard: string;
  bible: string;
  notes: string;
  settings: string;
  prayers: string;
  plans: string;
  notifications: string;
  
  // Actions communes
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  search: string;
  back: string;
  
  // Bible
  oldTestament: string;
  newTestament: string;
  chapter: string;
  verse: string;
  
  // Messages
  loading: string;
  noResults: string;
  error: string;
  success: string;
  
  // Settings
  language: string;
  profile: string;
  theme: string;
  
  // Time
  today: string;
  yesterday: string;
  week: string;
  month: string;
}

export const translations: Record<string, Translation> = {
  fr: {
    // Navigation
    dashboard: 'Tableau de bord',
    bible: 'Bible',
    notes: 'Notes',
    settings: 'Paramètres',
    prayers: 'Prières',
    plans: 'Plans',
    notifications: 'Notifications',
    
    // Actions communes
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    search: 'Rechercher',
    back: 'Retour',
    
    // Bible
    oldTestament: 'Ancien Testament',
    newTestament: 'Nouveau Testament',
    chapter: 'Chapitre',
    verse: 'Verset',
    
    // Messages
    loading: 'Chargement...',
    noResults: 'Aucun résultat',
    error: 'Erreur',
    success: 'Succès',
    
    // Settings
    language: 'Langue',
    profile: 'Profil',
    theme: 'Thème',
    
    // Time
    today: 'Aujourd\'hui',
    yesterday: 'Hier',
    week: 'Cette semaine',
    month: 'Ce mois'
  },
  en: {
    // Navigation
    dashboard: 'Dashboard',
    bible: 'Bible',
    notes: 'Notes',
    settings: 'Settings',
    prayers: 'Prayers',
    plans: 'Plans',
    notifications: 'Notifications',
    
    // Actions communes
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    back: 'Back',
    
    // Bible
    oldTestament: 'Old Testament',
    newTestament: 'New Testament',
    chapter: 'Chapter',
    verse: 'Verse',
    
    // Messages
    loading: 'Loading...',
    noResults: 'No results',
    error: 'Error',
    success: 'Success',
    
    // Settings
    language: 'Language',
    profile: 'Profile',
    theme: 'Theme',
    
    // Time
    today: 'Today',
    yesterday: 'Yesterday',
    week: 'This week',
    month: 'This month'
  },
  es: {
    // Navigation
    dashboard: 'Panel',
    bible: 'Biblia',
    notes: 'Notas',
    settings: 'Configuración',
    prayers: 'Oraciones',
    plans: 'Planes',
    notifications: 'Notificaciones',
    
    // Actions communes
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Añadir',
    search: 'Buscar',
    back: 'Volver',
    
    // Bible
    oldTestament: 'Antiguo Testamento',
    newTestament: 'Nuevo Testamento',
    chapter: 'Capítulo',
    verse: 'Versículo',
    
    // Messages
    loading: 'Cargando...',
    noResults: 'Sin resultados',
    error: 'Error',
    success: 'Éxito',
    
    // Settings
    language: 'Idioma',
    profile: 'Perfil',
    theme: 'Tema',
    
    // Time
    today: 'Hoy',
    yesterday: 'Ayer',
    week: 'Esta semana',
    month: 'Este mes'
  },
  de: {
    // Navigation
    dashboard: 'Dashboard',
    bible: 'Bibel',
    notes: 'Notizen',
    settings: 'Einstellungen',
    prayers: 'Gebete',
    plans: 'Pläne',
    notifications: 'Benachrichtigungen',
    
    // Actions communes
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    search: 'Suchen',
    back: 'Zurück',
    
    // Bible
    oldTestament: 'Altes Testament',
    newTestament: 'Neues Testament',
    chapter: 'Kapitel',
    verse: 'Vers',
    
    // Messages
    loading: 'Laden...',
    noResults: 'Keine Ergebnisse',
    error: 'Fehler',
    success: 'Erfolg',
    
    // Settings
    language: 'Sprache',
    profile: 'Profil',
    theme: 'Thema',
    
    // Time
    today: 'Heute',
    yesterday: 'Gestern',
    week: 'Diese Woche',
    month: 'Dieser Monat'
  }
};

export const useTranslation = (language: string = 'fr') => {
  const t = translations[language] || translations.fr;
  
  return {
    t: (key: keyof Translation) => t[key] || key,
    language,
    availableLanguages: Object.keys(translations)
  };
};
