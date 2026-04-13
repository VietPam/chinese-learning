import { Container, Box, Button, Typography, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { QuizQuestion } from '../components/QuizQuestion';
import { QuizResult } from '../components/QuizResult';
import { QuizStartScreen } from '../components/QuizStartScreen';
import { QuizProgress } from '../components/QuizProgress';
import { useQuizXP } from '../hooks/useQuizXP';
import {
  startQuiz,
  selectAnswer,
  submitAnswer,
  nextQuestion,
  resetQuiz,
} from '../store/quizSlice';

export const QuizPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { awardQuizXP } = useQuizXP();
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

  const handleFinishQuiz = () => {
    // Award XP for completing quiz
    const { correctAnswers, totalQuestions } = sessionStats;
    awardQuizXP(correctAnswers, totalQuestions);
  };

  const handleRetryQuiz = () => {
    dispatch(resetQuiz());
    setQuizStarted(false);
    handleStartQuiz();
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
    return <QuizStartScreen onStartQuiz={handleStartQuiz} />;
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

    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <QuizProgress
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          sessionStats={sessionStats}
        />

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
