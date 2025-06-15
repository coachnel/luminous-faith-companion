
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const cleanupAuthState = () => {
  try {
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
  } catch (error) {
    console.warn('Erreur lors du nettoyage des données d\'authentification:', error);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Gérer la confirmation d'email depuis l'URL
    const handleEmailConfirmation = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenHash = urlParams.get('token_hash');
      const type = urlParams.get('type');
      
      if (tokenHash && type === 'email') {
        console.log('Confirmation d\'email détectée, traitement en cours...');
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'email'
          });
          
          if (error) {
            console.error('Erreur lors de la confirmation:', error);
          } else {
            console.log('Email confirmé avec succès:', data.user?.email);
            // Nettoyer l'URL et rediriger vers l'application
            window.history.replaceState(null, '', '/');
            // Forcer un rechargement pour s'assurer que l'utilisateur est connecté
            window.location.reload();
          }
        } catch (error) {
          console.error('Erreur inattendue lors de la confirmation:', error);
        }
      }
    };

    // Configuration de l'écouteur d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Événement auth:', event, session?.user?.email);
        
        // Mise à jour immédiate de l'état
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('Utilisateur connecté avec succès:', session.user.email);
          
          // Si l'utilisateur vient de confirmer son email, le rediriger vers l'app
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('type') === 'email') {
            console.log('Redirection après confirmation d\'email');
            window.history.replaceState(null, '', '/');
          }
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('Utilisateur déconnecté');
          cleanupAuthState();
        }
        
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token rafraîchi automatiquement');
        }
        
        setLoading(false);
      }
    );

    // Vérifier la session initiale avec persistance activée
    const initializeAuth = async () => {
      if (!mounted) return;
      
      try {
        // D'abord, gérer une éventuelle confirmation d'email
        await handleEmailConfirmation();
        
        // Ensuite, vérifier la session seulement si pas de confirmation en cours
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.get('token_hash')) {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Erreur lors de la récupération de la session:', error);
          } else {
            console.log('Session initiale récupérée:', session?.user?.email || 'aucune session');
          }
          
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Tentative de connexion pour:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Erreur de connexion:', error.message);
        return { error };
      }
      
      console.log('Connexion réussie pour:', data.user?.email);
      return { error: null };
      
    } catch (error) {
      console.error('Erreur inattendue lors de la connexion:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      console.log('Tentative d\'inscription pour:', email);
      
      // URL de redirection après confirmation d'email
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name || 'Utilisateur'
          }
        }
      });

      if (error) {
        console.error('Erreur d\'inscription:', error.message);
        return { error };
      }

      console.log('Inscription réussie pour:', data.user?.email);
      console.log('Email de confirmation envoyé');
      return { error: null };
      
    } catch (error) {
      console.error('Erreur inattendue lors de l\'inscription:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Déconnexion en cours...');
      
      await supabase.auth.signOut();
      cleanupAuthState();
      
      setUser(null);
      setSession(null);
      
      console.log('Déconnexion terminée avec succès');
      
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
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
