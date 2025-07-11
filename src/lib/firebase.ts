
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // تمت الإضافة
import { connectFirestoreEmulator } from "firebase/firestore";
import { connectAuthEmulator } from "firebase/auth";

// IMPORTANT: This is your actual Firebase project configuration.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA1kovQmq7hBDdobo79AKiMsF6R8R0d4n8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "avaz-realestate93.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "avaz-realestate93",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "avaz-realestate93.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "514686158709",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:514686158709:web:d72436638cb4f3ff0ff53c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-LMRHW42600" 
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);
const auth = getAuth(app); // تمت الإضافة

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  try {
    // Connect to Firestore emulator
    if (!db._delegate._settings?.host?.includes('localhost')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    // Connect to Auth emulator
    if (!auth.config.emulator?.url) {
      connectAuthEmulator(auth, 'http://localhost:9099');
    }
  } catch (error) {
    console.log('Firebase emulators already initialized');
  }
}

export { db, auth, app }; // تم تعديل التصدير ليشمل auth
