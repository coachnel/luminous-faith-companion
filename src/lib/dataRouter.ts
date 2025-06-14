
// Gestionnaire de routage des données entre Supabase (Auth) et Neon (Data)
export type DataSource = 'supabase' | 'neon';

export interface DataRoute {
  table: string;
  source: DataSource;
  description: string;
}

// Configuration du routage des données
export const DATA_ROUTES: DataRoute[] = [
  // Tables d'authentification - restent sur Supabase
  { table: 'profiles', source: 'supabase', description: 'Profils utilisateurs' },
  { table: 'user_preferences', source: 'supabase', description: 'Préférences utilisateurs' },
  
  // Tables de données métier - peuvent migrer vers Neon si besoin
  { table: 'notes', source: 'neon', description: 'Notes et journaux' },
  { table: 'favorite_verses', source: 'neon', description: 'Versets favoris' },
  { table: 'prayer_requests', source: 'neon', description: 'Demandes de prière' },
  { table: 'reminders', source: 'neon', description: 'Rappels et notifications' },
  
  // Nouvelles tables pour la progression et défis - par défaut sur Supabase, migration Neon possible
  { table: 'reading_plan_progress', source: 'supabase', description: 'Progression plans de lecture' },
  { table: 'bible_reading_progress', source: 'supabase', description: 'Progression lecture Bible' },
  { table: 'spiritual_challenges', source: 'supabase', description: 'Défis spirituels' },
  { table: 'challenge_progress', source: 'supabase', description: 'Suivi défis quotidiens' },
];

export function getDataSource(table: string): DataSource {
  const route = DATA_ROUTES.find(r => r.table === table);
  return route?.source || 'supabase';
}

export function getTablesBySource(source: DataSource): string[] {
  return DATA_ROUTES.filter(r => r.source === source).map(r => r.table);
}

// Fonction pour basculer une table vers Neon
export function migrateTableToNeon(tableName: string): void {
  const route = DATA_ROUTES.find(r => r.table === tableName);
  if (route) {
    route.source = 'neon';
    console.log(`📊 Table ${tableName} migrée vers Neon`);
  }
}

// Log de la configuration
export function logDataRoutingConfig() {
  console.log('🔄 Configuration du routage des données:');
  console.log('📊 Supabase (Auth + Progression):', getTablesBySource('supabase'));
  console.log('🗄️ Neon (Data - localStorage en développement):', getTablesBySource('neon'));
}

// Initialiser la configuration au chargement
logDataRoutingConfig();
