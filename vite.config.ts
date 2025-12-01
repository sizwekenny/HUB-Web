import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Backend target from environment variable, with fallback
const backendTarget = process.env.VITE_API_BASE_URL || 'http://localhost:4000';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    // Make process.env available in client code
    'process.env': process.env,
  },
  server: {
    port: 5173,
    proxy: {
      // Proxy all /api calls to backend; remove /api prefix
      '/api': {
        target: backendTarget,
        changeOrigin: true,
        secure: false, // allow self-signed HTTPS during dev
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
