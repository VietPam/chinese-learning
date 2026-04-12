import { createSlice } from '@reduxjs/toolkit';
import { digitsData } from '../data/digitsData';

const initialState = {
  digits: digitsData,
  favorites: [], // Array of digit values (0-10) that are favorited
  loading: false,
  error: null,
};

const chineseDigitsSlice = createSlice({
  name: 'chineseDigits',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const digit = action.payload;
      const index = state.favorites.indexOf(digit);
      if (index > -1) {
        state.favorites.splice(index, 1); // Remove if exists
      } else {
        state.favorites.push(digit); // Add if not exists
      }
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
  },
});

export const { toggleFavorite, setFavorites } = chineseDigitsSlice.actions;
export default chineseDigitsSlice.reducer;
