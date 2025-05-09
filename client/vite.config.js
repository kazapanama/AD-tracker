import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    hmr: {
      clientPort: 443, // Important when behind reverse proxy with HTTPS
      host: 'ad-tracker.horyzont.ddu.ua',
      protocol: 'wss' // Use secure WebSockets
    }
  },
});