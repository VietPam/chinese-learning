// Audio service for Text-to-Speech (TTS) using Web Speech API
export const audioService = {
  speak: (text, lang = 'zh-CN') => {
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
    utterance.rate = 0.8; // Slow down a bit for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Speak
    speechSynthesis.speak(utterance);
  },

  cancel: () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  },

  isSupported: () => {
    return !!(
      window.SpeechSynthesisUtterance ||
      window.webkitSpeechSynthesisUtterance
    );
  },
};
