import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    //testApi(), // Disable when connecting to a real backend.
  ],
  // Hacer la proxy condicional para no intentar proxyear si no hay backend
  // Para activar la proxy en desarrollo exporta USE_API_PROXY=true antes de arrancar
  ...(process.env.USE_API_PROXY === 'true' ? {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  } : {}),
});
