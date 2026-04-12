// Audio service for Text-to-Speech (TTS) using Web Speech API with performance optimization
let isInitialized = false;
let currentUtterance = null;

export const audioService = {
  /**
   * Initialize Web Speech API on first use
   * This preloads the voice engine for faster subsequent calls
   */
  init: () => {
    if (isInitialized) return;

    const speechSynthesis = window.speechSynthesis;
    if (!speechSynthesis) return;

    // Warm up the Web Speech API
    const utterance = new window.SpeechSynthesisUtterance('');
    utterance.volume = 0; // Silent test utterance
    speechSynthesis.speak(utterance);
    speechSynthesis.cancel();

    isInitialized = true;
  },

  speak: (text, lang = 'zh-CN', onStart, onEnd) => {
    // Check if browser supports Web Speech API
    const SpeechSynthesisUtterance =
      window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance;
    const speechSynthesis = window.speechSynthesis;

    if (!SpeechSynthesisUtterance || !speechSynthesis) {
      console.warn('Web Speech API not supported');
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0; // Normal speed (1.0 = 100%, faster than 0.8)
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Add event listeners for better feedback
    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
      currentUtterance = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      if (onEnd) onEnd();
      currentUtterance = null;
    };

    currentUtterance = utterance;

    // Speak immediately
    speechSynthesis.speak(utterance);
  },

  cancel: () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    }
  },

  isSupported: () => {
    return !!(
      window.SpeechSynthesisUtterance ||
      window.webkitSpeechSynthesisUtterance
    );
  },

  isSpeaking: () => {
    return window.speechSynthesis && window.speechSynthesis.speaking;
  },
};
