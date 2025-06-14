
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
      registerType: 'prompt',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // 15 MB
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.bible\.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'bible-api-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 jours
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                return `${request.url}?v=${Date.now()}`;
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 // 1 heure
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 jours
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'lovable-uploads/**/*'],
      manifest: {
        name: 'Luminous Faith Companion',
        short_name: 'Luminous Faith',
        description: 'Compagnon spirituel moderne pour accompagner votre parcours de foi',
        start_url: '/',
        display: 'standalone',
        background_color: '#f5f6fe',
        theme_color: '#4f6df5',
        orientation: 'portrait-primary',
        scope: '/',
        lang: 'fr',
        categories: ['lifestyle', 'education', 'health'],
        icons: [
          {
            src: '/lovable-uploads/ee59e58d-a594-4372-b796-33f8edb80c6c.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/lovable-uploads/ee59e58d-a594-4372-b796-33f8edb80c6c.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/lovable-uploads/ee59e58d-a594-4372-b796-33f8edb80c6c.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Prière',
            short_name: 'Prière',
            description: 'Accès rapide à la section prière',
            url: '/?section=prayer',
            icons: [
              {
                src: '/lovable-uploads/ee59e58d-a594-4372-b796-33f8edb80c6c.png',
                sizes: '96x96',
                type: 'image/png'
              }
            ]
          }
        ]
      },
      devOptions: {
        enabled: true
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
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      external: ['postgres'],
      output: {
        manualChunks: {
          'bible-data': ['@/data/json/fr_apee.json'],
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    }
  }
}));
