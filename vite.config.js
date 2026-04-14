import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://portfoliobackend-1-xmt5.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://portfoliobackend-1-xmt5.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
