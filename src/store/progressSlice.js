import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalXP: 0,
  completedActivities: {
    digitsLearned: 0,
    quizzesCompleted: 0,
    flashcardsReviewed: 0,
  },
  achievements: [],
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    addXP: (state, action) => {
      state.totalXP += action.payload;
    },
    incrementActivity: (state, action) => {
      const { activityType } = action.payload;
      if (state.completedActivities[activityType] !== undefined) {
        state.completedActivities[activityType] += 1;
      }
    },
    addAchievement: (state, action) => {
      state.achievements.push(action.payload);
    },
    resetProgress: (state) => {
      state.totalXP = 0;
      state.completedActivities = {
        digitsLearned: 0,
        quizzesCompleted: 0,
        flashcardsReviewed: 0,
      };
      state.achievements = [];
    },
  },
});

export const { addXP, incrementActivity, addAchievement, resetProgress } = progressSlice.actions;

export default progressSlice.reducer;