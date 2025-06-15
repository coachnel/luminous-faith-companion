
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from './AuthPage';

const MobileApp = () => {
  const { user, loading } = useAuth();

  console.log('[MobileApp] État:', { user: !!user, loading });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Version ultra-simplifiée pour tester
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-4">
            ✅ Connexion réussie !
          </h1>
          <p className="text-gray-600 mb-4">
            Utilisateur : {user?.email || 'Email non disponible'}
          </p>
          <p className="text-sm text-green-600">
            L'application fonctionne correctement sur mobile.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileApp;
