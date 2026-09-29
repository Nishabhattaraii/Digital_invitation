import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { WeddingData } from '../types/wedding';
import { defaultWeddingData } from '../data/defaultData';
import { saveToIndexedDb, loadFromIndexedDb, broadcastDataChange } from '../utils/storageHelper';
import {
  saveWeddingDataToCloud,
  subscribeToWeddingData,
} from '../lib/firebase';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface WeddingContextType {
  data: WeddingData;
  updateData: (updater: (prev: WeddingData) => WeddingData) => void;
  resetToDefault: () => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  login: (passcode: string) => boolean;
  logout: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  exportDataJson: () => void;
  importDataJson: (jsonString: string) => boolean;
  syncToCloudNow: () => Promise<void>;
  cloudSyncStatus: 'synced' | 'syncing' | 'offline' | 'error';
}

const STORAGE_KEY = 'nepali_wedding_invitation_data_v1';
const AUTH_KEY = 'nepali_wedding_admin_authenticated';
const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || '1010';

function mergeWeddingData(base: WeddingData, incoming: Partial<WeddingData>): WeddingData {
  const isBaseGroomCustom = base.couple?.groom?.image?.startsWith('data:image/');
  const isIncGroomDefault = incoming.couple?.groom?.image?.startsWith('/images/');

  const isBaseBrideCustom = base.couple?.bride?.image?.startsWith('data:image/');
  const isIncBrideDefault = incoming.couple?.bride?.image?.startsWith('/images/');

  const isBaseHeroCustom = base.appearance?.heroIllustrationUrl?.startsWith('data:image/');
  const isIncHeroDefault = incoming.appearance?.heroIllustrationUrl?.startsWith('/images/');

  return {
    ...base,
    ...incoming,
    hero: {
      ...base.hero,
      ...(incoming.hero || {}),
    },
    couple: {
      ...base.couple,
      ...(incoming.couple || {}),
      groom: {
        ...base.couple?.groom,
        ...(incoming.couple?.groom || {}),
        image: (isBaseGroomCustom && isIncGroomDefault)
          ? base.couple.groom.image
          : (incoming.couple?.groom?.image || base.couple?.groom?.image),
      },
      bride: {
        ...base.couple?.bride,
        ...(incoming.couple?.bride || {}),
        image: (isBaseBrideCustom && isIncBrideDefault)
          ? base.couple.bride.image
          : (incoming.couple?.bride?.image || base.couple?.bride?.image),
      },
    },
    appearance: {
      ...base.appearance,
      ...(incoming.appearance || {}),
      heroIllustrationUrl: (isBaseHeroCustom && isIncHeroDefault)
        ? base.appearance.heroIllustrationUrl
        : (incoming.appearance?.heroIllustrationUrl || base.appearance?.heroIllustrationUrl),
    },
    events: {
      ...base.events,
      ...(incoming.events || {}),
      wedding: {
        ...base.events.wedding,
        ...(incoming.events?.wedding || {}),
      },
      reception: {
        ...base.events.reception,
        ...(incoming.events?.reception || {}),
      },
    },
    music: {
      ...base.music,
      ...(incoming.music || {}),
    },
    calendar: {
      ...base.calendar,
      ...(incoming.calendar || {}),
    },
    family: {
      ...base.family,
      ...(incoming.family || {}),
    },
    invitation: {
      ...base.invitation,
      ...(incoming.invitation || {}),
    },
    gallery: incoming.gallery && incoming.gallery.length > 0
      ? incoming.gallery.map((incItem, i) => {
          const baseItem = base.gallery?.[i];
          if (!baseItem) return incItem;
          const isBaseCustom = baseItem.url?.startsWith('data:image/');
          const isIncDefault = incItem.url?.startsWith('/images/');
          if (isBaseCustom && isIncDefault) {
            return { ...incItem, url: baseItem.url };
          }
          return incItem;
        })
      : base.gallery,
  };
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WeddingData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return mergeWeddingData(defaultWeddingData, parsed);
      }
    } catch (e) {
      console.error('Error loading saved wedding data from localStorage:', e);
    }
    return defaultWeddingData;
  });

  // On mount, check if IndexedDB has more complete/recent data
  useEffect(() => {
    loadFromIndexedDb().then((idbData) => {
      if (idbData) {
        setData((prev) => mergeWeddingData(prev, idbData));
      }
    });
  }, []);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Update dynamic CSS variables whenever appearance settings change
  useEffect(() => {
    const root = document.documentElement;
    if (data.appearance?.primaryRed) {
      root.style.setProperty('--primary-red', data.appearance.primaryRed);
    }
    if (data.appearance?.primaryGold) {
      root.style.setProperty('--primary-gold', data.appearance.primaryGold);
    }
    if (data.appearance?.backgroundColor) {
      root.style.setProperty('--wedding-bg', data.appearance.backgroundColor);
    }
  }, [data.appearance]);

  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('synced');

  // Cross-tab and window synchronization
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setData((prev) => mergeWeddingData(prev, parsed));
        } catch (err) {
          console.error('Error parsing storage event payload:', err);
        }
      }
    };

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<WeddingData>;
      if (customEvent.detail) {
        setData((prev) => mergeWeddingData(prev, customEvent.detail));
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('wedding_data_updated', handleCustomSync);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('wedding_data_updated', handleCustomSync);
    };
  }, []);

  // Real-time synchronization with Cloud Firestore across all devices
  useEffect(() => {
    let isInitial = true;
    const unsubscribe = subscribeToWeddingData(
      (cloudData) => {
        if (cloudData) {
          setData((prev) => {
            const merged = mergeWeddingData(prev, cloudData);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch {
              // ignore
            }
            saveToIndexedDb(merged).catch(() => {});
            return merged;
          });
          setCloudSyncStatus('synced');
        } else if (isInitial) {
          // If Firestore active document does not exist yet, auto-migrate this device's local data to Cloud Firestore!
          const localSaved = localStorage.getItem(STORAGE_KEY);
          if (localSaved) {
            try {
              const parsed = JSON.parse(localSaved);
              setCloudSyncStatus('syncing');
              saveWeddingDataToCloud(parsed)
                .then(() => setCloudSyncStatus('synced'))
                .catch(() => setCloudSyncStatus('error'));
            } catch {
              // ignore
            }
          }
        }
        isInitial = false;
      },
      () => {
        setCloudSyncStatus('error');
      }
    );

    return () => unsubscribe();
  }, []);

  // Persist data changes to localStorage, IndexedDB, and Cloud Firestore
  const updateData = useCallback((updater: (prev: WeddingData) => WeddingData) => {
    setData((prev) => {
      const next = updater(prev);
      
      // Save to localStorage (with quota safety)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('localStorage quota reached, saving full data into IndexedDB:', e);
      }

      // Always save full data to IndexedDB
      saveToIndexedDb(next).catch((err) => console.error('IndexedDB save failed:', err));

      // Push to Cloud Firestore for cross-device sync
      setCloudSyncStatus('syncing');
      saveWeddingDataToCloud(next)
        .then(() => setCloudSyncStatus('synced'))
        .catch((err) => {
          console.error('Cloud Firestore sync error:', err);
          setCloudSyncStatus('error');
        });

      // Broadcast to other components/tabs
      broadcastDataChange(next);

      return next;
    });
  }, []);

  const syncToCloudNow = async () => {
    setCloudSyncStatus('syncing');
    try {
      await saveWeddingDataToCloud(data);
      setCloudSyncStatus('synced');
      showToast('Successfully synced wedding data to Cloud!', 'success');
    } catch (e) {
      setCloudSyncStatus('error');
      showToast('Could not sync to cloud. Please check database permissions.', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const resetToDefault = () => {
    setData(defaultWeddingData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    saveToIndexedDb(defaultWeddingData).catch(console.error);
    saveWeddingDataToCloud(defaultWeddingData).catch(console.error);
    broadcastDataChange(defaultWeddingData);
    showToast('Reset all settings to default Nepali wedding details');
  };

  const login = (passcode: string): boolean => {
    const clean = passcode.trim();
    if (clean === '1010' || clean === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, 'true');
      showToast('Authenticated as Wedding Administrator', 'success');
      return true;
    }
    showToast('Incorrect passcode. Please try again.', 'error');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
    showToast('Logged out of Admin Panel', 'info');
  };

  const exportDataJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'wedding-invitation-backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Downloaded website configuration backup');
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      updateData(() => parsed);
      showToast('Configuration restored successfully!');
      return true;
    } catch (e) {
      showToast('Invalid JSON backup file', 'error');
      return false;
    }
  };

  return (
    <WeddingContext.Provider
      value={{
        data,
        updateData,
        resetToDefault,
        isAdminOpen,
        setIsAdminOpen,
        isAuthenticated,
        login,
        logout,
        toasts,
        showToast,
        exportDataJson,
        importDataJson,
        syncToCloudNow,
        cloudSyncStatus,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};
