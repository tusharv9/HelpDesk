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
        './HelpdeskApp': './src/App.jsx',
        './Dashboard': './src/pages/Dashboard.jsx',
        './TicketList': './src/pages/TicketList.jsx'
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
