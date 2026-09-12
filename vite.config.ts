import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vercel/Netlify serve from the domain root, so default base is '/'.
  // Deploying to GitHub Pages under a repo subpath? Set VITE_BASE_PATH, e.g.
  // VITE_BASE_PATH=/de-otter/ npm run build
  base: process.env.NODE_ENV === 'production' ? '/de-otter/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false,
  },
})
