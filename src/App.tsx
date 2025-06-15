
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from './hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import MobileApp from './components/MobileApp';

const queryClient = new QueryClient();

function App() {
  return (
    <div id="app-root" className="w-full h-full min-h-screen">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <Router>
              <Routes>
                <Route path="/*" element={<MobileApp />} />
              </Routes>
            </Router>
            <Toaster />
            <SonnerToaster />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
