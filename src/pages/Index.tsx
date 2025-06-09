
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
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-heavenly-50 via-spiritual-50 to-purple-50 flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✝️</span>
          </div>
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            Compagnon Spirituel
          </h2>
          <p className="text-purple-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return <AppShell />;
}
