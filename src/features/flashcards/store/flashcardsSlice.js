import { createSlice } from '@reduxjs/toolkit';
import { digitsData } from '../../chineseDigits/data/digitsData';

const initialState = {
  cards: digitsData.map(digit => ({
    ...digit,
    difficulty: 'medium', // easy, medium, hard
    timesReviewed: 0,
    lastReviewed: null,
    correctCount: 0,
    incorrectCount: 0,
  })),
  currentIndex: 0,
  sessionStats: {
    totalReviewed: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    startTime: null,
  },
  isSessionActive: false,
  showMode: 'chinese-to-vietnamese', // chinese-to-vietnamese, vietnamese-to-chinese, pinyin-to-chinese
};

const flashcardsSlice = createSlice({
  name: 'flashcards',
  initialState,
  reducers: {
    startSession: (state, action) => {
      state.isSessionActive = true;
      state.sessionStats.startTime = Date.now();
      state.sessionStats.totalReviewed = 0;
      state.sessionStats.correctAnswers = 0;
      state.sessionStats.incorrectAnswers = 0;
      state.currentIndex = 0;
    },
    endSession: (state) => {
      state.isSessionActive = false;
      state.sessionStats.startTime = null;
    },
    nextCard: (state) => {
      if (state.currentIndex < state.cards.length - 1) {
        state.currentIndex += 1;
      } else {
        // Loop back to beginning
        state.currentIndex = 0;
      }
    },
    previousCard: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
      } else {
        // Go to last card
        state.currentIndex = state.cards.length - 1;
      }
    },
    markCorrect: (state) => {
      const card = state.cards[state.currentIndex];
      card.correctCount += 1;
      card.timesReviewed += 1;
      card.lastReviewed = Date.now();
      // Decrease difficulty if consistently correct
      if (card.correctCount > card.incorrectCount + 2) {
        card.difficulty = card.difficulty === 'hard' ? 'medium' : 'easy';
      }

      state.sessionStats.correctAnswers += 1;
      state.sessionStats.totalReviewed += 1;
    },
    markIncorrect: (state) => {
      const card = state.cards[state.currentIndex];
      card.incorrectCount += 1;
      card.timesReviewed += 1;
      card.lastReviewed = Date.now();
      // Increase difficulty if incorrect
      if (card.incorrectCount > card.correctCount) {
        card.difficulty = card.difficulty === 'easy' ? 'medium' : 'hard';
      }

      state.sessionStats.incorrectAnswers += 1;
      state.sessionStats.totalReviewed += 1;
    },
    setShowMode: (state, action) => {
      state.showMode = action.payload;
    },
    shuffleCards: (state) => {
      // Fisher-Yates shuffle
      for (let i = state.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.cards[i], state.cards[j]] = [state.cards[j], state.cards[i]];
      }
      state.currentIndex = 0;
    },
    resetProgress: (state) => {
      state.cards.forEach(card => {
        card.difficulty = 'medium';
        card.timesReviewed = 0;
        card.lastReviewed = null;
        card.correctCount = 0;
        card.incorrectCount = 0;
      });
      state.currentIndex = 0;
      state.sessionStats = {
        totalReviewed: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        startTime: null,
      };
    },
  },
});

export const {
  startSession,
  endSession,
  nextCard,
  previousCard,
  markCorrect,
  markIncorrect,
  setShowMode,
  shuffleCards,
  resetProgress,
} = flashcardsSlice.actions;

export default flashcardsSlice.reducer;