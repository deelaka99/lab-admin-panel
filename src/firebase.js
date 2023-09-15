// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, signOut} from "firebase/auth";
import { getDatabase} from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCs01bWw9P7r-bvLxEvfij1TJjA4v9hGbI",
  authDomain: "lab-report-analyzing-sys-3e47a.firebaseapp.com",
  projectId: "lab-report-analyzing-sys-3e47a",
  storageBucket: "lab-report-analyzing-sys-3e47a.appspot.com",
  messagingSenderId: "886216762851",
  appId: "1:886216762851:web:2ed582984d96638115ecd6"
};

const logout = () => {
  signOut(auth);
  localStorage.removeItem("gmail");
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Realtime Database and get a reference to the service
const db = getDatabase(app);

// Initialize Firebase Storage and get a reference to the service
const storage = getStorage(app);

export {app, auth, logout, db, storage};
