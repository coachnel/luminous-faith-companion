
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './registerSW';

console.log('Application démarrée - Version mise à jour');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Force immediate cache clear on startup for development
if (process.env.NODE_ENV === 'development') {
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
        console.log('Cache développement supprimé:', cacheName);
      });
    });
  }
}
