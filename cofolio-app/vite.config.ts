import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Only explicitly public app settings can enter the client bundle.
  envPrefix: "PUBLIC_",
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    proxy: { "/api": { target: "http://127.0.0.1:4174", changeOrigin: false } },
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    proxy: { "/api": { target: "http://127.0.0.1:4174", changeOrigin: false } },
  },
});
