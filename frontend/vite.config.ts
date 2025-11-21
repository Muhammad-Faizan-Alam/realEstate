import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add this for SPA routing in production
  build: {
    outDir: "dist",
    rollupOptions: {
      // Ensure proper handling of HTML5 history API
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
  // Important for SPA routing
  base: "/",
}));