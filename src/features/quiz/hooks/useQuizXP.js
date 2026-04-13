import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addXP, incrementActivity } from '../../../store/progressSlice';
import { calculateQuizXP } from '../../../utils/xpCalculator';

export const useQuizXP = () => {
  const dispatch = useDispatch();

  const awardQuizXP = useCallback((correctAnswers, totalQuestions) => {
    const xpReward = calculateQuizXP(correctAnswers, totalQuestions);
    dispatch(addXP(xpReward));
    dispatch(incrementActivity('quizzesCompleted'));
    return xpReward;
  }, [dispatch]);

  return { awardQuizXP };
};