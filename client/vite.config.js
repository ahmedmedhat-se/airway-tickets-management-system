import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // Log proxy errors to console for easier debugging
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('[proxy] Spring Boot unreachable:', err.message);
          });
        },
      },
    },
  },
})
