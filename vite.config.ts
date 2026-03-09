import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5175,
  },
  build: {
    // Data files are intentionally large (full HTML bodies from CMS)
    // but already split into lazy-loaded chunks
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor: React core + router
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Large data files – each becomes a separate cacheable chunk
          'data-events': ['./src/data/events.json'],
          'data-podcasts': ['./src/data/podcasts.json'],
          'data-book-reviews': ['./src/data/book-reviews.json'],
          'data-evening-talks': ['./src/data/evening-talks.json'],
          'data-news': ['./src/data/news.json'],
          'data-articles': ['./src/data/articles.json'],
          'data-conference-reports': ['./src/data/conference-reports.json'],
          'data-dinner-reviews': ['./src/data/dinner-reviews.json'],
          'data-ryb-essays': ['./src/data/ryb-essays.json'],
        },
      },
    },
  },
})
