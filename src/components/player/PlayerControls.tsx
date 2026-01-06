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

  const { nextTrack, previousTrack, toggleShuffle, isShuffled, queue } = usePlaylistStore();

  const handlePrevious = () => {
    if (progress > 3) {
      seekTo(0);
    } else {
      previousTrack();
    }
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;
  const repeatActive = repeatMode !== 'off';

  return (
    <div className="border border-terminal-border bg-terminal-bg p-3 space-y-3">
      {/* Progress bar */}
      <ProgressBar
        progress={progress}
        duration={duration}
        onSeek={seekTo}
      />

      {/* Time display */}
      <div className="flex justify-between font-mono text-xs text-terminal-muted">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Left controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded hover:bg-terminal-hover transition-colors ${
              isShuffled ? 'text-terminal-accent' : 'text-terminal-muted'
            }`}
            aria-label="Toggle shuffle"
            disabled={queue.length === 0}
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={cycleRepeatMode}
            className={`p-2 rounded hover:bg-terminal-hover transition-colors ${
              repeatActive ? 'text-terminal-accent' : 'text-terminal-muted'
            }`}
            aria-label={`Repeat: ${repeatMode}`}
          >
            <RepeatIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Center controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            className="p-2 rounded hover:bg-terminal-hover transition-colors text-terminal-text disabled:opacity-50"
            aria-label="Previous track"
            disabled={!currentTrack}
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={togglePlay}
            className="p-3 rounded-full border-2 border-terminal-accent bg-terminal-accent/10 hover:bg-terminal-accent/20 transition-colors text-terminal-accent disabled:opacity-50"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            disabled={!currentTrack}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>
          <button
            onClick={() => nextTrack()}
            className="p-2 rounded hover:bg-terminal-hover transition-colors text-terminal-text disabled:opacity-50"
            aria-label="Next track"
            disabled={!currentTrack}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Right controls - Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded hover:bg-terminal-hover transition-colors text-terminal-muted"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <VolumeIcon className="w-4 h-4" />
          </button>
          <div className="hidden sm:block w-20">
            <VolumeSlider
              volume={isMuted ? 0 : volume}
              onChange={setVolume}
            />
          </div>
        </div>
      </div>

      {/* Track info */}
      {currentTrack && (
        <div className="text-center border-t border-terminal-border pt-3">
          <div className="font-mono text-sm text-terminal-text truncate">
            {currentTrack.title}
          </div>
          {currentTrack.artist && (
            <div className="font-mono text-xs text-terminal-accent truncate">
              {currentTrack.artist}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
