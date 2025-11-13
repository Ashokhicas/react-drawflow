/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'url';

// Get __dirname equivalent for ESM
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@react-drawflow/core': resolve(__dirname, '../../packages/core/src'),
      '@react-drawflow/types': resolve(__dirname, '../../packages/types/src'),
      '@react-drawflow/themes': resolve(__dirname, '../../packages/themes/src'),
    },
  },
  // Exclude old Drawflow dist files from processing
  optimizeDeps: {
    exclude: ['lit-element'],
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Exclude old dist files
        if (id.includes('dist/drawflow')) return true;
        return false;
      },
    },
  },
  server: {
    port: 3000,
    host: 'localhost',
    watch: {
      ignored: ['**/dist/**', '**/node_modules/**', '**/legacy/**'],
    },
  },
}));

