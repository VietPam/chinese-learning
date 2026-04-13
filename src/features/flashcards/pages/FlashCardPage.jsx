import { Container, Typography, Box, Button, useTheme, useMediaQuery, Chip, IconButton } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RefreshIcon from '@mui/icons-material/Refresh';
import { FlashCard } from '../components/FlashCard';
import { FlashCardProgress } from '../components/FlashCardProgress';
import { useFlashcardXP } from '../hooks/useFlashcardXP';
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

export const FlashCardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { awardFlashcardXP } = useFlashcardXP();

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
    awardFlashcardXP(true);
    if (autoAdvance) {
      setTimeout(() => dispatch(nextCard()), 500);
    }
  };

  const handleIncorrect = () => {
    dispatch(markIncorrect());
    awardFlashcardXP(false);
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
    <Container maxWidth="sm" sx={{ py: { xs: 2, sm: 4 } }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 4 } }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Flash Cards
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Practice with spaced repetition
        </Typography>

        {/* Progress Component */}
        <FlashCardProgress
          currentIndex={currentIndex}
          totalCards={cards.length}
          sessionStats={sessionStats}
        />

        {/* Session Stats - Only show on active session */}
        {isSessionActive && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            <Chip
              label={`✓ ${sessionStats.correctAnswers}`}
              color="success"
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
            />
            <Chip
              label={`✗ ${sessionStats.incorrectAnswers}`}
              color="error"
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
            />
            <Chip
              label={`Total: ${sessionStats.totalReviewed}`}
              color="primary"
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
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

      {/* Navigation Controls - Mobile optimized */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: { xs: 1, sm: 2 },
        flexWrap: 'wrap',
        mb: 3
      }}>
        <IconButton
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          size={isMobile ? 'small' : 'medium'}
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            '&:hover': { backgroundColor: theme.palette.action.hover }
          }}
        >
          <NavigateBeforeIcon />
        </IconButton>

        <Button
          variant="outlined"
          startIcon={<ShuffleIcon />}
          onClick={handleShuffle}
          size={isMobile ? 'small' : 'medium'}
          sx={{ minWidth: { xs: 80, sm: 120 }, fontSize: { xs: '0.75rem', sm: '1rem' } }}
        >
          {isMobile ? 'Shuffle' : 'Shuffle'}
        </Button>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleReset}
          size={isMobile ? 'small' : 'medium'}
          sx={{ minWidth: { xs: 80, sm: 120 }, fontSize: { xs: '0.75rem', sm: '1rem' } }}
        >
          {isMobile ? 'Reset' : 'Reset'}
        </Button>

        <IconButton
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          size={isMobile ? 'small' : 'medium'}
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            '&:hover': { backgroundColor: theme.palette.action.hover }
          }}
        >
          <NavigateNextIcon />
        </IconButton>
      </Box>

      {/* Card Info */}
      <Box sx={{ textAlign: 'center', fontSize: { xs: '0.75rem', sm: '1rem' } }}>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
          Difficulty:
          {' '}
          <Chip
            label={currentCard.difficulty}
            size="small"
            color={currentCard.difficulty === 'easy' ? 'success' : currentCard.difficulty === 'medium' ? 'warning' : 'error'}
            variant="outlined"
            sx={{ ml: 1 }}
          />
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
          Reviewed {currentCard.timesReviewed} • ✓ {currentCard.correctCount} • ✗ {currentCard.incorrectCount}
        </Typography>
      </Box>
    </Container>
  );
};