import { Box, Typography, Chip, useTheme } from '@mui/material';
import { ProgressBar } from '../../../components/common/ProgressBar';
import { StatsChips } from '../../../components/common/StatsChips';

export const FlashCardProgress = ({ currentIndex, totalCards, sessionStats }) => {
  const theme = useTheme();
  const progress = ((currentIndex + 1) / totalCards) * 100;

  const stats = [
    { icon: '✓', value: sessionStats.correctAnswers, color: 'success' },
    { icon: '✗', value: sessionStats.incorrectAnswers, color: 'error' },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header with Progress */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Card {currentIndex + 1} of {totalCards}
        </Typography>
        <StatsChips stats={stats} />
      </Box>

      <ProgressBar value={progress} />
    </Box>
  );
};