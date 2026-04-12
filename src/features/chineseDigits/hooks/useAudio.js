import { useState } from 'react';
import { audioService } from '../services/audioService';

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (text, lang = 'zh-CN') => {
    try {
      setIsPlaying(true);
      audioService.speak(text, lang);
      // Assume audio finishes in ~2 seconds (Web Speech API doesn't give exact end time)
      setTimeout(() => setIsPlaying(false), 2000);
    } catch (error) {
      console.error('Audio error:', error);
      setIsPlaying(false);
    }
  };

  const stop = () => {
    audioService.cancel();
    setIsPlaying(false);
  };

  const isSupported = audioService.isSupported();

  return {
    play,
    stop,
    isPlaying,
    isSupported,
  };
};
