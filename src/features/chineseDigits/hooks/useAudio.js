import { useState, useEffect } from 'react';
import { audioService } from '../../../services/audioService';

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize audio service on component mount (warm up Web Speech API)
  useEffect(() => {
    audioService.init();
  }, []);

  const play = (text, lang = 'zh-CN') => {
    try {
      // Don't play if already playing
      if (isPlaying) {
        return;
      }

      // Use callbacks for accurate state management instead of setTimeout
      audioService.speak(
        text,
        lang,
        // onStart callback
        () => {
          setIsPlaying(true);
        },
        // onEnd callback
        () => {
          setIsPlaying(false);
        }
      );
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
