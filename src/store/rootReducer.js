import { combineReducers } from '@reduxjs/toolkit';
import chineseDigitsReducer from '../features/chineseDigits/store/chineseDigitsSlice';
import uiReducer from './uiSlice';
import progressReducer from './progressSlice';
import flashcardsReducer from '../features/flashcards/store/flashcardsSlice';
import quizReducer from '../features/quiz/store/quizSlice';

const rootReducer = combineReducers({
  chineseDigits: chineseDigitsReducer,
  ui: uiReducer,
  progress: progressReducer,
  flashcards: flashcardsReducer,
  quiz: quizReducer,
});

export default rootReducer;
