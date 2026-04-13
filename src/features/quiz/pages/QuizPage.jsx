import { Container, Box, Button, Typography, useTheme, Chip, LinearProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { QuizQuestion } from '../components/QuizQuestion';
import { QuizResult } from '../components/QuizResult';
import {
  startQuiz,
  selectAnswer,
  submitAnswer,
  nextQuestion,
  resetQuiz,
} from '../store/quizSlice';
import { addXP, incrementActivity } from '../../../store/progressSlice';

export const QuizPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quizStarted, setQuizStarted] = useState(false);

  const {
    questions,
    currentQuestionIndex,
    isSessionActive,
    isSessionComplete,
    sessionStats,
    selectedAnswer,
    showResult,
  } = useSelector((state) => state.quiz);

  const handleStartQuiz = () => {
    dispatch(startQuiz({ questionCount: 10 }));
    setQuizStarted(true);
  };

  const handleSelectAnswer = (option) => {
    dispatch(selectAnswer(option));
  };

  const handleSubmitAnswer = ({ isCorrect }) => {
    dispatch(submitAnswer({ isCorrect }));
  };

  const handleNextQuestion = () => {
    dispatch(nextQuestion());
  };

  const handleRetryQuiz = () => {
    dispatch(resetQuiz());
    setQuizStarted(false);
    handleStartQuiz();
  };

  const handleFinishQuiz = () => {
    // Award XP for completing quiz
    const { correctAnswers, totalQuestions } = sessionStats;
    const percentage = (correctAnswers / totalQuestions) * 100;
    let xpReward = 0;

    if (percentage === 100) xpReward = 100;
    else if (percentage >= 90) xpReward = 80;
    else if (percentage >= 80) xpReward = 60;
    else if (percentage >= 70) xpReward = 40;
    else if (percentage >= 60) xpReward = 20;
    else xpReward = 5;

    dispatch(addXP(xpReward));
    dispatch(incrementActivity('quizzesCompleted'));
  };

  const handleBackHome = () => {
    dispatch(resetQuiz());
    setQuizStarted(false);
    navigate('/');
  };

  // Auto finalize quiz when complete
  useEffect(() => {
    if (isSessionComplete && quizStarted) {
      handleFinishQuiz();
    }
  }, [isSessionComplete, quizStarted]);

  // Show start screen
  if (!quizStarted) {
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
            onClick={handleStartQuiz}
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
  }

  // Show quiz result screen
  if (isSessionComplete) {
    return (
      <QuizResult
        sessionStats={sessionStats}
        onRetry={handleRetryQuiz}
        onHome={handleBackHome}
      />
    );
  }

  // Show quiz question
  if (isSessionActive && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header with Progress */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={`✓ ${sessionStats.correctAnswers}`}
                color="success"
                variant="outlined"
                size="small"
              />
              <Chip
                label={`✗ ${sessionStats.incorrectAnswers}`}
                color="error"
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: theme.palette.grey[300],
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: theme.palette.primary.main,
              },
            }}
          />
        </Box>

        {/* Question Component */}
        <Box sx={{ mb: 4 }}>
          <QuizQuestion
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
            onSelectAnswer={handleSelectAnswer}
            onSubmitAnswer={handleSubmitAnswer}
          />
        </Box>

        {/* Next Button */}
        {showResult && (
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleNextQuestion}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
                minWidth: 200,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </Box>
        )}
      </Container>
    );
  }

  return null;
};
