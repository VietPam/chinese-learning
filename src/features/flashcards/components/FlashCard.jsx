import { Card, CardContent, Typography, Box, IconButton, useTheme } from '@mui/material';
import { useState } from 'react';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export const FlashCard = ({
  frontContent,
  backContent,
  onCorrect,
  onIncorrect,
  onNext,
  showControls = true
}) => {
  const theme = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setIsFlipped(true);
  };

  const handleCorrect = () => {
    onCorrect?.();
    resetCard();
    onNext?.();
  };

  const handleIncorrect = () => {
    onIncorrect?.();
    resetCard();
    onNext?.();
  };

  const resetCard = () => {
    setIsFlipped(false);
    setShowAnswer(false);
  };

  return (
    <Box sx={{ perspective: '1000px', width: '100%', maxWidth: 400, mx: 'auto' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 240, sm: 300 },
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <Card
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.background.paper,
            border: `2px solid ${theme.palette.primary.main}`,
            '&:hover': {
              boxShadow: theme.shadows[8],
            },
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
            <Typography variant="h3" sx={{ mb: 2, color: theme.palette.text.primary, fontSize: { xs: '2.5rem', sm: '3rem' } }}>
              {frontContent}
            </Typography>
            {!showAnswer && (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Click to reveal
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Back of card */}
        <Card
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.paper,
            border: `2px solid ${theme.palette.success.main}`,
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 }, flex: 1 }}>
            <Typography variant="h4" sx={{ mb: 1, color: theme.palette.text.primary, fontSize: { xs: '1.8rem', sm: '2.125rem' } }}>
              {backContent.chinese || backContent}
            </Typography>
            {backContent.pinyin && (
              <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1, fontSize: { xs: '0.875rem', sm: '1.25rem' } }}>
                {backContent.pinyin}
              </Typography>
            )}
            {backContent.vietnamese && (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic', fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                {backContent.vietnamese}
              </Typography>
            )}
          </CardContent>

          {showControls && (
            <Box sx={{ display: 'flex', justifyContent: 'space-around', p: { xs: 1, sm: 2 }, borderTop: `1px solid ${theme.palette.divider}` }}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleIncorrect();
                }}
                size="small"
                sx={{
                  color: theme.palette.error.main,
                  '&:hover': { backgroundColor: theme.palette.error.light + '20' }
                }}
              >
                <CancelIcon sx={{ fontSize: { xs: 24, sm: 32 } }} />
              </IconButton>

              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleCorrect();
                }}
                size="small"
                sx={{
                  color: theme.palette.success.main,
                  '&:hover': { backgroundColor: theme.palette.success.light + '20' }
                }}
              >
                <CheckCircleIcon sx={{ fontSize: { xs: 24, sm: 32 } }} />
              </IconButton>
            </Box>
          )}
        </Card>
      </Box>

      {/* Show answer button (when not flipped) */}
      {!isFlipped && !showAnswer && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <IconButton
            onClick={handleShowAnswer}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            <ReplayIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};