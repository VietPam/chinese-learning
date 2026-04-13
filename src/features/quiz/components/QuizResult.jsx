import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  useTheme,
  Grid,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { calculatePerformance } from '../utils/quizGenerator';

export const QuizResult = ({ sessionStats, onRetry, onHome }) => {
  const theme = useTheme();
  const performance = calculatePerformance(
    sessionStats.correctAnswers,
    sessionStats.totalQuestions
  );

  const duration = sessionStats.endTime
    ? Math.round((sessionStats.endTime - sessionStats.startTime) / 1000)
    : 0;

  const avgTimePerQuestion = duration / sessionStats.totalQuestions;

  const getEmojiForRating = (rating) => {
    switch (rating) {
      case 'Perfect!':
        return '🏆';
      case 'Excellent':
        return '⭐';
      case 'Very Good':
        return '👍';
      case 'Good':
        return '😊';
      case 'Fair':
        return '💪';
      default:
        return '📚';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <EmojiEventsIcon
          sx={{
            fontSize: 64,
            color: theme.palette.warning.main,
            mb: 2,
          }}
        />
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Quiz Complete!
        </Typography>
      </Box>

      {/* Main Result Card */}
      <Card
        sx={{
          backgroundColor: theme.palette.background.paper,
          border: `2px solid ${theme.palette.primary.main}`,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Rating */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h2" sx={{ fontSize: 64, mb: 1 }}>
              {getEmojiForRating(performance.rating)}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
              {performance.rating}
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              {performance.correctCount} out of {performance.totalQuestions} correct
            </Typography>
          </Box>

          {/* Score Percentage */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Score</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {performance.percentage.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={performance.percentage}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: theme.palette.grey[300],
                '& .MuiLinearProgress-bar': {
                  borderRadius: 6,
                  backgroundColor:
                    performance.percentage === 100
                      ? theme.palette.success.main
                      : performance.percentage >= 80
                        ? theme.palette.warning.main
                        : performance.percentage >= 60
                          ? theme.palette.info.main
                          : theme.palette.error.main,
                },
              }}
            />
          </Box>

          {/* XP Reward */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Chip
              icon={<FavoriteBorderIcon />}
              label={`+${performance.xpReward} XP`}
              color="primary"
              variant="outlined"
              sx={{ fontSize: 16, padding: 2 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
              {sessionStats.correctAnswers}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Correct
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
              {sessionStats.incorrectAnswers}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Incorrect
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>
              {Math.floor(duration / 60)}:
              {String(duration % 60).padStart(2, '0')}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Total Time
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
              {avgTimePerQuestion.toFixed(1)}s
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Avg/Question
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{
        display: 'flex',
        gap: 2,
        justifyContent: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        width: '100%',
        maxWidth: 400,
        mx: 'auto'
      }}>
        <Button
          variant="contained"
          size="large"
          onClick={onRetry}
          fullWidth
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: 3,
            boxShadow: 2,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              boxShadow: 4,
            },
            '&:active': {
              boxShadow: 1,
            },
          }}
        >
          Try Again
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={onHome}
          fullWidth
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: 3,
            borderWidth: 2,
            '&:hover': {
              borderColor: theme.palette.primary.dark,
              borderWidth: 2,
              backgroundColor: theme.palette.primary.light + '10',
            },
            '&:active': {
              borderWidth: 2,
            },
          }}
        >
          Back to Home
        </Button>
      </Box>

      {/* Encouragement Message */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
          {performance.percentage === 100
            ? '🎉 Perfect score! You\'re a master!'
            : performance.percentage >= 80
              ? '🌟 Excellent work! Keep practicing!'
              : performance.percentage >= 60
                ? '💪 Good job! Practice more to improve!'
                : '📚 Keep learning! Every practice helps!'}
        </Typography>
      </Box>
    </Container>
  );
};