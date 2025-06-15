
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Home from '@/components/Home';
import Auth from '@/components/Auth';
import Bible from '@/components/Bible';
import Notes from '@/components/Notes';
import Prayer from '@/components/Prayer';
import ReadingPlans from '@/components/ReadingPlans';
import Profile from '@/components/Profile';
import Discover from '@/components/Discover';
import NotificationSystem from '@/components/NotificationSystem';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/bible" element={<Bible />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/prayer" element={<Prayer />} />
                  <Route path="/plans" element={<ReadingPlans />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Layout>
            } />
          </Routes>
          <NotificationSystem />
          <Toaster 
            position="top-right" 
            expand={true}
            richColors
            closeButton
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
