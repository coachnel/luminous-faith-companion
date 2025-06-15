
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from './hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthPage from './components/AuthPage';
import MobileApp from './components/MobileApp';
import { useAuth } from './hooks/useAuth';

const queryClient = new QueryClient();

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mx-auto">
            <img 
              src="/lovable-uploads/ee59e58d-a594-4372-b796-33f8edb80c6c.png" 
              alt="Luminous Faith" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-base text-gray-600 font-medium">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <MobileApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/*" element={<AppContent />} />
            </Routes>
          </Router>
          <Toaster />
          <SonnerToaster />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
