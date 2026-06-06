import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: process.env.BACKEND_URL || 'https://pizza-xpert-backend.vercel.app' || 'http://localhost:4000',
          changeOrigin: true,       // rewrites Host header → no CORS
          secure: true,
          rewrite: (path) => path,
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom', 'react-router-dom', 'axios'],
            'icons': ['lucide-react'],
          },
        },
      },
    },
  };
});
