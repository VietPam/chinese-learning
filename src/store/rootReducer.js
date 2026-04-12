import { combineReducers } from '@reduxjs/toolkit';
import chineseDigitsReducer from '../features/chineseDigits/store/chineseDigitsSlice';
import uiReducer from './uiSlice';
import progressReducer from './progressSlice';
import flashcardsReducer from '../features/flashcards/store/flashcardsSlice';

const rootReducer = combineReducers({
  chineseDigits: chineseDigitsReducer,
  ui: uiReducer,
  progress: progressReducer,
  flashcards: flashcardsReducer,
});

export default rootReducer;
