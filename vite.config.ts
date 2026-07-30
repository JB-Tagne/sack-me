/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: set VITE_BASE=/sack-me/ in CI (local dev defaults to /).
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5174,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
          if (id.includes('.en.ts') || id.includes('.en.js')) return 'i18n-en'
          if (id.includes('meetingBank')) return 'meetings'
          if (id.includes('exercises')) return 'exercises'
          if (id.includes('roleStories')) return 'stories'
          return undefined
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
