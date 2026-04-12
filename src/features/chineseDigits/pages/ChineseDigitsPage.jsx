import { Box } from '@mui/material';
import { DigitsList } from '../components/DigitsList';
import { useLocalStorageFavorites } from '../hooks/useLocalStorageFavorites';

export const ChineseDigitsPage = () => {
  // Initialize localStorage sync for favorites
  useLocalStorageFavorites();

  return (
    <Box>
      <DigitsList />
    </Box>
  );
};
