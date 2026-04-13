import { createSlice } from '@reduxjs/toolkit';
import { generateRandomQuiz } from '../utils/quizGenerator';

const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  sessionStats: {
    correctAnswers: 0,
    incorrectAnswers: 0,
    totalQuestions: 0,
    startTime: null,
    endTime: null,
  },
  isSessionActive: false,
  isSessionComplete: false,
  selectedAnswer: null,
  showResult: false,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz: (state, action) => {
      const { questionCount = 10 } = action.payload || {};
      state.questions = generateRandomQuiz(questionCount);
      state.currentQuestionIndex = 0;
      state.isSessionActive = true;
      state.isSessionComplete = false;
      state.sessionStats = {
        correctAnswers: 0,
        incorrectAnswers: 0,
        totalQuestions: questionCount,
        startTime: Date.now(),
        endTime: null,
      };
      state.selectedAnswer = null;
      state.showResult = false;
    },
    selectAnswer: (state, action) => {
      state.selectedAnswer = action.payload;
    },
    submitAnswer: (state, action) => {
      const { isCorrect } = action.payload || {};
      if (isCorrect) {
        state.sessionStats.correctAnswers += 1;
      } else {
        state.sessionStats.incorrectAnswers += 1;
      }
      state.showResult = true;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
        state.selectedAnswer = null;
        state.showResult = false;
      } else {
        state.isSessionActive = false;
        state.isSessionComplete = true;
        state.sessionStats.endTime = Date.now();
      }
    },
    endQuiz: (state) => {
      state.isSessionActive = false;
      state.isSessionComplete = true;
      state.sessionStats.endTime = Date.now();
    },
    resetQuiz: (state) => {
      return initialState;
    },
  },
});

export const {
  startQuiz,
  selectAnswer,
  submitAnswer,
  nextQuestion,
  endQuiz,
  resetQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;