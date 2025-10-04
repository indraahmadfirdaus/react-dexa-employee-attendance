import { create } from 'zustand'

export const useLocationStore = create((set) => ({
  location: null,
  hasPermission: false,
  error: null,
  
  setLocation: (location) => set({ location }),
  setPermission: (hasPermission) => set({ hasPermission }),
  setError: (error) => set({ error }),
  reset: () => set({ location: null, error: null }),
}))