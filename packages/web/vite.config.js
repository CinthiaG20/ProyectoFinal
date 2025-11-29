import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
<<<<<<< HEAD
    //testApi(), // Disable when connecting to a real backend.
=======
    ...(globalThis.process.env.VITE_API_BASE_URL ? [] : [testApi()]), // Disable when connecting to a real backend.
>>>>>>> 5dc0b7f1f0bc25761d2b39b67f6b6e9f206abd05
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
