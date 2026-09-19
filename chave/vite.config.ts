import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  ssr: {
    // Keep react-router bundled for predictable SSR in Node
    noExternal: ['react-router-dom'],
  },
})
