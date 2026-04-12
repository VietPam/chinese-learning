import { Stack, Container } from '@mui/material';
import { useChineseDigits } from '../hooks/useChineseDigits';
import { DigitCard } from './DigitCard';

export const DigitsList = () => {
  const digits = useChineseDigits();

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={1}>
        {digits.map((item) => (
          <DigitCard
            key={item.digit}
            digit={item.digit}
            chineseChar={item.chineseChar}
            pinyin={item.pinyin}
          />
        ))}
      </Stack>
    </Container>
  );
};
