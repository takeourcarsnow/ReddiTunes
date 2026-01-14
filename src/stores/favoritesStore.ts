'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Track } from '@/types';

interface FavoritesState {
  favorites: Track[];
  addFavorite: (track: Track) => void;
  removeFavorite: (youtubeId: string) => void;
  toggleFavorite: (track: Track) => void;
  isFavorite: (youtubeId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (track) =>
        set((state) => ({ favorites: [track, ...state.favorites.filter((t) => t.youtubeId !== track.youtubeId)] })),
      removeFavorite: (trackId) => set((state) => ({ favorites: state.favorites.filter((t) => t.youtubeId !== trackId) })),
      toggleFavorite: (track) =>
        set((state) => {
          const exists = state.favorites.find((t) => t.youtubeId === track.youtubeId);
          if (exists) return { favorites: state.favorites.filter((t) => t.youtubeId !== track.youtubeId) };
          return { favorites: [track, ...state.favorites] };
        }),
      isFavorite: (trackId) => get().favorites.some((t) => t.youtubeId === trackId),
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'reddituunes-favorites',
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);
