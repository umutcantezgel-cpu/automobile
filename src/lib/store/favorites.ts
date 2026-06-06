'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  count: () => number;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: ['v1', 'v3'],
      toggle: (id: string) => {
        const current = get().ids;
        if (current.includes(id)) {
          set({ ids: current.filter((x) => x !== id) });
        } else {
          set({ ids: [...current, id] });
        }
      },
      has: (id: string) => get().ids.includes(id),
      count: () => get().ids.length,
      clear: () => set({ ids: [] }),
    }),
    { name: 'apex-favs' }
  )
);
