
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { BibleProvider } from "./contexts/BibleContext";
import BibleView from "./components/BibleView";
import EnhancedBibleView from "./components/EnhancedBibleView";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import EmailConfirmation from "./components/EmailConfirmation";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary>
                  <Index />
                </ErrorBoundary>
              }
            />
            <Route
              path="/bible"
              element={
                <ErrorBoundary>
                  <BibleProvider>
                    <BibleView />
                  </BibleProvider>
                </ErrorBoundary>
              }
            />
            <Route
              path="/bible-neon"
              element={
                <ErrorBoundary>
                  <EnhancedBibleView />
                </ErrorBoundary>
              }
            />
            <Route
              path="/confirm"
              element={
                <ErrorBoundary>
                  <EmailConfirmation />
                </ErrorBoundary>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
