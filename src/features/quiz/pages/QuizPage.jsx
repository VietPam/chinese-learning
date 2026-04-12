import { Container, Typography, Box } from '@mui/material';

export const QuizPage = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="sm">
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Quiz Mode
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Quiz feature coming soon... 🚀
        </Typography>
      </Container>
    </Box>
  );
};
