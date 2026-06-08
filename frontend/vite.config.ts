import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'helpdesk',
      filename: 'remoteEntry.js',
      exposes: {
        './HelpdeskApp': './src/App.tsx',
        './Dashboard': './src/pages/Dashboard.tsx',
        './TicketList': './src/pages/TicketList.tsx'
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
