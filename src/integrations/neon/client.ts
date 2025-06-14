
import { createClient } from '@supabase/supabase-js';

// Configuration Neon avec l'URL PostgreSQL
const NEON_DATABASE_URL = "postgresql://neondb_owner:npg_FXLRCule7BK5@ep-curly-breeze-a8waeret-pooler.eastus2.azure.neon.tech/neondb";

// Client Neon utilisant l'API Supabase avec PostgreSQL
export const neonClient = createClient(
  // Nous utilisons une URL factice car nous nous connectons directement à PostgreSQL
  'https://neon-placeholder.supabase.co',
  'placeholder-key',
  {
    db: {
      schema: 'public',
    },
    auth: {
      persistSession: false,
    },
    global: {
      fetch: (url, options = {}) => {
        // Rediriger toutes les requêtes vers Neon
        const neonUrl = url.toString().replace('https://neon-placeholder.supabase.co', '');
        return fetch(`${NEON_DATABASE_URL}${neonUrl}`, options);
      },
    },
  }
);

// Configuration alternative avec client PostgreSQL natif
import postgres from 'postgres';

export const neonSql = postgres(NEON_DATABASE_URL, {
  host: 'ep-curly-breeze-a8waeret-pooler.eastus2.azure.neon.tech',
  port: 5432,
  database: 'neondb',
  username: 'neondb_owner',
  password: 'npg_FXLRCule7BK5',
  ssl: 'require',
});
