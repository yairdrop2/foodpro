// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;