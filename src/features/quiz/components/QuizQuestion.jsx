import {
  Box,
  Typography,
  Grid,
  IconButton,
  useTheme,
  Button,
  CircularProgress,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useAudio } from '../../chineseDigits/hooks/useAudio';
import { useState } from 'react';
import { QuizOption } from './QuizOption';

export const QuizQuestion = ({
  question,
  selectedAnswer,
  showResult,
  onSelectAnswer,
  onSubmitAnswer,
}) => {
  const theme = useTheme();
  const { play, isPlaying } = useAudio();
  const [hasAnswered, setHasAnswered] = useState(false);

  const handlePlayAudio = () => {
    play(question.correctCharacter, 'zh-CN');
  };

  const handleSelectOption = (option) => {
    if (!hasAnswered && !showResult) {
      onSelectAnswer(option);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      const isCorrect = selectedAnswer.digit === question.correctDigit;
      onSubmitAnswer({ isCorrect, selectedAnswer });
      setHasAnswered(true);
    }
  };

  const isCorrectAnswer = selectedAnswer?.digit === question.correctDigit;

  return (
    <Box sx={{ width: '100%', px: { xs: 1, sm: 0 } }}>
      {/* Question Header */}
      <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
        <Typography variant="h5" sx={{ mb: 2, color: theme.palette.text.primary }}>
          {question.questionText}
        </Typography>

        {/* Audio Playback Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<VolumeUpIcon />}
            onClick={handlePlayAudio}
            disabled={isPlaying}
            sx={{
              minWidth: 160,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              '&:disabled': {
                backgroundColor: theme.palette.primary.light,
              },
            }}
          >
            {isPlaying ? 'Playing...' : 'Listen'}
          </Button>

          {isPlaying && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={40} sx={{ color: theme.palette.primary.main }} />
            </Box>
          )}
        </Box>
      </Box>

      {/* Answer Options */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
        {question.options.map((option, index) => (
          <QuizOption
            key={index}
            option={option}
            selectedAnswer={selectedAnswer}
            question={question}
            showResult={showResult}
            hasAnswered={hasAnswered}
            onSelect={handleSelectOption}
            disabled={showResult || hasAnswered}
          />
        ))}
      </Grid>

      {/* Feedback Message */}
      {showResult && (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          {isCorrectAnswer ? (
            <Typography variant="body1" sx={{ color: theme.palette.success.main, fontWeight: 600 }}>
              ✓ Correct! {selectedAnswer.vietnamese} = {selectedAnswer.chineseChar}
            </Typography>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ color: theme.palette.error.main, fontWeight: 600, mb: 1 }}>
                ✗ Incorrect. The correct answer is:
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {question.correctCharacter} ({question.correctPinyin}) - {question.correctVietnamese}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Submit Button */}
      {!showResult && !hasAnswered && selectedAnswer && (
        <Box sx={{ textAlign: 'center', mt: 3, mb: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            fullWidth
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 3,
              boxShadow: 2,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: 4,
              },
              '&:active': {
                boxShadow: 1,
              },
            }}
          >
            Submit Answer
          </Button>
        </Box>
      )}
    </Box>
  );
};