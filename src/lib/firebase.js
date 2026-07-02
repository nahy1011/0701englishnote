import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy_api_key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "localhost",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "265788836290",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy_bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy_sender",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy_app_id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

// Development emulator
if (!import.meta.env.PROD) {
  // connectAuthEmulator(auth, "http://127.0.0.1:9099"); // Uncomment if using auth emulator
  // connectFirestoreEmulator(db, '127.0.0.1', 8080); // Uncomment if using firestore emulator
}

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed", error);
    throw error;
  }
};

export { auth, db };
