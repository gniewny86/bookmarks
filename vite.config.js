import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Deployment base path.
 *
 * Local dev serves the app from the root ('/'), GitHub Pages serves project
 * sites from /<repo>/ ('/bookmarks/'). PAGES_BASE overrides it.
 */
const base = process.env.PAGES_BASE ?? '/'

export default defineConfig({
  plugins: [react()],
  base,
  // Shared static assets (favicon, touch icon, .htaccess) come from the assets package.
  publicDir: 'packages/assets/public',
  build: { outDir: 'docs' },
})
