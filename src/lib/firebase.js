import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

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
