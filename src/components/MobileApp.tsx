
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from './AuthPage';
import ModernDashboard from './ModernDashboard';

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

  // Rétablir l'affichage du tableau de bord principal après la connexion
  const handleNavigate = (path: string) => {
    console.warn(`Navigation demandée vers : ${path}. Le routage doit être configuré.`);
  };

  return <ModernDashboard onNavigate={handleNavigate} />;
};

export default MobileApp;
