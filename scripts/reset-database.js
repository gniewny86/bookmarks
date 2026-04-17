import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = initializeApp({
  apiKey:            "AIzaSyDu7WNTcchWNRbb4l3DNr4xgTo2ozzxCT8",
  authDomain:        "bookmarks-cce91.firebaseapp.com",
  projectId:         "bookmarks-cce91",
  storageBucket:     "bookmarks-cce91.firebasestorage.app",
  messagingSenderId: "933485019873",
  appId:             "1:933485019873:web:79ae7e27a260ad08896da0",
})
const db = getFirestore(app)
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
  console.log(`  Deleted ${snap.docs.length} existing document(s).`)
}

async function seedItems(items, parentId = null) {
  for (const item of items) {
    const isFolder = !item.url
    const ref = await addDoc(collection(db, ITEMS), {
      name:      item.name,
      type:      isFolder ? 'folder' : 'file',
      url:       item.url ?? null,
      parentId,
      createdAt: serverTimestamp(),
    })
    if (isFolder && Array.isArray(item.children) && item.children.length > 0) {
      await seedItems(item.children, ref.id)
    }
  }
}

const seedPath = resolve(__dirname, '../seed-data.json')
const seedData = JSON.parse(readFileSync(seedPath, 'utf-8'))

console.log('Resetting database...')
await deleteAllItems()
console.log('Seeding...')
await seedItems(seedData)
console.log('Done.')
process.exit(0)
