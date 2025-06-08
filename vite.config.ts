
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Traitement sécurisé du token WS
  const wsToken = process.env.WS_TOKEN || '';
  const safeWsToken = typeof wsToken === 'string' ? wsToken : '';
  
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        clientPort: 8080,
      },
    },
    define: {
      // Correction ultra-robuste pour __WS_TOKEN__ avec validation
      __WS_TOKEN__: JSON.stringify(safeWsToken),
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
