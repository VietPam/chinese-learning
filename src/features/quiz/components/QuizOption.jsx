import { Grid, Card, CardActionArea, Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useQuizQuestionStyling } from '../hooks/useQuizQuestionStyling';

export const QuizOption = ({
  option,
  selectedAnswer,
  question,
  showResult,
  hasAnswered,
  onSelect,
  disabled
}) => {
  const styling = useQuizQuestionStyling(option, selectedAnswer, question, showResult, hasAnswered);

  return (
    <Grid item xs={6} key={option.digit}>
      <Card
        sx={{
          border: `2px solid ${styling.borderColor}`,
          backgroundColor: styling.backgroundColor,
          cursor: !styling.showCorrectness ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: !styling.showCorrectness ? 'primary.main' : styling.borderColor,
            boxShadow: !styling.showCorrectness ? 2 : 1,
          },
        }}
      >
        <CardActionArea
          onClick={() => !disabled && onSelect(option)}
          sx={{
            p: { xs: 1.5, sm: 2 },
            textAlign: 'center',
            aspectRatio: '1 / 1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: 34, sm: 42 },
              fontWeight: 'bold',
              color: styling.textColor,
              mb: 1,
            }}
          >
            {option.chineseChar}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            {option.pinyin}
          </Typography>

          {styling.showCorrectness && (
            <Box sx={{
              mt: 1,
              py: 0.5,
              px: 1.5,
              borderRadius: 2,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: styling.isCorrect ? 'rgba(76, 175, 80, 0.12)' : 'rgba(244, 67, 54, 0.12)',
              color: styling.isCorrect ? 'success.main' : 'error.main',
            }}>
              {styling.isCorrect ? (
                <CheckCircleIcon sx={{ fontSize: 18 }} />
              ) : styling.isSelected ? (
                <CancelIcon sx={{ fontSize: 18 }} />
              ) : null}
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {styling.isCorrect ? 'Correct' : styling.isSelected ? 'Wrong' : ''}
              </Typography>
            </Box>
          )}
        </CardActionArea>
      </Card>
    </Grid>
  );
};