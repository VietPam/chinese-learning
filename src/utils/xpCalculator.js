import { XP_CONFIG } from '../config/xpConfig';

/**
 * Calculate XP reward based on quiz performance
 * @param {number} correctAnswers - Number of correct answers
 * @param {number} totalQuestions - Total questions in the quiz
 * @returns {number} XP reward amount
 */
export const calculateQuizXP = (correctAnswers, totalQuestions) => {
  const percentage = (correctAnswers / totalQuestions) * 100;

  if (percentage === XP_CONFIG.THRESHOLDS.PERFECT) return XP_CONFIG.QUIZ.PERFECT;
  if (percentage >= XP_CONFIG.THRESHOLDS.EXCELLENT) return XP_CONFIG.QUIZ.EXCELLENT;
  if (percentage >= XP_CONFIG.THRESHOLDS.VERY_GOOD) return XP_CONFIG.QUIZ.VERY_GOOD;
  if (percentage >= XP_CONFIG.THRESHOLDS.GOOD) return XP_CONFIG.QUIZ.GOOD;
  if (percentage >= XP_CONFIG.THRESHOLDS.FAIR) return XP_CONFIG.QUIZ.FAIR;
  return XP_CONFIG.QUIZ.KEEP_PRACTICING;
};

/**
 * Calculate XP reward for flashcard practice
 * @param {boolean} isCorrect - Whether the answer was correct
 * @returns {number} XP reward amount
 */
export const calculateFlashcardXP = (isCorrect) => {
  return isCorrect ? 10 : 2;
};