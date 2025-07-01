import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// =================================================================
// >> IMPORTANT <<
//
// Ganti dengan konfigurasi proyek Firebase Anda yang sebenarnya.
// Anda bisa mendapatkannya dari Firebase Console:
// Project Settings > General > Your apps > Web app > SDK setup and configuration
// =================================================================
const firebaseConfig = {
  apiKey: "AIzaXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000"
};

// Inisialisasi Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
