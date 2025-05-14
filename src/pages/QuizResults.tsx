import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/quizContext';
import { Container, Typography, Button, Box, Paper } from '@mui/material';

export const QuizResults: React.FC = () => {
  const navigate = useNavigate();
  const { score, quizzesTaken, previousPath, maxQuizzes, resetQuiz } = useQuiz();

  const handleGoBack = () => {
    if (previousPath) {
      navigate(previousPath);
    }
    resetQuiz(); // Reset quiz state when going back
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(45, 45, 45, 0.8)', borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary.main">
          Quiz Results
        </Typography>
        <Box sx={{ my: 3 }}>
          <Typography variant="h6" color="text.secondary">
            You answered {quizzesTaken} questions.
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, color: score >= (maxQuizzes/2) ? 'success.main' : 'error.main' }}>
            Your final score is: {score} correct answers
          </Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={handleGoBack} sx={{ mt: 2 }}>
          Go Back To Skill
        </Button>
      </Paper>
    </Container>
  );
};
