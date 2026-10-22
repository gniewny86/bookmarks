import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { clearCollection, db } from '@bookmarks/firebase'

const EVENTS = 'calendar'

/**
 * Writes events using their `id` as the Firestore document id, so a dump can be
 * restored under the same ids it was created with.
 */
async function writeEvents(events = []) {
  for (const { id, ...data } of events) {
    await setDoc(doc(db, EVENTS, id), {
      ...data,
      createdAt: serverTimestamp(),
    })
  }

  return events.length
}

/**
 * Replaces the whole `calendar` collection with the given events:
 *
 *   { id, date: "YYYY.MM.DD", tags: string[] }
 *
 * Only the `calendar` collection is touched; other modules keep their data.
 */
export async function seedEvents(events = []) {
  const deleted = await clearCollection(EVENTS)
  const seeded = await writeEvents(events)

  return { deleted, seeded }
}
