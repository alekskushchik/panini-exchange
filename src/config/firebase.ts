import { initializeApp, type FirebaseApp } from 'firebase/app';
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig';

/** Single shared Firebase app instance, used by auth and Firestore alike. */
export const firebaseApp: FirebaseApp | null = isFirebaseConfigured
  ? initializeApp(firebaseConfig)
  : null;
