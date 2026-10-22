/**
 * GitHub Pages has no rewrite rules: an unknown path returns 404 instead of
 * index.html. Copying index.html to 404.html makes the app boot on every path,
 * so deep links like /bookmarks/calendar work (the status code stays 404).
 */
import { copyFileSync, existsSync } from 'node:fs'

const index = new URL('../docs/index.html', import.meta.url)
const fallback = new URL('../docs/404.html', import.meta.url)

if (!existsSync(index)) {
  console.error('docs/index.html not found — run the build first')
  process.exit(1)
}

copyFileSync(index, fallback)
console.log('docs/404.html written (GitHub Pages SPA fallback)')
