import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Local dev server port
    open: true, // Automatically open in the browser during development
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Proxy API requests to your server during development
        secure: false,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist', // Output directory for production builds
    sourcemap: true, // Optional: Helpful for debugging production issues
  },
  base: './', // Ensures proper relative paths for assets in production
});