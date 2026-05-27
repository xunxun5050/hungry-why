import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages project site: https://<username>.github.io/<repo>/
  // Use conditional base so local dev/preview still works at `/`.
  base: process.env.GITHUB_ACTIONS ? '/hungry-why/' : '/',
  plugins: [react()],
});
