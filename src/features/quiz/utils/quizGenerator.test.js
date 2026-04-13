import { describe, it, expect, vi } from 'vitest';
import { generateQuizQuestion, calculatePerformance, getAllQuizQuestions, generateRandomQuiz } from './quizGenerator';
import { digitsData } from '../../chineseDigits/data/digitsData';

describe('quizGenerator utilities', () => {
  it('should generate a quiz question with correct structure', () => {
    const question = generateQuizQuestion(0);

    expect(question).toHaveProperty('questionId');
    expect(question).toHaveProperty('questionText');
    expect(question).toHaveProperty('correctAnswer');
    expect(question).toHaveProperty('options');
    expect(question).toHaveProperty('correctDigit');
    expect(question).toHaveProperty('correctCharacter');

    expect(question.options.length).toBe(4);
    expect(question.correctDigit).toBe(0);
  });

  it('should include the correct answer in options', () => {
    const question = generateQuizQuestion(0);
    const correctDigitInOptions = question.options.some(
      opt => opt.digit === question.correctDigit
    );

    expect(correctDigitInOptions).toBe(true);
  });

  it('should calculate perfect score performance', () => {
    const performance = calculatePerformance(10, 10);

    expect(performance.correctCount).toBe(10);
    expect(performance.totalQuestions).toBe(10);
    expect(performance.percentage).toBe(100);
    expect(performance.rating).toBe('Perfect!');
    expect(performance.xpReward).toBe(100);
  });

  it('should calculate excellent score performance', () => {
    const performance = calculatePerformance(9, 10);

    expect(performance.percentage).toBe(90);
    expect(performance.rating).toBe('Excellent');
    expect(performance.xpReward).toBe(80);
  });

  it('should calculate fair score performance', () => {
    const performance = calculatePerformance(6, 10);

    expect(performance.percentage).toBe(60);
    expect(performance.rating).toBe('Fair');
    expect(performance.xpReward).toBe(20);
  });

  it('should calculate poor performance', () => {
    const performance = calculatePerformance(3, 10);

    expect(performance.percentage).toBe(30);
    expect(performance.rating).toBe('Keep Practicing');
    expect(performance.xpReward).toBe(5);
  });

  it('should generate all quiz questions', () => {
    const questions = getAllQuizQuestions();

    expect(questions.length).toBe(digitsData.length);
    questions.forEach((question, index) => {
      expect(question.correctDigit).toBe(index);
    });
  });

  it('should generate random quiz with specified count', () => {
    const quiz = generateRandomQuiz(5);

    expect(quiz.length).toBe(5);
    quiz.forEach(question => {
      expect(question).toHaveProperty('options');
      expect(question.options.length).toBe(4);
    });
  });

  it('should not exceed available digits in random quiz', () => {
    const quiz = generateRandomQuiz(100);

    expect(quiz.length).toBeLessThanOrEqual(digitsData.length);
  });
});