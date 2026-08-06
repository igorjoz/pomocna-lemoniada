import { defineConfig } from 'vite';

export default defineConfig({
  // Relative paths make the production build portable to any hosting folder.
  base: './',
  build: {
    target: 'es2020',
  },
});
