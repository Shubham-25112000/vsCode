// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openai/, ''),
      },
      '/api/qdrant': {
        target: 'https://22f43984-ef40-494f-87e1-b26289d949e8.us-east4-0.gcp.cloud.qdrant.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/qdrant/, ''),
      },
    },
  },
});
