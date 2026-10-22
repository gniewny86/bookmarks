import { getAllItems } from '@bookmarks/app-bookmarks/items'
import { getEvents } from '@bookmarks/app-calendar/events'

/**
 * Builds the folder tree of the bookmarks collection.
 *
 * The collection stores flat documents linked by `parentId`; the tree keeps the
 * same shape as the bookmarks seed file:
 *
 *   { name: string, url?: string, children?: Node[] }
 *
 * Folders keep their children, bookmarks keep their url. Documents whose parent
 * no longer exists are treated as roots so nothing gets lost in a dump.
 */
function buildBookmarkTree(items) {
  const existingIds = new Set(items.map((item) => item.id))
  const childrenByParent = new Map()

  for (const item of items) {
    const parentId = item.parentId && existingIds.has(item.parentId) ? item.parentId : null

    if (!childrenByParent.has(parentId)) {
      childrenByParent.set(parentId, [])
    }

    childrenByParent.get(parentId).push(item)
  }

  const toNode = (item) => {
    const children = (childrenByParent.get(item.id) ?? [])
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(toNode)

    if (item.type === 'file' && item.url) {
      return { name: item.name, url: item.url }
    }

    return children.length > 0 ? { name: item.name, children } : { name: item.name }
  }

  return (childrenByParent.get(null) ?? [])
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(toNode)
}

function countNodes(nodes) {
  return nodes.reduce((total, node) => total + 1 + countNodes(node.children ?? []), 0)
}

/**
 * Dumps the whole `items` collection as a self-describing JSON export.
 */
export async function dumpBookmarks() {
  const items = await getAllItems()
  const tree = buildBookmarkTree(items)

  return {
    module: 'bookmarks',
    collection: 'items',
    exportedAt: new Date().toISOString(),
    count: countNodes(tree),
    items: tree,
  }
}

/**
 * Dumps the whole `calendar` collection as a self-describing JSON export.
 */
export async function dumpCalendar() {
  const events = await getEvents()

  return {
    module: 'calendar',
    collection: 'calendar',
    exportedAt: new Date().toISOString(),
    count: events.length,
    events: events.map(({ id, date, tags }) => ({ id, date, tags })),
  }
}

/**
 * Triggers a browser download of the given data as a JSON file.
 */
export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}

/**
 * `bookmarks-dump-2026-10-22T10-56-16-614Z.json`
 */
export function downloadFileName(prefix) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')

  return `${prefix}-dump-${stamp}.json`
}
