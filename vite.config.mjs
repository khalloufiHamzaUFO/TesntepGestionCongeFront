import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  base: '/', // Base URL for the project
  define: {
    global: 'window',
    'process.env': {}
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'node_modules'),
      'src': path.resolve(__dirname, 'src'),
    }
  },
  server: {
    open: true,
    port: 3000,
  },
  preview: {
    open: true,
    port: 3000,
  },
});
