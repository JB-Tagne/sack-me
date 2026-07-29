/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Shared Vite config. Streamlit embed uses IIFE (ES modules fail inside srcdoc iframes).
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
          modulePreload: false,
          rollupOptions: {
            output: {
              format: 'iife',
              name: 'SackMeApp',
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
