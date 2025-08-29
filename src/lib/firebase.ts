import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// IMPORTANT: Replace with your own Firebase configuration.
// You can find this in your Firebase project settings.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "studyverse-olazy.firebaseapp.com",
  projectId: "studyverse-olazy",
  storageBucket: "studyverse-olazy.firebasestorage.app",
  messagingSenderId: "661643609131",
  appId: "1:661643609131:web:922f9e7e4d5e40bd6e966e",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
