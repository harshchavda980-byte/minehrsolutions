// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCmgWJY67GEiJFZgVFOdy5loBRvZ1-yQY",
  authDomain: "my-website-backend-62788.firebaseapp.com",
  projectId: "my-website-backend-62788",
  storageBucket: "my-website-backend-62788.firebasestorage.app",
  messagingSenderId: "799302822506",
  appId: "1:799302822506:web:654449e7b3432685bdf813"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
