'use client';

import React, { createContext, useContext, ReactNode } from 'react';

import { useAudioPlayer } from '@src/hooks/use-audio-player';

interface AudioContextType {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  stop: () => void;
  duration: number | null;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioPlayer = useAudioPlayer({
    src: '/assets/audio/Weese.flac',
    loop: true,
    autoplay: true,
    volume: 0.75,
  });

  return <AudioContext.Provider value={audioPlayer}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
