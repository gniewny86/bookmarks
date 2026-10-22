import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { clearCollection, db } from '@bookmarks/firebase'

const ITEMS = 'items'

async function writeItems(items, parentId = null) {
  let count = 0

  for (const item of items) {
    const isFolder = !item.url
    const ref = await addDoc(collection(db, ITEMS), {
      name: item.name,
      type: isFolder ? 'folder' : 'file',
      url: item.url ?? null,
      parentId,
      createdAt: serverTimestamp(),
    })
    count += 1

    if (isFolder && Array.isArray(item.children) && item.children.length > 0) {
      count += await writeItems(item.children, ref.id)
    }
  }

  return count
}

/**
 * Replaces the whole `items` collection with the given tree.
 *
 * Each node in the tree:
 *   { name: string, url?: string, children?: Node[] }
 *
 * - No `url`  → created as a folder; may have `children`
 * - With `url` → created as a bookmark (leaf); `children` is ignored
 *
 * Only the `items` collection is touched; other modules keep their data.
 */
export async function seedItems(items = []) {
  const deleted = await clearCollection(ITEMS)
  const seeded = await writeItems(items)

  return { deleted, seeded }
}
