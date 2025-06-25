// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzuV1hnDAw9fIq32okrUOll3y0H2jLl40",
  authDomain: "food-pro-18bd7.firebaseapp.com",
  projectId: "food-pro-18bd7",
  storageBucket: "food-pro-18bd7.firebasestorage.app",
  messagingSenderId: "899254327307",
  appId: "1:899254327307:web:a8b123077744ea999d0f0e",
  measurementId: "G-GLFLJE6QEF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };