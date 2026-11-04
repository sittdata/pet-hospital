import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, '/');
          if (normalized.includes('node_modules/')) {
            if (
              normalized.includes('react-aria-components') ||
              normalized.includes('@react-aria') ||
              normalized.includes('@react-stately') ||
              normalized.includes('@internationalized')
            ) {
              return 'vendor-react-aria';
            }
            if (normalized.includes('@remixicon/react')) {
              return 'vendor-remix-icons';
            }
            if (normalized.includes('motion')) {
              return 'vendor-motion';
            }
            if (normalized.includes('/react/') || normalized.includes('/react-dom/')) {
              return 'vendor-react';
            }
          }
        },
      },
    },
  },
})
