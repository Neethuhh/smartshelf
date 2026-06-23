import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBXhbvNskSUK7ymGKTGy0KEtFlwm9Di9UE",
  authDomain: "big-web-w52jj.firebaseapp.com",
  projectId: "big-web-w52jj",
  storageBucket: "big-web-w52jj.firebasestorage.app",
  messagingSenderId: "135233729829",
  appId: "1:135233729829:web:4524b51d215a79556e56cc"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-90269f51-80d2-4186-947b-fd08c43b04a5");
export const googleProvider = new GoogleAuthProvider();

// Explicitly set persistence
setPersistence(auth, browserLocalPersistence);
