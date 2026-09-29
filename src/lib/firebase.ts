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
const PHOTOS_COLLECTION = 'wedding_photos';

// In-memory cache for photo URLs to avoid redundant network requests
const photoCache = new Map<string, string>();

/**
 * Fetch a specific photo by its slot key from the wedding_photos collection
 */
async function fetchPhotoBySlot(slotKey: string): Promise<string | null> {
  if (photoCache.has(slotKey)) {
    return photoCache.get(slotKey) || null;
  }
  try {
    const photoRef = doc(db, PHOTOS_COLLECTION, slotKey);
    const snap = await getDoc(photoRef);
    if (snap.exists() && snap.data().dataUrl) {
      const dataUrl = snap.data().dataUrl as string;
      photoCache.set(slotKey, dataUrl);
      return dataUrl;
    }
  } catch (err) {
    console.warn(`Could not load photo for slot ${slotKey}:`, err);
  }
  return null;
}

/**
 * Save a specific photo to the wedding_photos collection
 */
async function savePhotoBySlot(slotKey: string, dataUrl: string): Promise<void> {
  photoCache.set(slotKey, dataUrl);
  try {
    const photoRef = doc(db, PHOTOS_COLLECTION, slotKey);
    await setDoc(photoRef, { dataUrl, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.error(`Failed to persist photo ${slotKey} to Firestore:`, err);
    throw err;
  }
}

/**
 * Remove undefined values recursively before saving to Firestore
 */
function sanitizeForFirestore<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Hydrates any "cloudphoto:{slotKey}" placeholders back to real base64/URL strings
 */
async function hydratePhotos(data: WeddingData): Promise<WeddingData> {
  const clone: WeddingData = JSON.parse(JSON.stringify(data));
  const fetchPromises: Promise<void>[] = [];

  // Hero illustration
  if (clone.appearance?.heroIllustrationUrl?.startsWith('cloudphoto:')) {
    const slotKey = clone.appearance.heroIllustrationUrl.replace('cloudphoto:', '');
    fetchPromises.push(
      fetchPhotoBySlot(slotKey).then((url) => {
        if (url) clone.appearance.heroIllustrationUrl = url;
      })
    );
  }

  // Groom image
  if (clone.couple?.groom?.image?.startsWith('cloudphoto:')) {
    const slotKey = clone.couple.groom.image.replace('cloudphoto:', '');
    fetchPromises.push(
      fetchPhotoBySlot(slotKey).then((url) => {
        if (url) clone.couple.groom.image = url;
      })
    );
  }

  // Bride image
  if (clone.couple?.bride?.image?.startsWith('cloudphoto:')) {
    const slotKey = clone.couple.bride.image.replace('cloudphoto:', '');
    fetchPromises.push(
      fetchPhotoBySlot(slotKey).then((url) => {
        if (url) clone.couple.bride.image = url;
      })
    );
  }

  // Gallery images
  if (Array.isArray(clone.gallery)) {
    clone.gallery.forEach((item, index) => {
      if (item.url?.startsWith('cloudphoto:')) {
        const slotKey = item.url.replace('cloudphoto:', '');
        fetchPromises.push(
          fetchPhotoBySlot(slotKey).then((url) => {
            if (url && clone.gallery[index]) {
              clone.gallery[index].url = url;
            }
          })
        );
      }
    });
  }

  await Promise.all(fetchPromises);
  return clone;
}

/**
 * Extracts large base64 photos to the wedding_photos collection and replaces them
 * with lightweight "cloudphoto:{slotKey}" pointers so the main document stays < 5KB.
 */
async function extractAndSavePhotos(data: WeddingData): Promise<WeddingData> {
  const clone: WeddingData = JSON.parse(JSON.stringify(data));
  const savePromises: Promise<void>[] = [];

  // Hero illustration
  if (clone.appearance?.heroIllustrationUrl?.startsWith('data:image/')) {
    const slotKey = 'hero_illustration';
    const dataUrl = clone.appearance.heroIllustrationUrl;
    clone.appearance.heroIllustrationUrl = `cloudphoto:${slotKey}`;
    savePromises.push(savePhotoBySlot(slotKey, dataUrl));
  }

  // Groom image
  if (clone.couple?.groom?.image?.startsWith('data:image/')) {
    const slotKey = 'groom_photo';
    const dataUrl = clone.couple.groom.image;
    clone.couple.groom.image = `cloudphoto:${slotKey}`;
    savePromises.push(savePhotoBySlot(slotKey, dataUrl));
  }

  // Bride image
  if (clone.couple?.bride?.image?.startsWith('data:image/')) {
    const slotKey = 'bride_photo';
    const dataUrl = clone.couple.bride.image;
    clone.couple.bride.image = `cloudphoto:${slotKey}`;
    savePromises.push(savePhotoBySlot(slotKey, dataUrl));
  }

  // Gallery photos
  if (Array.isArray(clone.gallery)) {
    clone.gallery.forEach((item, index) => {
      if (item.url?.startsWith('data:image/')) {
        const slotKey = `gallery_${item.id || index}`;
        const dataUrl = item.url;
        item.url = `cloudphoto:${slotKey}`;
        savePromises.push(savePhotoBySlot(slotKey, dataUrl));
      }
    });
  }

  // Wait for all individual photo documents to save
  await Promise.all(savePromises);
  return clone;
}

/**
 * Fetch wedding data once from Cloud Firestore and hydrate all photos
 */
export async function fetchWeddingDataFromCloud(): Promise<WeddingData | null> {
  try {
    const docRef = doc(db, WEDDING_DOC_COLLECTION, WEDDING_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return await hydratePhotos(snap.data() as WeddingData);
    }
    return null;
  } catch (error) {
    console.warn('Could not fetch wedding data from Cloud Firestore:', error);
    return null;
  }
}

/**
 * Save wedding data into Cloud Firestore.
 * Automatically saves photos to dedicated photo documents so the main config document never exceeds 1MB.
 */
export async function saveWeddingDataToCloud(data: WeddingData): Promise<void> {
  try {
    const decoupled = await extractAndSavePhotos(data);
    const docRef = doc(db, WEDDING_DOC_COLLECTION, WEDDING_DOC_ID);
    const sanitized = sanitizeForFirestore(decoupled);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (error) {
    console.error('Failed to save wedding data to Cloud Firestore:', error);
    throw error;
  }
}

/**
 * Real-time listener for live wedding data updates across all open devices.
 * Automatically hydrates photo pointers whenever new updates arrive.
 */
export function subscribeToWeddingData(
  onUpdate: (data: WeddingData) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    const docRef = doc(db, WEDDING_DOC_COLLECTION, WEDDING_DOC_ID);
    return onSnapshot(
      docRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          try {
            const rawData = snapshot.data() as WeddingData;
            const hydrated = await hydratePhotos(rawData);
            onUpdate(hydrated);
          } catch (err) {
            console.error('Error hydrating photos from snapshot:', err);
          }
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
