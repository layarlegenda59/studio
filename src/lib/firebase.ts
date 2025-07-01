
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMvVQYiFOKMA5XhUqaBYnlRMf7_cLXVfM",
  authDomain: "goodstock-x-ihwv8.firebaseapp.com",
  projectId: "goodstock-x-ihwv8",
  storageBucket: "goodstock-x-ihwv8.appspot.com",
  messagingSenderId: "429861061256",
  appId: "1:429861061256:web:a4c54f03b2268e55be153d"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
