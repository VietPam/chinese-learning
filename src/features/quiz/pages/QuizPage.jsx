import { Container, Typography, Box, useTheme } from '@mui/material';

export const QuizPage = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="sm">
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Quiz Mode
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          Quiz feature coming soon... 🚀
        </Typography>
      </Container>
    </Box>
  );
};
