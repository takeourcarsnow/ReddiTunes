'use client';

import { useEffect, useRef, useCallback } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { usePlayerStore, usePlaylistStore } from '@/stores';
import { YOUTUBE_PLAYER_OPTIONS, PLAYER_STATES } from '@/lib/youtube';
import { TerminalWindow } from '@/components/terminal';
import { Loading } from '@/components/ui';

export function Player() {
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    isLoading,
    setPlayerRef,
    setIsPlaying,
    setDuration,
    setProgress,
    setIsLoading,
    repeatMode,
  } = usePlayerStore();

  const { nextTrack, queueIndex, queue } = usePlaylistStore();

  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);

  const startProgressTracking = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    progressInterval.current = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        setProgress(currentTime);
      }
    }, 250);
  }, [setProgress]);

  const stopProgressTracking = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);

  const onReady = useCallback((event: YouTubeEvent) => {
    playerRef.current = event.target;
    setPlayerRef(event.target);
    event.target.setVolume(volume);
    if (isMuted) {
      event.target.mute();
    }
  }, [setPlayerRef, volume, isMuted]);

  const onStateChange = useCallback((event: YouTubeEvent) => {
    const state = event.data;

    switch (state) {
      case PLAYER_STATES.PLAYING:
        setIsPlaying(true);
        setIsLoading(false);
        setDuration(event.target.getDuration());
        startProgressTracking();
        break;
      case PLAYER_STATES.PAUSED:
        setIsPlaying(false);
        stopProgressTracking();
        break;
      case PLAYER_STATES.ENDED:
        stopProgressTracking();
        if (repeatMode === 'one') {
          event.target.seekTo(0);
          event.target.playVideo();
        } else {
          nextTrack();
        }
        break;
      case PLAYER_STATES.BUFFERING:
        setIsLoading(true);
        break;
      case PLAYER_STATES.CUED:
        setIsLoading(false);
        break;
    }
  }, [setIsPlaying, setIsLoading, setDuration, startProgressTracking, stopProgressTracking, repeatMode, nextTrack]);

  const onError = useCallback(() => {
    setIsLoading(false);
    setIsPlaying(false);
    // Auto-skip to next track on error
    setTimeout(() => {
      nextTrack();
    }, 1000);
  }, [setIsLoading, setIsPlaying, nextTrack]);

  useEffect(() => {
    return () => {
      stopProgressTracking();
    };
  }, [stopProgressTracking]);

  // Auto-play when current track changes
  useEffect(() => {
    if (currentTrack && playerRef.current) {
      setIsLoading(true);
    }
  }, [currentTrack, setIsLoading]);

  return (
    <TerminalWindow 
      title={currentTrack ? `♪ ${currentTrack.title}` : '♪ NO TRACK LOADED'}
      className="h-full"
    >
      <div className="relative aspect-video w-full bg-black">
        {currentTrack ? (
          <>
            <YouTube
              videoId={currentTrack.youtubeId}
              opts={YOUTUBE_PLAYER_OPTIONS}
              onReady={onReady}
              onStateChange={onStateChange}
              onError={onError}
              className="absolute inset-0 w-full h-full"
              iframeClassName="w-full h-full"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <Loading text="Buffering" />
              </div>
            )}
            {/* Track info overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <div className="font-mono text-xs text-white/80 truncate">
                {currentTrack.artist && (
                  <span className="text-terminal-accent">{currentTrack.artist} - </span>
                )}
                {currentTrack.title}
              </div>
              <div className="font-mono text-xs text-white/50">
                Track {queueIndex + 1} of {queue.length}
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="font-mono text-terminal-muted text-4xl mb-4">▶</div>
              <p className="font-mono text-sm text-terminal-muted">
                Select a genre to start playing
              </p>
            </div>
          </div>
        )}
      </div>
    </TerminalWindow>
  );
}
