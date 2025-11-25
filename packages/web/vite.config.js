import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import testApi from './test/test-api';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    testApi(), // Disable when connecting to a real backend.
  ],
});
