// firebase.js - Centralized Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCmgWJY67GEiJFZgVFOdy5loBRvZ1-yQY",
  authDomain: "my-website-backend-62788.firebaseapp.com",
  projectId: "my-website-backend-62788",
  storageBucket: "my-website-backend-62788.firebasestorage.app",
  messagingSenderId: "799302822506",
  appId: "1:799302822506:web:654449e7b3432685bdf813"
};

let app, auth, db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization failed:", error);
  
  if (typeof window !== 'undefined') {
    const showError = () => {
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #dc2626;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 99999;
        font-family: Arial, sans-serif;
        font-size: 14px;
      `;
      errorDiv.textContent = 'Failed to initialize authentication system. Please refresh the page.';
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 5000);
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showError);
    } else {
      showError();
    }
  }
}

export { app, auth, db };

export const isFirebaseReady = () => !!(app && auth && db);

export const getFirebaseStatus = () => ({
  initialized: isFirebaseReady(),
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});