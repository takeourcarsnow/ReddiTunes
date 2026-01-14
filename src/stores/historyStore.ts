'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Track } from '@/types';
import { generateId } from '@/lib/utils';

export interface PlayedEntry {
  id: string;
  track: Track;
  playedAt: number; // unix seconds
}

interface HistoryState {
  entries: PlayedEntry[];
  addEntry: (track: Track) => void;
  removeEntry: (entryId: string) => void;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (track) =>
        set((state) => {
          const now = Math.floor(Date.now() / 1000);
          // If most recent entry is same track, update timestamp and move to front
          const mostRecent = state.entries[0];
          if (mostRecent && mostRecent.track.id === track.id) {
            const updated = [{ ...mostRecent, playedAt: now }, ...state.entries.slice(1)];
            return { entries: updated };
          }

          const newEntry: PlayedEntry = {
            id: generateId(),
            track,
            playedAt: now,
          };
          const next = [newEntry, ...state.entries].slice(0, 200); // cap 200
          return { entries: next };
        }),
      removeEntry: (entryId) => set((state) => ({ entries: state.entries.filter((e) => e.id !== entryId) })),
      clear: () => set({ entries: [] }),
    }),
    {
      name: 'reddituunes-history',
      partialize: (state) => ({ entries: state.entries }),
    }
  )
);
