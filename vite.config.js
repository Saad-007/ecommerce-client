import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '', // ✅ Leave it empty for Vercel deployment
  build: {
    outDir: 'dist'
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://e-commerce-backend-production-36dc.up.railway.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
