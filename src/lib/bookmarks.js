import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

const ITEMS = 'items'

export async function getAllItems() {
  const snap = await getDocs(collection(db, ITEMS))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addItem({ name, url, parentId }) {
  const type = url ? 'file' : 'folder'
  const data = {
    name,
    type,
    url: url || null,
    parentId: parentId ?? null,
    createdAt: serverTimestamp(),
  }
  const ref = await addDoc(collection(db, ITEMS), data)
  return { id: ref.id, name, type, url: data.url, parentId: data.parentId }
}

export async function updateItem(id, updates) {
  return updateDoc(doc(db, ITEMS, id), updates)
}

export async function deleteItem(id) {
  return deleteDoc(doc(db, ITEMS, id))
}

export function isNameTakenLocally(allItems, name, parentId, excludeId = null) {
  return allItems.some(
    (item) =>
      (item.parentId ?? null) === (parentId ?? null) &&
      item.name === name &&
      item.id !== excludeId,
  )
}
