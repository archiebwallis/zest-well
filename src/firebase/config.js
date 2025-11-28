// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkIqRpy9FdfH9XAmw_hMxOyA3M4mybvPc",
  authDomain: "zest-well.firebaseapp.com",
  projectId: "zest-well",
  storageBucket: "zest-well.firebasestorage.app",
  messagingSenderId: "670120406228",
  appId: "1:670120406228:web:10c70453469bb1d41d9f41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
export default app