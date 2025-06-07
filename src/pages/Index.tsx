import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/components/AuthPage';
import AppShell from '@/components/AppShell';
import { useEffect } from 'react';

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        console.error('Le chargement prend trop de temps. Vérifiez la connexion ou les erreurs.');
      }, 10000); // 10 secondes

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-heavenly-50 via-spiritual-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-spiritual-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-spiritual-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <AppShell />;
}
