import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: true, // default is true, but make sure
    assetsInlineLimit: 0, // force assets (like fonts/css) to be emitted as files
    rollupOptions: {
      input: './index.html',
      output: {
        format: 'iife', //  nécessaire pour navigateur/JSP
        entryFileNames: 'assets/main.[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/main.[hash][extname]'; // forces CSS to match "main.*.css"
          }
          return 'assets/[name].[hash][extname]';
        }
      }
    }
  },
  server: {
    host: "::",
    port: 3000,
    headers: {
      'X-Frame-Options': 'ALLOWALL',
      'Content-Security-Policy': "frame-ancestors 'self' *"
    }
  },
  plugins: [
    react(),
    tsconfigPaths(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
}));