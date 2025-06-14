
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
  
  // Tables de données métier - migrent vers Neon
  { table: 'notes', source: 'neon', description: 'Notes et journaux' },
  { table: 'favorite_verses', source: 'neon', description: 'Versets favoris' },
  { table: 'prayer_requests', source: 'neon', description: 'Demandes de prière' },
  { table: 'reminders', source: 'neon', description: 'Rappels et notifications' },
];

export function getDataSource(table: string): DataSource {
  const route = DATA_ROUTES.find(r => r.table === table);
  return route?.source || 'supabase';
}

export function getTablesBySource(source: DataSource): string[] {
  return DATA_ROUTES.filter(r => r.source === source).map(r => r.table);
}

// Log de la configuration
export function logDataRoutingConfig() {
  console.log('🔄 Configuration du routage des données:');
  console.log('📊 Supabase (Auth):', getTablesBySource('supabase'));
  console.log('🗄️ Neon (Data):', getTablesBySource('neon'));
}
