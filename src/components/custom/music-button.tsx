'use client';

import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

import { useAudioPlayer } from '@src/hooks/use-audio-player';

export const MusicToggleButton = () => {
  const bars = 5;

  const getRandomHeights = () => {
    return Array.from({ length: bars }, () => Math.random() * 0.8 + 0.2);
  };

  const [heights, setHeights] = useState(getRandomHeights());

  const { isPlaying, play, pause } = useAudioPlayer({
    src: '/assets/audio/Weese.flac',
    loop: true,
    autoplay: true,
    volume: 0.75,
  });

  useEffect(() => {
    if (isPlaying) {
      const waveformIntervalId = setInterval(() => {
        setHeights(getRandomHeights());
      }, 100);

      return () => {
        clearInterval(waveformIntervalId);
      };
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeights(Array(bars).fill(0.1));
  }, [isPlaying]);

  const handleClick = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <>
      <motion.div
        onClick={handleClick}
        key="audio"
        initial={{ padding: '14px 14px ' }}
        whileHover={{ padding: '18px 22px ' }}
        whileTap={{ padding: '18px 22px ' }}
        transition={{ duration: 1, bounce: 0.6, type: 'spring' }}
        className="border-foreground bg-background/80 supports-[backdrop-filter]:bg-background/80 cursor-pointer rounded-full border p-2"
      >
        <motion.div
          initial={{ opacity: 0, filter: 'blur(4px)' }}
          animate={{
            opacity: 1,
            filter: 'blur(0px)',
          }}
          exit={{ opacity: 0, filter: 'blur(4px)' }}
          transition={{ type: 'spring', bounce: 0.35 }}
          className="flex h-[18px] w-full items-center gap-1 rounded-full"
        >
          {/* Waveform visualization */}
          {heights.map((height, index) => (
            <motion.div
              key={index}
              className="bg-foreground w-px rounded-full"
              initial={{ height: 1 }}
              animate={{
                height: Math.max(4, height * 14),
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 10,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </>
  );
};
