import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'three']
  },
  base: './',
  publicDir: false,
  build: {
    assetsDir: '',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      input: 'dev.html',
      output: {
        assetFileNames: a => a.names?.some(n => n.endsWith('.css')) ? 'style.css' : '[name][extname]',
        entryFileNames: 'app.js',
        chunkFileNames: '[name]-bundle.js'
      }
    }
  }
});
