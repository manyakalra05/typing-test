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
}));

<!-- 2025-05-08T10:34:02+05:30 -->
<!-- 2025-09-30T05:07:25+05:30 -->
<!-- Update 2024-11-16T06:18:10+05:30 -->
<!-- Update 2025-02-17T18:11:34+05:30 -->