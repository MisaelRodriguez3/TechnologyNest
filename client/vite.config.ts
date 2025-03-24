import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// Verifica si la variable está definida
const isDev = process.env.ENVIRONMENT === 'dev';

export default defineConfig({
  plugins: [react()],
  server: isDev
    ? {
        https: {
          key: fs.readFileSync('../certs/localhost-key.pem'),
          cert: fs.readFileSync('../certs/localhost.pem'),
        },
      }
    : undefined, // Evita agregar `server` si no es dev
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
