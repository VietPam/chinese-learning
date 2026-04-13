import { Grid, Card, CardActionArea, Typography } from '@mui/material';
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
          position: 'relative',
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
            minHeight: { xs: 100, sm: 120 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: 36, sm: 48 },
              fontWeight: 'bold',
              color: styling.textColor,
              mb: 1,
            }}
          >
            {option.chineseChar}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {option.pinyin}
          </Typography>

          {/* Result Icon */}
          {styling.showCorrectness && styling.isCorrect && (
            <CheckCircleIcon
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'success.main',
                fontSize: 32,
              }}
            />
          )}
          {styling.showCorrectness && styling.isSelected && !styling.isCorrect && (
            <CancelIcon
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'error.main',
                fontSize: 32,
              }}
            />
          )}
        </CardActionArea>
      </Card>
    </Grid>
  );
};