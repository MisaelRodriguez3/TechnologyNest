import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isDev = env.VITE_ENVIRONMENT === 'dev';

  return {
    plugins: [react()],
    server: isDev ? {
      https: {
        key: fs.readFileSync('../certs/localhost-key.pem'),
        cert: fs.readFileSync('../certs/localhost.pem'),
      },
    } : undefined,
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };
});