import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  Firestore,
} from 'firebase/firestore';
import type { WeddingData } from '../types/wedding';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAyiAHl48cjc5yboKfn4joY4nkZe69Idy8',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'digital-wedding-invite-nb.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'digital-wedding-invite-nb',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'digital-wedding-invite-nb.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '393756914410',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:393756914410:web:08dafa5db154338bf3dd93',
};

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);

const WEDDING_DOC_COLLECTION = 'weddings';
const WEDDING_DOC_ID = 'active';

/**
 * Remove undefined values recursively before saving to Firestore,
 * which rejects JavaScript undefined fields.
 */
function sanitizeForFirestore<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Fetch wedding data once from Cloud Firestore
 */
export async function fetchWeddingDataFromCloud(): Promise<WeddingData | null> {
  try {
    const docRef = doc(db, WEDDING_DOC_COLLECTION, WEDDING_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as WeddingData;
    }
    return null;
  } catch (error) {
    console.warn('Could not fetch wedding data from Cloud Firestore:', error);
    return null;
  }
}

/**
 * Save wedding data into Cloud Firestore
 */
export async function saveWeddingDataToCloud(data: WeddingData): Promise<void> {
  try {
    const docRef = doc(db, WEDDING_DOC_COLLECTION, WEDDING_DOC_ID);
    const sanitized = sanitizeForFirestore(data);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (error) {
    console.error('Failed to save wedding data to Cloud Firestore:', error);
    throw error;
  }
}

/**
 * Real-time listener for live wedding data updates across all open devices
 */
export function subscribeToWeddingData(
  onUpdate: (data: WeddingData) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    const docRef = doc(db, WEDDING_DOC_COLLECTION, WEDDING_DOC_ID);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onUpdate(snapshot.data() as WeddingData);
        }
      },
      (err) => {
        console.warn('Firestore real-time subscription error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Could not initiate Firestore real-time listener:', err);
    return () => {};
  }
}
