import { initializeApp } from 'firebase/app'
import { collection, getDocs, getFirestore, writeBatch } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDu7WNTcchWNRbb4l3DNr4xgTo2ozzxCT8",
  authDomain: "bookmarks-cce91.firebaseapp.com",
  projectId: "bookmarks-cce91",
  storageBucket: "bookmarks-cce91.firebasestorage.app",
  messagingSenderId: "933485019873",
  appId: "1:933485019873:web:79ae7e27a260ad08896da0",
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

const BATCH_LIMIT = 500

/**
 * Deletes every document in a collection, in batches. Returns the number removed.
 *
 * Every module owns its own collection, so resetting one module never touches
 * another module's data.
 */
export async function clearCollection(name) {
  const snapshot = await getDocs(collection(db, name))
  if (snapshot.empty) return 0

  for (let i = 0; i < snapshot.docs.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db)
    snapshot.docs.slice(i, i + BATCH_LIMIT).forEach((d) => batch.delete(d.ref))
    await batch.commit()
  }

  return snapshot.docs.length
}
