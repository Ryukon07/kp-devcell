// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvbUWj6VkJz1PGOrkf8e-mba1HQLO4ZFY",
  authDomain: "kp-devcell.firebaseapp.com",
  projectId: "kp-devcell",
  storageBucket: "kp-devcell.firebasestorage.app",
  messagingSenderId: "497778856161",
  appId: "1:497778856161:web:00c23e97847de4f5ab67a0",
  measurementId: "G-43BJ3SCHXF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export default app;