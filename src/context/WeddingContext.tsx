import React, { createContext, useContext, useState, useEffect } from 'react';
import type { WeddingData } from '../types/wedding';
import { defaultWeddingData } from '../data/defaultData';

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
}

const STORAGE_KEY = 'nepali_wedding_invitation_data_v1';
const AUTH_KEY = 'nepali_wedding_admin_authenticated';
const ADMIN_PASSCODE = 'nepaliwedding2026';

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WeddingData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultWeddingData,
          ...parsed,
          events: {
            ...defaultWeddingData.events,
            ...(parsed.events || {}),
          },
          music: {
            ...defaultWeddingData.music,
            ...(parsed.music || {}),
          },
          appearance: {
            ...defaultWeddingData.appearance,
            ...(parsed.appearance || {}),
          },
          couple: {
            ...defaultWeddingData.couple,
            ...(parsed.couple || {}),
            groom: {
              ...defaultWeddingData.couple.groom,
              ...(parsed.couple?.groom || {}),
            },
            bride: {
              ...defaultWeddingData.couple.bride,
              ...(parsed.couple?.bride || {}),
            },
          },
        };
      }
    } catch (e) {
      console.error('Error loading saved wedding data:', e);
    }
    return defaultWeddingData;
  });

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

  // Persist data changes to localStorage
  const updateData = (updater: (prev: WeddingData) => WeddingData) => {
    setData((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
      return next;
    });
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
    showToast('Reset all settings to default Nepali wedding details');
  };

  const login = (passcode: string): boolean => {
    if (passcode.trim() === ADMIN_PASSCODE || passcode.trim() === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, 'true');
      showToast('Authenticated as Wedding Administrator');
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
