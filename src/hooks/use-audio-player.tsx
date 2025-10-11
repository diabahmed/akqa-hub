'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseAudioPlayerOptions {
  src: string;
  loop?: boolean;
  volume?: number;
  autoplay?: boolean;
}

interface UseAudioPlayerReturn {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  stop: () => void;
  duration: number | null;
}

export function useAudioPlayer({
  src,
  loop = false,
  volume = 1,
  autoplay = false,
}: UseAudioPlayerOptions): UseAudioPlayerReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const autoplayAttemptedRef = useRef(false);

  // Initialize Audio element
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume;
    audio.preload = 'auto';

    // Event listeners
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration * 1000);
    };
    const handleCanPlayThrough = () => {
      // Attempt autoplay when audio is ready
      if (autoplay && !autoplayAttemptedRef.current) {
        autoplayAttemptedRef.current = true;
        audio.play().catch(() => {
          // Autoplay was prevented by browser
          // Set up one-time listener for any user interaction
          const unlockAudio = () => {
            audio.play().catch(() => {
              // Still failed, do nothing
            });
            // Remove all event listeners after first attempt
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
          };

          document.addEventListener('click', unlockAudio, { once: true });
          document.addEventListener('touchstart', unlockAudio, { once: true });
          document.addEventListener('keydown', unlockAudio, { once: true });
        });
      }
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);

    audioRef.current = audio;

    // Cleanup
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.pause();
      audio.src = '';
    };
  }, [src, loop, volume, autoplay]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Play failed:', error);
      });
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return {
    isPlaying,
    play,
    pause,
    stop,
    duration,
  };
}
