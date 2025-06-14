
// Client REST pour Neon - Compatible navigateur
const NEON_API_BASE = "https://ep-curly-breeze-a8waeret-pooler.eastus2.azure.neon.tech";
const NEON_DATABASE_URL = "postgresql://neondb_owner:npg_FXLRCule7BK5@ep-curly-breeze-a8waeret-pooler.eastus2.azure.neon.tech/neondb";

// Interface pour les réponses API
interface NeonResponse<T> {
  data: T[];
  error?: string;
}

// Client REST pour Neon utilisant fetch
class NeonRestClient {
  private apiKey: string;
  
  constructor() {
    this.apiKey = 'npg_FXLRCule7BK5'; // Remplacer par variable d'environnement en production
  }

  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      // Pour le moment, utilisons le stockage local comme fallback
      // En production, vous devriez créer une API REST qui se connecte à Neon
      console.log('Neon query (fallback to localStorage):', sql, params);
      
      // Simuler une base de données avec localStorage pour le développement
      const key = this.getStorageKey(sql);
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Neon query error:', error);
      throw error;
    }
  }

  async insert<T>(table: string, data: Partial<T>): Promise<T> {
    try {
      console.log('Neon insert (fallback to localStorage):', table, data);
      
      const id = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      const record = {
        ...data,
        id,
        created_at: timestamp,
        updated_at: timestamp
      } as T;

      const key = `neon_${table}`;
      const stored = localStorage.getItem(key);
      const records = stored ? JSON.parse(stored) : [];
      records.push(record);
      localStorage.setItem(key, JSON.stringify(records));
      
      return record;
    } catch (error) {
      console.error('Neon insert error:', error);
      throw error;
    }
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<void> {
    try {
      console.log('Neon update (fallback to localStorage):', table, id, data);
      
      const key = `neon_${table}`;
      const stored = localStorage.getItem(key);
      const records = stored ? JSON.parse(stored) : [];
      
      const index = records.findIndex((r: any) => r.id === id);
      if (index !== -1) {
        records[index] = {
          ...records[index],
          ...data,
          updated_at: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(records));
      }
    } catch (error) {
      console.error('Neon update error:', error);
      throw error;
    }
  }

  async delete(table: string, id: string): Promise<void> {
    try {
      console.log('Neon delete (fallback to localStorage):', table, id);
      
      const key = `neon_${table}`;
      const stored = localStorage.getItem(key);
      const records = stored ? JSON.parse(stored) : [];
      
      const filtered = records.filter((r: any) => r.id !== id);
      localStorage.setItem(key, JSON.stringify(filtered));
    } catch (error) {
      console.error('Neon delete error:', error);
      throw error;
    }
  }

  async select<T>(table: string, filters: Record<string, any> = {}): Promise<T[]> {
    try {
      console.log('Neon select (fallback to localStorage):', table, filters);
      
      const key = `neon_${table}`;
      const stored = localStorage.getItem(key);
      let records = stored ? JSON.parse(stored) : [];
      
      // Appliquer les filtres
      Object.entries(filters).forEach(([field, value]) => {
        records = records.filter((record: any) => record[field] === value);
      });
      
      // Trier par created_at DESC
      records.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      return records;
    } catch (error) {
      console.error('Neon select error:', error);
      throw error;
    }
  }

  private getStorageKey(sql: string): string {
    // Générer une clé basée sur la requête SQL
    return `neon_query_${btoa(sql).slice(0, 20)}`;
  }
}

export const neonClient = new NeonRestClient();

// Test de connexion (simulation)
export const testNeonConnection = async (): Promise<boolean> => {
  try {
    console.log('🔄 Test de connexion à Neon (mode développement avec localStorage)...');
    console.log('✅ Connexion Neon simulée réussie');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion Neon:', error);
    return false;
  }
};

// Configuration d'initialisation
console.log('🗄️ Configuration Neon initialisée (mode développement)');
console.log('📊 Supabase (Auth):', ['profiles', 'user_preferences']);
console.log('🗄️ Neon (Data - localStorage fallback):', ['notes', 'favorite_verses', 'prayer_requests', 'reminders']);
