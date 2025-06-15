
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from './hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import Index from './pages/Index';
import AuthPage from './components/AuthPage';
import NotesApp from './components/NotesApp';
import RichTextNotesApp from './components/RichTextNotesApp';
import CommunityPage from './components/CommunityPage';
import TestimonyPage from './components/TestimonyPage';
import Discover from './components/Discover';
import NotesJournal from './components/NotesJournal';
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

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {user && <Navigation />}
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={user ? <Index /> : <Navigate to="/auth" replace />} />
          <Route 
            path="/journal" 
            element={
              <ProtectedRoute>
                <NotesApp />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/rich-notes" 
            element={
              <ProtectedRoute>
                <RichTextNotesApp />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notes-journal" 
            element={
              <ProtectedRoute>
                <NotesJournal />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/community" 
            element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/testimony" 
            element={
              <ProtectedRoute>
                <TestimonyPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/discover" 
            element={
              <ProtectedRoute>
                <Discover />
              </ProtectedRoute>
            } 
          />
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
