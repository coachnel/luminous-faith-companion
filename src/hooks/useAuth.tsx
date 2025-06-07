import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fonction de nettoyage de l'état d'authentification
export const cleanupAuthState = () => {
  localStorage.removeItem('supabase.auth.token');
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Ajout de journaux pour diagnostiquer l'état d'authentification
  useEffect(() => {
    console.log('Initialisation de l’état d’authentification');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Changement d’état d’authentification:', event, session);
        setSession(session);

        if (session?.user) {
          const { data, error } = await supabase.auth.getUser();
          if (data?.user?.user_metadata) {
            console.log('Mise à jour de l’utilisateur avec les métadonnées:', data.user.user_metadata);
            setUser({ ...session.user, ...data.user.user_metadata });
          } else {
            console.error('Erreur lors de la récupération des métadonnées utilisateur:', error);
            setUser(session.user);
          }
        } else {
          console.log('Aucun utilisateur connecté');
          setUser(null);
        }

        setLoading(false);
      }
    );

    // Obtenir la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session initiale:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Gestion de la redirection après validation email Supabase
    const params = new URLSearchParams(window.location.search);
    if (params.get('email_confirmed') === 'true') {
      // On tente de récupérer la session et de connecter l'utilisateur
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          setLoading(false);
          // Rediriger vers l'accueil
          window.location.href = '/';
        }
      });
    }

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continuer même si cela échoue
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        // Actualisation complète de la page pour un état propre
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continuer même si cela échoue
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name || 'Utilisateur'
          }
        }
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continuer même si cela échoue
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignorer les erreurs
      }
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
      window.location.href = '/auth';
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
