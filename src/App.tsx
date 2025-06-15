
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import MobileApp from './components/MobileApp';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <MobileApp />
            <Toaster />
            <SonnerToaster />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
