import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'react', 'react-dom', '@tanstack/react-router', '@tanstack/react-query',
      'lucide-react', 'next-themes', 'clsx', 'tailwind-merge', 'framer-motion'
    ],
  },
  server: {
    port: 3010,
    host: '127.0.0.1',
    strictPort: true,
    hmr: {
      overlay: false
    }
  }
})
