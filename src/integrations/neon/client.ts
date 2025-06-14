
import postgres from 'postgres';

// Configuration Neon avec l'URL PostgreSQL
const NEON_DATABASE_URL = "postgresql://neondb_owner:npg_FXLRCule7BK5@ep-curly-breeze-a8waeret-pooler.eastus2.azure.neon.tech/neondb";

// Client PostgreSQL natif pour Neon
export const neonSql = postgres(NEON_DATABASE_URL, {
  host: 'ep-curly-breeze-a8waeret-pooler.eastus2.azure.neon.tech',
  port: 5432,
  database: 'neondb',
  username: 'neondb_owner',
  password: 'npg_FXLRCule7BK5',
  ssl: 'require',
  // Configuration optimisée pour Neon
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
  // Désactiver les transformations automatiques qui peuvent causer des problèmes
  transform: undefined,
  // Configuration pour une meilleure compatibilité
  prepare: false,
});

// Test de connexion
export const testNeonConnection = async () => {
  try {
    console.log('🔄 Test de connexion à Neon...');
    const result = await neonSql`SELECT NOW() as current_time`;
    console.log('✅ Connexion Neon réussie:', result[0]);
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion Neon:', error);
    return false;
  }
};

// Configuration d'initialisation
console.log('🗄️ Configuration Neon initialisée');
console.log('📊 Supabase (Auth):', ['profiles', 'user_preferences']);
console.log('🗄️ Neon (Data):', ['notes', 'favorite_verses', 'prayer_requests', 'reminders']);
