import { createSlice } from '@reduxjs/toolkit';
import { digitsData } from '../data/digitsData';

const initialState = {
  digits: digitsData,
  loading: false,
  error: null,
};

const chineseDigitsSlice = createSlice({
  name: 'chineseDigits',
  initialState,
  reducers: {
    // Add actions here if needed in the future
  },
});

export default chineseDigitsSlice.reducer;
