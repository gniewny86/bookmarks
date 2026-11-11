import BookmarksPage from '@bookmarks/app-bookmarks'
import CalendarPage from '@bookmarks/app-calendar'
import DbConnectPage from '@bookmarks/app-dbconnect'
import PasswordsPage from '@bookmarks/app-passwords'

/**
 * Module registry. Every module is reachable only through its URL,
 * so adding a module means adding one entry here plus its workspace package.
 */
const MODULES = {
  '/bookmarks': BookmarksPage,
  '/calendar': CalendarPage,
  '/dbconnect': DbConnectPage,
  '/passwords': PasswordsPage,
}

const DEFAULT_PATH = '/bookmarks'

/**
 * Where the app is served from: '/' locally, '/bookmarks' on GitHub Pages
 * (project sites live under /<repo>/). Vite injects it at build time.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '')

function normalizePath(pathname) {
  const trimmed = pathname.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

/** Strips the deployment base, so modules are addressed the same way everywhere. */
function modulePath(pathname) {
  const path = normalizePath(pathname)

  if (BASE && (path === BASE || path.startsWith(`${BASE}/`))) {
    return normalizePath(path.slice(BASE.length))
  }

  return path
}

export default function App() {
  const path = modulePath(window.location.pathname)

  if (path === '/') {
    window.location.replace(`${BASE}${DEFAULT_PATH}`)
    return null
  }

  const Module = MODULES[path]

  if (!Module) {
    return (
      <div className="app-not-found">
        <p className="app-not-found__title">Page not found</p>
        <p className="app-not-found__hint">
          <a href={`${BASE}/bookmarks`}>/bookmarks</a>
          {' · '}
          <a href={`${BASE}/calendar`}>/calendar</a>
          {' · '}
          <a href={`${BASE}/dbconnect`}>/dbconnect</a>
          {' · '}
          <a href={`${BASE}/passwords`}>/passwords</a>
        </p>
      </div>
    )
  }

  return <Module />
}
