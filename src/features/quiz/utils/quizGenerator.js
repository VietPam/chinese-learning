import { digitsData } from '../../chineseDigits/data/digitsData';
import { shuffleArray } from '../../../utils/arrayUtils';

/**
 * Generate a quiz question: listen to Chinese pronunciation, select correct character
 * @param {number} currentQuestionIndex - Index of the current question
 * @returns {Object} Question object with correct answer and options
 */
export const generateQuizQuestion = (currentQuestionIndex) => {
  // Get the correct answer from digitsData
  const correctAnswer = digitsData[currentQuestionIndex % digitsData.length];

  // Get 3 random incorrect options
  let options = [correctAnswer];
  const availableDigits = digitsData.filter(d => d.digit !== correctAnswer.digit);

  while (options.length < 4 && availableDigits.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableDigits.length);
    options.push(availableDigits[randomIndex]);
    availableDigits.splice(randomIndex, 1);
  }

  // Shuffle options
  options = shuffleArray(options);

  return {
    questionId: currentQuestionIndex,
    questionText: `Listen to the pronunciation and select the correct Chinese character`,
    correctAnswer,
    options,
    correctDigit: correctAnswer.digit,
    correctCharacter: correctAnswer.chineseChar,
    correctPinyin: correctAnswer.pinyin,
    correctVietnamese: correctAnswer.vietnamese,
  };
};

/**
 * Calculate score and performance metrics
 * @param {number} correctCount - Number of correct answers
 * @param {number} totalQuestions - Total questions in the quiz
 * @returns {Object} Performance metrics
 */
export const calculatePerformance = (correctCount, totalQuestions) => {
  const percentage = (correctCount / totalQuestions) * 100;
  let rating = 'Poor';
  let xpReward = 0;

  if (percentage === 100) {
    rating = 'Perfect!';
    xpReward = 100;
  } else if (percentage >= 90) {
    rating = 'Excellent';
    xpReward = 80;
  } else if (percentage >= 80) {
    rating = 'Very Good';
    xpReward = 60;
  } else if (percentage >= 70) {
    rating = 'Good';
    xpReward = 40;
  } else if (percentage >= 60) {
    rating = 'Fair';
    xpReward = 20;
  } else {
    rating = 'Keep Practicing';
    xpReward = 5;
  }

  return {
    correctCount,
    totalQuestions,
    percentage,
    rating,
    xpReward,
  };
};

/**
 * Get all available quiz questions (randomly ordered)
 * @returns {Array} Array of quiz questions
 */
export const getAllQuizQuestions = () => {
  return digitsData.map((digit, index) => generateQuizQuestion(index));
};

/**
 * Generate a randomized quiz session of N questions
 * @param {number} count - Number of questions (default 10)
 * @returns {Array} Randomized quiz questions
 */
export const generateRandomQuiz = (count = 10) => {
  const questions = [];
  const questionCount = Math.min(count, digitsData.length);

  for (let i = 0; i < questionCount; i++) {
    questions.push(generateQuizQuestion(i));
  }

  // Shuffle the questions
  return shuffleArray(questions);
};