import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        clientPort: 8080,
      },
    },
    define: {
      // Suppression de __WS_TOKEN__ qui cause des erreurs de syntaxe
      // Les tokens WebSocket seront gérés côté serveur uniquement
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: require('./public/manifest.json'),
        workbox: {
          navigateFallback: '/index.html',
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        },
        devOptions: {
          enabled: true,
        },
        includeAssets: ['favicon.ico', 'placeholder.svg'],
        srcDir: 'src',
        filename: 'sw.ts',
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
