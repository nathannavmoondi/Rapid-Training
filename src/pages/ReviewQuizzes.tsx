import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button
} from '@mui/material';
import { useQuiz } from '../contexts/quizContext';

const ReviewQuizzes: React.FC = () => {
  const { userFailedQuizzes } = useQuiz();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ color: 'white' }}>
          Failed Quizzes
        </Typography>
      </Box>

      <Box>
        <TableContainer component={Paper} sx={{ backgroundColor: '#121212' }}>
          <Table aria-label="failed quizzes table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Topic</TableCell>
                <TableCell sx={{ color: 'white' }}>Skill Level</TableCell>
                <TableCell sx={{ color: 'white' }}>Preview</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userFailedQuizzes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: 'center', color: 'gray' }}>
                    {/* Empty row for no data */}
                  </TableCell>
                </TableRow>
              ) : (
                userFailedQuizzes.map((quiz, index) => {
                  const plainText = quiz.html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                  const preview = plainText.slice(0, 30) + (plainText.length > 30 ? '...' : '');
                  return (
                    <TableRow key={index}>
                      <TableCell sx={{ fontWeight: 'medium', color: 'white' }}>{quiz.topic}</TableCell>
                      <TableCell>
                        <Chip label={quiz.skillLevel} size="small" sx={{ color: 'white', fontWeight: 'bold' }} />
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>{preview}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {userFailedQuizzes.length === 0
              ? '0 failed quizzes found.'
              : `Total Failed Quizzes: ${userFailedQuizzes.length}`}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ReviewQuizzes;
