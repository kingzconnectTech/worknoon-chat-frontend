import { create } from 'zustand';

const useOfflineStore = create((set) => {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => set({ isOnline: true }));
    window.addEventListener('offline', () => set({ isOnline: false }));
  }

  return {
    isOnline,
  };
});

export default useOfflineStore;
