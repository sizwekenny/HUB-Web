import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev server proxy to backend to avoid browser CORS issues in local HTTPS mismatch scenarios.
// Adjust target if backend runs elsewhere. Uses environment variable VITE_API_BASE_URL if provided.
const backendTarget = process.env.VITE_API_BASE_URL || 'https://localhost:7022';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    proxy: {
      // All API calls beginning with /api will be proxied to backend; strip /api prefix when forwarding
      '/api': {
        target: backendTarget,
        changeOrigin: true,
        secure: false, // allow self-signed HTTPS during dev
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
