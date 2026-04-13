import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addXP, incrementActivity } from '../../../store/progressSlice';
import { calculateFlashcardXP } from '../../../utils/xpCalculator';

export const useFlashcardXP = () => {
  const dispatch = useDispatch();

  const awardFlashcardXP = useCallback((isCorrect) => {
    const xpReward = calculateFlashcardXP(isCorrect);
    dispatch(addXP(xpReward));
    dispatch(incrementActivity('flashcardsReviewed'));
    return xpReward;
  }, [dispatch]);

  return { awardFlashcardXP };
};