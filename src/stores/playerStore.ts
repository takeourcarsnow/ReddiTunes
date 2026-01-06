'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Track } from '@/types';

interface PlayerState {
  // Current state
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  isLoading: boolean;
  isMuted: boolean;
  repeatMode: 'off' | 'one' | 'all';
  
  // YouTube player reference
  playerRef: YT.Player | null;
  
  // Actions
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setIsLoading: (loading: boolean) => void;
  setIsMuted: (muted: boolean) => void;
  setRepeatMode: (mode: 'off' | 'one' | 'all') => void;
  setPlayerRef: (player: YT.Player | null) => void;
  
  // Player controls
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  cycleRepeatMode: () => void;
  seekTo: (seconds: number) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      isPlaying: false,
      volume: 80,
      progress: 0,
      duration: 0,
      isLoading: false,
      isMuted: false,
      repeatMode: 'off',
      playerRef: null,

      setCurrentTrack: (track) => set({ currentTrack: track, progress: 0, isLoading: true }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setVolume: (volume) => {
        set({ volume });
        const player = get().playerRef;
        if (player) {
          player.setVolume(volume);
        }
      },
      setProgress: (progress) => set({ progress }),
      setDuration: (duration) => set({ duration }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setIsMuted: (muted) => {
        set({ isMuted: muted });
        const player = get().playerRef;
        if (player) {
          if (muted) {
            player.mute();
          } else {
            player.unMute();
          }
        }
      },
      setRepeatMode: (mode) => set({ repeatMode: mode }),
      setPlayerRef: (player) => set({ playerRef: player }),

      play: () => {
        const player = get().playerRef;
        if (player) {
          player.playVideo();
          set({ isPlaying: true });
        }
      },

      pause: () => {
        const player = get().playerRef;
        if (player) {
          player.pauseVideo();
          set({ isPlaying: false });
        }
      },

      togglePlay: () => {
        const { isPlaying, play, pause } = get();
        if (isPlaying) {
          pause();
        } else {
          play();
        }
      },

      toggleMute: () => {
        const { isMuted, setIsMuted } = get();
        setIsMuted(!isMuted);
      },

      cycleRepeatMode: () => {
        const modes: ('off' | 'one' | 'all')[] = ['off', 'one', 'all'];
        const currentIndex = modes.indexOf(get().repeatMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        set({ repeatMode: modes[nextIndex] });
      },

      seekTo: (seconds) => {
        const player = get().playerRef;
        if (player) {
          player.seekTo(seconds, true);
          set({ progress: seconds });
        }
      },
    }),
    {
      name: 'ytterm-player',
      partialize: (state) => ({
        volume: state.volume,
        repeatMode: state.repeatMode,
      }),
    }
  )
);
