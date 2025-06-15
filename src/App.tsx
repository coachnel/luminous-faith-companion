
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from './hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import Index from './pages/Index';
import AuthPage from './components/AuthPage';
import NotesApp from './components/NotesApp';
import RichTextNotesApp from './components/RichTextNotesApp';
import CommunityPage from './components/CommunityPage';
import TestimonyPage from './components/TestimonyPage';
import Discover from './components/Discover';
import NotesJournal from './components/NotesJournal';
import MobileApp from './components/MobileApp';
import { useAuth } from './hooks/useAuth';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

function AppContent() {
  const { user } = useAuth();

  // Si l'utilisateur est connecté, utilise MobileApp qui contient déjà la navigation
  if (user) {
    return <MobileApp />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>
      <Toaster />
      <SonnerToaster />
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
