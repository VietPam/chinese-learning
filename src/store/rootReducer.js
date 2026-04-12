import { combineReducers } from '@reduxjs/toolkit';
import chineseDigitsReducer from '../features/chineseDigits/store/chineseDigitsSlice';
import uiReducer from './uiSlice';

const rootReducer = combineReducers({
  chineseDigits: chineseDigitsReducer,
  ui: uiReducer,
});

export default rootReducer;
