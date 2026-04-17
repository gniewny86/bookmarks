import {
  collection,
  addDoc,
  getDocs,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

const ITEMS = 'items'

async function deleteAllItems() {
  const snap = await getDocs(collection(db, ITEMS))
  if (snap.empty) return

  const BATCH_LIMIT = 500
  for (let i = 0; i < snap.docs.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db)
    snap.docs.slice(i, i + BATCH_LIMIT).forEach((d) => batch.delete(d.ref))
    await batch.commit()
  }
}

async function seedItems(items, parentId = null) {
  for (const item of items) {
    const isFolder = !item.url
    const ref = await addDoc(collection(db, ITEMS), {
      name: item.name,
      type: isFolder ? 'folder' : 'file',
      url: item.url ?? null,
      parentId,
      createdAt: serverTimestamp(),
    })

    if (isFolder && Array.isArray(item.children) && item.children.length > 0) {
      await seedItems(item.children, ref.id)
    }
  }
}

/**
 * Wipes the entire `items` collection and re-seeds it from the provided tree.
 *
 * Each node in the tree:
 *   { name: string, url?: string, children?: Node[] }
 *
 * - No `url`  → created as a folder; may have `children`
 * - With `url` → created as a bookmark (leaf); `children` is ignored
 */
export async function cleanupAndSeed(seedData) {
  await deleteAllItems()
  await seedItems(seedData)
}
