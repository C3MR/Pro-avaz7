
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // تمت الإضافة

// IMPORTANT: This is your actual Firebase project configuration.
const firebaseConfig = {
  apiKey: "AIzaSyA1kovQmq7hBDdobo79AKiMsF6R8R0d4n8",
  authDomain: "avaz-realestate93.firebaseapp.com",
  projectId: "avaz-realestate93",
  storageBucket: "avaz-realestate93.firebasestorage.app",
  messagingSenderId: "514686158709",
  appId: "1:514686158709:web:d72436638cb4f3ff0ff53c",
  measurementId: "G-LMRHW42600" 
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

export { db, auth, app }; // تم تعديل التصدير ليشمل auth
