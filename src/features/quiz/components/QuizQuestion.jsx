import {
  Box,
  Typography,
  Card,
  CardActionArea,
  Grid,
  IconButton,
  useTheme,
  Button,
  CircularProgress,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAudio } from '../../chineseDigits/hooks/useAudio';
import { useState } from 'react';

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
    <Box sx={{ width: '100%' }}>
      {/* Question Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
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
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {question.options.map((option, index) => {
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

          return (
            <Grid item xs={6} key={index}>
              <Card
                sx={{
                  border: `2px solid ${borderColor}`,
                  backgroundColor,
                  cursor: !showCorrectness ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  '&:hover': {
                    borderColor: !showCorrectness ? theme.palette.primary.main : borderColor,
                    boxShadow: !showCorrectness ? 2 : 1,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleSelectOption(option)}
                  sx={{ p: 2, textAlign: 'center', minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: 48,
                      fontWeight: 'bold',
                      color: textColor,
                      mb: 1,
                    }}
                  >
                    {option.chineseChar}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {option.pinyin}
                  </Typography>

                  {/* Result Icon */}
                  {showCorrectness && isCorrect && (
                    <CheckCircleIcon
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: theme.palette.success.main,
                        fontSize: 32,
                      }}
                    />
                  )}
                  {showCorrectness && isSelected && !isCorrect && (
                    <CancelIcon
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: theme.palette.error.main,
                        fontSize: 32,
                      }}
                    />
                  )}
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
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
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
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