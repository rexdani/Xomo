import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,          // <<< change this number to any port you want
    open: true,          // auto-open browser (optional)
    host: true,          // allows LAN/mobile access (optional)
    // Note: COOP warnings are harmless in development
    // They occur due to Vite's HMR communication and can be safely ignored
  },
  build: {
    // Optimize build output for production
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react']
        }
      }
    },
    // Improve build performance
    chunkSizeWarningLimit: 1000
  }
})
