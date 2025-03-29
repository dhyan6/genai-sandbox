import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This ensures environment variables are properly replaced during build
    __APP_ENV__: process.env.VITE_VERCEL_ENV,
  },
  // This ensures assets are served from the correct base path
  base: './',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
