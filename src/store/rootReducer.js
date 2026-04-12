import { combineReducers } from '@reduxjs/toolkit';
import chineseDigitsReducer from '../features/chineseDigits/store/chineseDigitsSlice';

const rootReducer = combineReducers({
  chineseDigits: chineseDigitsReducer,
});

export default rootReducer;
