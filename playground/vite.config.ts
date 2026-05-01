import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig({
  root: __dirname,
  base: process.env.GITHUB_PAGES === 'true'
    ? '/vue3-Adaptive-Large-Screen-ts/'
    : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@lib': resolve(__dirname, '../src'),
    },
  },
  server: {
    port: 5174,
    open: true,
  },
});
