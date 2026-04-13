import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';

export const useQuizQuestionStyling = (option, selectedAnswer, question, showResult, hasAnswered) => {
  const theme = useTheme();

  return useMemo(() => {
    const isSelected = selectedAnswer?.digit === option.digit;
    const isCorrect = option.digit === question.correctDigit;
    const showCorrectness = showResult || hasAnswered;

    let backgroundColor = theme.palette.background.paper;
    let borderColor = theme.palette.divider;
    let textColor = theme.palette.text.primary;

    if (showCorrectness) {
      if (isCorrect) {
        backgroundColor = theme.palette.success.light + '20';
        borderColor = theme.palette.success.main;
      } else if (isSelected && !isCorrect) {
        backgroundColor = theme.palette.error.light + '20';
        borderColor = theme.palette.error.main;
      }
    } else if (isSelected && !showCorrectness) {
      backgroundColor = theme.palette.primary.light + '20';
      borderColor = theme.palette.primary.main;
    }

    return {
      backgroundColor,
      borderColor,
      textColor,
      isSelected,
      isCorrect,
      showCorrectness,
    };
  }, [option, selectedAnswer, question, showResult, hasAnswered, theme]);
};