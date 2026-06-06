'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareState {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  count: () => number;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id: string) => {
        const current = get().ids;
        if (current.length < 4 && !current.includes(id)) {
          set({ ids: [...current, id] });
        }
      },
      remove: (id: string) => {
        set({ ids: get().ids.filter((x) => x !== id) });
      },
      toggle: (id: string) => {
        const current = get().ids;
        if (current.includes(id)) {
          set({ ids: current.filter((x) => x !== id) });
        } else if (current.length < 4) {
          set({ ids: [...current, id] });
        }
      },
      has: (id: string) => get().ids.includes(id),
      count: () => get().ids.length,
      clear: () => set({ ids: [] }),
    }),
    { name: 'apex-compare' }
  )
);
