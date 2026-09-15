import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    env: {
      VITE_ENV: 'mock',
      VITE_API_URL: '',
      VITE_WA_NUMBER: '44999999999',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
})
