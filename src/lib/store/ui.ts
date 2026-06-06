'use client';

import { create } from 'zustand';

interface UIState {
  mobileMenuOpen: boolean;
  megaMenuGroup: string | null;
  setMobileMenuOpen: (open: boolean) => void;
  setMegaMenuGroup: (group: string | null) => void;
  closeMobileMenu: () => void;
  closeAll: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  megaMenuGroup: null,
  setMobileMenuOpen: (open: boolean) => set({ mobileMenuOpen: open }),
  setMegaMenuGroup: (group: string | null) => set({ megaMenuGroup: group }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  closeAll: () => set({ mobileMenuOpen: false, megaMenuGroup: null }),
}));
