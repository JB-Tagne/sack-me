/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Shared Vite config. Streamlit single-file build needs inlineDynamicImports.
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
          cssCodeSplit: false,
          rollupOptions: {
            output: {
              inlineDynamicImports: true,
              entryFileNames: 'assets/[name].js',
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
