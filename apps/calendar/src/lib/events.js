import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@bookmarks/firebase'

const EVENTS = 'calendar'

/**
 * Reads every calendar event from the `calendar` collection. The document id
 * becomes the event id; `createdAt` (and any future metadata) stays out of the
 * UI model.
 */
export async function getEvents() {
  const snapshot = await getDocs(collection(db, EVENTS))

  return snapshot.docs.map((document) => {
    const { date, tags } = document.data()
    return { id: document.id, date, tags: Array.isArray(tags) ? tags : [] }
  })
}

export async function createEvent({ date, tags }) {
  const ref = await addDoc(collection(db, EVENTS), {
    date,
    tags,
    createdAt: serverTimestamp(),
  })

  return { id: ref.id, date, tags }
}

export async function updateEvent({ id, date, tags }) {
  return updateDoc(doc(db, EVENTS, id), { date, tags })
}

export async function deleteEvent(id) {
  return deleteDoc(doc(db, EVENTS, id))
}
