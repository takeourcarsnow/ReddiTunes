'use client';

import { usePlayerStore, usePlaylistStore } from '@/stores';
import { formatTime } from '@/lib/utils';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  Volume2,
  VolumeX,
  Volume1,
} from 'lucide-react';
import { VolumeSlider } from './VolumeSlider';
import { ProgressBar } from './ProgressBar';

export function PlayerControls() {
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    repeatMode,
    progress,
    duration,
    togglePlay,
    toggleMute,
    cycleRepeatMode,
    setVolume,
    seekTo,
  } = usePlayerStore();

  const { nextTrack, previousTrack, toggleShuffle, isShuffled } = usePlaylistStore();

  const handlePrevious = () => {
    if (progress > 3) {
      seekTo(0);
    } else {
      previousTrack();
    }
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;
  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  return (
    <div className="border border-terminal-border bg-terminal-bg p-2 space-y-2">
      {/* Progress bar */}
      <ProgressBar progress={progress} duration={duration} onSeek={seekTo} />

      {/* Time display */}
      <div className="flex justify-between font-mono text-[10px] text-terminal-muted">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Left controls */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={toggleShuffle}
            className={`p-1.5 ${isShuffled ? 'text-terminal-accent' : 'text-terminal-muted'}`}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={cycleRepeatMode}
            className={`p-1.5 ${repeatMode !== 'off' ? 'text-terminal-accent' : 'text-terminal-muted'}`}
          >
            <RepeatIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevious}
            disabled={!currentTrack}
            className="p-1.5 text-terminal-text disabled:opacity-40"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlay}
            disabled={!currentTrack}
            className="p-2 border border-terminal-accent text-terminal-accent disabled:opacity-40"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={() => nextTrack()}
            disabled={!currentTrack}
            className="p-1.5 text-terminal-text disabled:opacity-40"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <button onClick={toggleMute} className="p-1.5 text-terminal-muted">
            <VolumeIcon className="w-3.5 h-3.5" />
          </button>
          <div className="hidden sm:block w-16">
            <VolumeSlider volume={isMuted ? 0 : volume} onChange={setVolume} />
          </div>
        </div>
      </div>

      {/* Track info */}
      {currentTrack && (
        <div className="text-center border-t border-terminal-border pt-2">
          <div className="font-mono text-xs text-terminal-text truncate">{currentTrack.title}</div>
          {currentTrack.artist && (
            <div className="font-mono text-[10px] text-terminal-accent truncate">{currentTrack.artist}</div>
          )}
        </div>
      )}
    </div>
  );
}
