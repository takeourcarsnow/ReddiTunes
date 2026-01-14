'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Track } from '@/types';

interface PlayerState {
  currentTrack: Track | null;
  isLoading: boolean;
  repeatMode: 'off' | 'one' | 'all';
  isPlaying: boolean;
  
  setCurrentTrack: (track: Track | null) => void;
  setIsLoading: (loading: boolean) => void;
  setRepeatMode: (mode: 'off' | 'one' | 'all') => void;
  setIsPlaying: (playing: boolean) => void;
  cycleRepeatMode: () => void;
} 

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      isLoading: false,
      repeatMode: 'off',
      isPlaying: false,

      setCurrentTrack: (track) => {
        set({ currentTrack: track, isLoading: true });
      },
      setIsLoading: (loading) => set({ isLoading: loading }),
      setRepeatMode: (mode) => set({ repeatMode: mode }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),

      cycleRepeatMode: () => {
        const modes: ('off' | 'one' | 'all')[] = ['off', 'one', 'all'];
        const currentIndex = modes.indexOf(get().repeatMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        set({ repeatMode: modes[nextIndex] });
      },
    }),
    {
      name: 'reddituunes-player',
      partialize: (state) => ({
        repeatMode: state.repeatMode,
      }),
    }
  )
);
