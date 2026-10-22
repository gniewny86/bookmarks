# Bookmarks — monorepo

Public bookmark manager plus sibling modules, built as an npm workspaces monorepo.

## Structure

```
.
├── index.html              # host shell (Vite entry)
├── src/                    # host: resolves URL → module
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── apps/
│   ├── bookmarks/          # module 1 — bookmark manager
│   │   └── src/
│   ├── calendar/           # module 2 — event calendar
│   │   └── src/
│   └── dbconnect/          # module 3 — backup & restore tool
│       └── src/
├── packages/
│   ├── assets/             # shared icons + static files (public/)
│   ├── firebase/           # shared Firestore client + collection helpers
│   └── ui/                 # shared components + design tokens
├── scripts/
│   └── spa-fallback.mjs    # copies index.html → 404.html (GitHub Pages)
└── docs/                   # build output (deployed to GitHub Pages)
```

- **Host** (`src/`) is the only Vite app. It owns the module registry and URL resolution.
- **`apps/*`** are feature modules. Each exposes a page component from `src/index.js`
  and owns its Firestore collection.
- **`packages/*`** are shared libraries consumed by the host and modules:
  - `@bookmarks/ui` — `PageHeader`, `Loader`, `Modal`, design tokens, base reset, page/header and modal/loader CSS.
  - `@bookmarks/assets` — `FolderIcon`, `FileIcon`, `BookmarkIcon`, favicon, touch icon, `.htaccess`.
  - `@bookmarks/firebase` — Firestore app init, `db`, `clearCollection()`.

## Routing

Modules are reachable **only via URL** — there is no in-app module switcher:

| URL | Module |
| --- | --- |
| `/bookmarks` | bookmark manager |
| `/calendar` | event calendar |
| `/dbconnect` | backup & restore (dump / seed) |

`/` redirects to `/bookmarks`. Unknown paths render a minimal 404.

## Commands

```bash
npm install       # installs and links all workspaces
npm run dev       # dev server → http://localhost:5173/bookmarks
npm run build     # production build → docs/
npm run build:pages # GitHub Pages build (base=/bookmarks/ + 404.html fallback)
npm run preview   # preview the build
npm run lint      # ESLint across the monorepo
```

## Databases

Each module owns its own Firestore collection and reads/writes it directly.

| Module | Collection | Read / write layer |
| --- | --- | --- |
| bookmarks | `items` | `apps/bookmarks/src/lib/bookmarks.js` |
| calendar | `calendar` | `apps/calendar/src/lib/events.js` |
| dbconnect | — | `/dbconnect` (dumps & seeds the collections above) |

Backups are the only copy of the data: `/dbconnect` writes a JSON dump of a collection
and seeds a collection back from such a dump (see below). There is no seed file checked
into the repo and no reset command — a collection is restored from a dump, never from a
mock.

Every module keeps the write side of its collection in `src/lib/seed.js`
(`seedItems(tree)` / `seedEvents(events)`): it replaces the collection with the given
data and returns `{ deleted, seeded }`. Shared deletion logic lives in
`@bookmarks/firebase` (`clearCollection`).

## Calendar data model

An event looks like this:

```json
{
  "id": "evt-2026-10-17",
  "date": "2026.10.17",
  "tags": ["beskidy", "hala jaworowa"]
}
```

**Events** — no categories, colors or titles. `date` is the display format
`YYYY.MM.DD` (zero-padded, so it sorts lexicographically). `tags` holds any number of
lowercase strings, including zero; they render as neutral chips without a `#` prefix.
The calendar groups events by month (`YYYY.MM`), newest month first.

Firestore collection: `calendar`. The document id is the event id; events created in the
UI get Firestore-generated ids.

## DB Connect (backup & restore)

`/dbconnect` is a cross-module tool: one row per module, each with a **Download DB**
button (writes a JSON dump of that collection) and an **Upload DB** button (asks for a
JSON file and seeds it back into the same collection).

Seeding **replaces** the target collection — the old documents are deleted first, then
the file contents are written. The row that was used decides the target collection, so a
file is always seeded into the collection it belongs to.

Uploads are validated before anything is written:

- the file must be valid JSON and match the row (`module` field),
- bookmarks files need an `items` tree of `{ name, url?, children? }` nodes,
- calendar files need an `events` array of `{ id, date: "YYYY.MM.DD", tags: string[] }`.

Dump formats (self-describing, one file per collection):

```json
{
  "module": "bookmarks",
  "collection": "items",
  "exportedAt": "2026-10-22T11:11:59.314Z",
  "count": 79,
  "items": [
    { "name": "AI", "children": [{ "name": "ChatGPT mini", "url": "https://chatgpt.com/" }] }
  ]
}
```

```json
{
  "module": "calendar",
  "collection": "calendar",
  "exportedAt": "2026-10-22T11:11:59.314Z",
  "count": 259,
  "events": [{ "id": "evt-2026-10-17", "date": "2026.10.17", "tags": ["beskidy"] }]
}
```

The bookmarks dump keeps the folder tree, the calendar dump keeps the document ids — so
re-seeding a dump restores the same data under the same ids.

The module reuses each module's own read/seed layer (`@bookmarks/app-bookmarks/items`,
`@bookmarks/app-bookmarks/seed`, `@bookmarks/app-calendar/events`,
`@bookmarks/app-calendar/seed`), so the data model stays defined in one place. Adding a
collection to dbconnect means adding one entry to `DATABASES` in
`apps/dbconnect/src/lib/databases.js`.

## Adding a module

1. Create `apps/<name>/package.json` (name `@bookmarks/app-<name>`, `exports` → `./src/index.js`).
2. Export a page component from `apps/<name>/src/index.js`.
3. Register it in the `MODULES` map in `src/App.jsx`.
4. Add `"@bookmarks/app-<name>": "*"` to the root `package.json` dependencies.
5. Give the module its own Firestore collection: a read/write layer in `src/lib/` and a
   `src/lib/seed.js` that replaces the collection with the given data.
6. Run `npm install`.
7. To make the collection dumpable/restorable, add one entry to `DATABASES` in
   `apps/dbconnect/src/lib/databases.js`.

## Deployment

The app is a static Vite build (`docs/`) with path-based routing.

### GitHub Pages

Live at `https://gniewny86.github.io/bookmarks/`. Project sites are served from
`/<repo>/`, so the build uses `base: '/bookmarks/'` (`PAGES_BASE` in `vite.config.js`)
and the app strips that prefix from the pathname (`src/App.jsx`).

GitHub Pages has no rewrite rules — an unknown path returns 404 instead of `index.html`.
`scripts/spa-fallback.mjs` copies `index.html` to `404.html` after the build, so deep
links such as `/bookmarks/calendar` boot the app (the HTTP status stays 404).

```bash
npm run build:pages   # build into docs/ with base=/bookmarks/ + write docs/404.html
```

The build output in `docs/` is committed to `main`; GitHub Pages serves `main` → `/docs`
(Repository → Settings → Pages → Source: *Deploy from a branch*). Rebuild and commit
`docs/` with every change.

### Other hosts

`npm run build` builds for the domain root (`base: '/'`).
`packages/assets/public/.htaccess` rewrites unknown paths to `index.html` for Apache
hosts.

### Firebase

Firebase configuration is hardcoded in `packages/firebase/src/index.js`; the Firestore
project is shared and unauthenticated.
