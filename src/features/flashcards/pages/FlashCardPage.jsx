import { Container, Typography, Box, Button, LinearProgress, Chip, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RefreshIcon from '@mui/icons-material/Refresh';
import { FlashCard } from '../components/FlashCard';
import {
  nextCard,
  previousCard,
  markCorrect,
  markIncorrect,
  startSession,
  endSession,
  shuffleCards,
  resetProgress,
} from '../store/flashcardsSlice';
import { addXP, incrementActivity } from '../../../store/progressSlice';

export const FlashCardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  const {
    cards,
    currentIndex,
    sessionStats,
    isSessionActive,
    showMode,
  } = useSelector((state) => state.flashcards);

  const [autoAdvance, setAutoAdvance] = useState(false);

  useEffect(() => {
    if (!isSessionActive) {
      dispatch(startSession());
    }

    return () => {
      if (isSessionActive) {
        dispatch(endSession());
      }
    };
  }, [dispatch, isSessionActive]);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleCorrect = () => {
    dispatch(markCorrect());
    dispatch(addXP(10)); // Award 10 XP for correct answer
    dispatch(incrementActivity('flashcardsReviewed'));
    if (autoAdvance) {
      setTimeout(() => dispatch(nextCard()), 500);
    }
  };

  const handleIncorrect = () => {
    dispatch(markIncorrect());
    dispatch(addXP(2)); // Award 2 XP for incorrect answer (still learning)
    dispatch(incrementActivity('flashcardsReviewed'));
    if (autoAdvance) {
      setTimeout(() => dispatch(nextCard()), 500);
    }
  };

  const handleNext = () => {
    dispatch(nextCard());
  };

  const handlePrevious = () => {
    dispatch(previousCard());
  };

  const handleShuffle = () => {
    dispatch(shuffleCards());
  };

  const handleReset = () => {
    dispatch(resetProgress());
    dispatch(startSession());
  };

  const getFrontContent = () => {
    switch (showMode) {
      case 'chinese-to-vietnamese':
        return currentCard.chineseChar;
      case 'vietnamese-to-chinese':
        return currentCard.vietnamese;
      case 'pinyin-to-chinese':
        return currentCard.pinyin;
      default:
        return currentCard.chineseChar;
    }
  };

  const getBackContent = () => {
    return {
      chinese: currentCard.chineseChar,
      pinyin: currentCard.pinyin,
      vietnamese: currentCard.vietnamese,
    };
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Flash Cards
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
          Practice Chinese numbers with spaced repetition
        </Typography>

        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: theme.palette.grey[300],
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: theme.palette.primary.main,
              },
            }}
          />
          <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
            Card {currentIndex + 1} of {cards.length}
          </Typography>
        </Box>

        {/* Session Stats */}
        {isSessionActive && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Chip
              label={`Correct: ${sessionStats.correctAnswers}`}
              color="success"
              variant="outlined"
            />
            <Chip
              label={`Incorrect: ${sessionStats.incorrectAnswers}`}
              color="error"
              variant="outlined"
            />
            <Chip
              label={`Total: ${sessionStats.totalReviewed}`}
              color="primary"
              variant="outlined"
            />
          </Box>
        )}
      </Box>

      {/* Flash Card */}
      <Box sx={{ mb: 4 }}>
        <FlashCard
          frontContent={getFrontContent()}
          backContent={getBackContent()}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
          onNext={handleNext}
        />
      </Box>

      {/* Navigation Controls */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
        mb: 3
      }}>
        <IconButton
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <NavigateBeforeIcon />
        </IconButton>

        <Button
          variant="outlined"
          startIcon={<ShuffleIcon />}
          onClick={handleShuffle}
          sx={{ minWidth: 120 }}
        >
          Shuffle
        </Button>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleReset}
          sx={{ minWidth: 120 }}
        >
          Reset
        </Button>

        <IconButton
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <NavigateNextIcon />
        </IconButton>
      </Box>

      {/* Card Info */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          Difficulty: <Chip
            label={currentCard.difficulty}
            size="small"
            color={
              currentCard.difficulty === 'easy' ? 'success' :
              currentCard.difficulty === 'medium' ? 'warning' : 'error'
            }
            variant="outlined"
          />
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
          Reviewed {currentCard.timesReviewed} times •
          Correct: {currentCard.correctCount} •
          Incorrect: {currentCard.incorrectCount}
        </Typography>
      </Box>
    </Container>
  );
};