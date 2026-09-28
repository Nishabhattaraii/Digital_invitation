import type { WeddingData } from '../types/wedding';

const DB_NAME = 'NepaliWeddingDb';
const DB_VERSION = 1;
const STORE_NAME = 'weddingConfig';
const KEY_NAME = 'active_wedding_data';

// Open IndexedDB
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save wedding data into IndexedDB (supports large payloads and images)
 */
export async function saveToIndexedDb(data: WeddingData): Promise<void> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, KEY_NAME);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not persist to IndexedDB:', err);
  }
}

/**
 * Load wedding data from IndexedDB
 */
export async function loadFromIndexedDb(): Promise<WeddingData | null> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(KEY_NAME);
      req.onsuccess = () => resolve((req.result as WeddingData) || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Broadcast update event across open browser tabs
 */
export function broadcastDataChange(data: WeddingData) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('wedding_data_updated', { detail: data }));
  }
}
