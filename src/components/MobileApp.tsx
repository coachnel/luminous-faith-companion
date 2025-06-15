
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from './AuthPage';
import ResponsiveLayout from './ResponsiveLayout';

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

  return <ResponsiveLayout />;
};

export default MobileApp;
