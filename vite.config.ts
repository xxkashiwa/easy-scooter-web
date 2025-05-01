import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // proxy: {
    //   '/api': {
    //     target: 'http://119.45.26.22:8222',
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
});
