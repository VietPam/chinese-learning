import { Container, Box, Button, Typography, useTheme } from '@mui/material';

export const QuizStartScreen = ({ onStartQuiz }) => {
  const theme = useTheme();

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Audio Recognition Quiz
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
          Listen to the Chinese pronunciation and select the correct character. You will be asked 10 questions.
        </Typography>

        <Box sx={{ backgroundColor: theme.palette.background.paper, p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            How it works:
          </Typography>
          <Box component="ul" sx={{ textAlign: 'left', color: theme.palette.text.secondary }}>
            <li>Click "Listen" to hear the Chinese pronunciation</li>
            <li>Select the correct character from the options</li>
            <li>Click "Submit" to confirm your answer</li>
            <li>Earn XP for each correct answer</li>
          </Box>
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={onStartQuiz}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            px: 4,
            py: 1.5,
            fontSize: 16,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Start Quiz
        </Button>
      </Box>
    </Container>
  );
};