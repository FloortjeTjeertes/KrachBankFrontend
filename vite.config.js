// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // Make sure to import 'path'

export default defineConfig({
  base: '/KrachBankFrontend/', // <-- Add this line for GitHub Pages!
  plugins: [vue()],
  resolve: {
    alias: {
      // This line defines the '@' alias to point to the 'src' directory
      '@': path.resolve(__dirname, './src'),
    },
  },
});
