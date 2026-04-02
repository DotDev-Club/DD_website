"use client";

import { create } from "zustand";

interface AdminStore {
  isLoggedIn: boolean;
  adminEmail: string | null;
  setLoggedIn: (val: boolean, email?: string) => void;
  reset: () => void;
}

export const useStore = create<AdminStore>((set) => ({
  isLoggedIn: false,
  adminEmail: null,
  setLoggedIn: (val, email) => set({ isLoggedIn: val, adminEmail: email ?? null }),
  reset: () => set({ isLoggedIn: false, adminEmail: null }),
}));
