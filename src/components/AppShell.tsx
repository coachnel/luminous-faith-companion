
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from './AuthPage';
import MobileApp from './MobileApp';

const AppShell = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-heavenly-50 via-spiritual-50 to-purple-50 flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-full spiritual-gradient flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✝️</span>
          </div>
          <div className="animate-spin w-8 h-8 border-4 border-spiritual-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-spiritual-600 to-heavenly-600">
            Compagnon Spirituel
          </h2>
          <p className="text-spiritual-600">Connexion en cours...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <MobileApp />;
};

export default AppShell;
