
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB au lieu de 2 MB par défaut
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.bible\.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'bible-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60 // 1 jour
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Compagnon Spirituel',
        short_name: 'Spirituel',
        description: 'Votre compagnon pour la lecture biblique et la prière',
        theme_color: '#8B5CF6',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['postgres']
  },
  build: {
    chunkSizeWarningLimit: 2000, // Augmente la limite d'avertissement à 2 MB
    rollupOptions: {
      external: ['postgres'],
      output: {
        manualChunks: {
          // Séparer les données bibliques dans un chunk séparé
          'bible-data': ['@/data/json/fr_apee.json'],
          // Séparer les vendors lourds
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    }
  }
}));
