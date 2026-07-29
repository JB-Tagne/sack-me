/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Streamlit mode writes a static site to streamlit_static/ (loaded via CDN iframe).
export default defineConfig(({ mode }) => {
  const forStreamlit = mode === 'streamlit'
  return {
    plugins: [react()],
    base: './',
    server: {
      port: 5173,
    },
    build: forStreamlit
      ? {
          outDir: 'streamlit_static',
          emptyOutDir: true,
          cssCodeSplit: false,
          modulePreload: false,
          rollupOptions: {
            output: {
              // Single ESM chunk — loaded from https CDN (works in Streamlit iframes).
              inlineDynamicImports: true,
              entryFileNames: 'assets/[name].js',
              chunkFileNames: 'assets/[name].js',
              assetFileNames: 'assets/[name][extname]',
            },
          },
        }
      : undefined,
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
  }
})
