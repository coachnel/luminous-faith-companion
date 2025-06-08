// Ce fichier est généré pour enregistrer le service worker PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      // Optionnel : log en cas d'échec
      // console.error('ServiceWorker registration failed:', err);
    });
  });
}
