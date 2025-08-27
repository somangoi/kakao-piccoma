import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/entities': path.resolve(__dirname, './src/entities'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/widgets': path.resolve(__dirname, './src/widgets'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'mui-vendor': ['@mui/material'],
          'mui-icons': ['@mui/icons-material'],
          'charts-vendor': ['echarts', 'echarts-for-react'],
          'utils-vendor': ['zustand', '@tanstack/react-query', 'fuse.js'],
        },
      },
    },
    target: 'es2020',
    minify: 'esbuild',
  },
})
