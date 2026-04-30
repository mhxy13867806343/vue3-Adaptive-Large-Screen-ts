import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig({
  root: __dirname,
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
