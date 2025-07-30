import React, { useState } from 'react';
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
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import {
  Delete as DeleteIcon,
  QuizOutlined as QuizIcon
} from '@mui/icons-material';
import { useQuiz } from '../contexts/quizContext';
import { useChat } from '../contexts/chatContext';

const ReviewQuizzes: React.FC = () => {
  const { userFailedQuizzes, setUserFailedQuizzes, clearFailedQuizzes } = useQuiz();
  const { addExternalMessage } = useChat();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<number | null>(null);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);

  const handleDeleteClick = (index: number) => {
    setQuizToDelete(index);
    setDeleteDialogOpen(true);
  };

  const handleClearAllClick = () => {
    setClearAllDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (quizToDelete !== null) {
      const updatedQuizzes = userFailedQuizzes.filter((_, i) => i !== quizToDelete);
      setUserFailedQuizzes(updatedQuizzes);
      console.log('Deleted failed quiz at index:', quizToDelete);
    }
    setDeleteDialogOpen(false);
    setQuizToDelete(null);
  };

  const handleConfirmClearAll = () => {
    clearFailedQuizzes();
    console.log('Cleared all failed quizzes');
    setClearAllDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setQuizToDelete(null);
  };

  const handleCancelClearAll = () => {
    setClearAllDialogOpen(false);
  };

  const handleViewFailedQuiz = (quiz: any) => {
    try {
      // Ensure explanation divs have white text color
      let processedHtml = quiz.html;
      
      // Add inline styles to explanation divs to ensure white text
      processedHtml = processedHtml.replace(
        /<div([^>]*class="[^"]*explanation[^"]*"[^>]*)>/gi,
        '<div$1 style="color: white !important;">'
      );
      
      // Also handle explanation paragraphs
      processedHtml = processedHtml.replace(
        /<p([^>]*class="[^"]*explanation[^"]*"[^>]*)>/gi,
        '<p$1 style="color: white !important;">'
      );
      
      // Handle any explanation content that might not have proper styling
      processedHtml = processedHtml.replace(
        /(<div[^>]*class="[^"]*explanation[^"]*"[^>]*>[\s\S]*?<\/div>)/gi,
        (match: string) => {
          // Add inline white color to all elements within explanation
          return match.replace(/<(p|div|span|h[1-6])([^>]*)>/gi, '<$1$2 style="color: white !important;">');
        }
      );
      
      const quizMessage = {
        id: Math.random().toString(36).substring(7),
        text: processedHtml,
        isUser: false,
        timestamp: new Date(),
        isFromLearnDialog: true,
        isSavedContent: true,
        savedContentType: 'Failed Quiz'
      };
      
      console.log('ReviewQuizzes - Viewing failed quiz:', quizMessage);
      addExternalMessage(quizMessage);
    } catch (e) {
      console.error('Error viewing failed quiz:', e);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: '#00ff00',
            textAlign: 'center',
            mb: 2,
            textShadow: '0 0 10px rgba(0, 255, 0, 0.3)'
          }}
        >
          Review Failed Quizzes
        </Typography>
      </Box>

      {userFailedQuizzes.length === 0 ? (
        <Paper
          sx={{
            maxWidth: 600,
            mx: 'auto',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            p: 4,
            textAlign: 'center'
          }}
        >
          <QuizIcon sx={{ fontSize: 64, color: '#667eea', mb: 2 }} />
          <Typography variant="h5" sx={{ color: '#667eea', mb: 2 }}>
            No Failed Quizzes Yet
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            When you get quiz questions wrong, they'll appear here for review and retake.
          </Typography>
        </Paper>
      ) : (
        <Box>
          {/* Header with Clear All Button */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              Failed Quizzes ({userFailedQuizzes.length})
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleClearAllClick}
              sx={{
                borderColor: '#f44336',
                color: '#f44336',
                '&:hover': {
                  borderColor: '#d32f2f',
                  backgroundColor: 'rgba(244, 67, 54, 0.04)',
                }
              }}
            >
              Clear All Failed Quizzes
            </Button>
          </Box>
          
          <TableContainer component={Paper} sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <Table>
            <TableHead sx={{ 
              backgroundColor: '#0053ff'
            }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Topic
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Skill Level
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Preview
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userFailedQuizzes.map((quiz, index) => {
                // Extract plain text from HTML for preview
                const plainText = quiz.html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                const preview = plainText.slice(0, 30) + (plainText.length > 30 ? '...' : '');
                const tooltip = `Click to view quiz: ${plainText.slice(0, 100)}${plainText.length > 100 ? '...' : ''}`;
                
                return (
                  <TableRow 
                    key={index}
                    sx={{ 
                      backgroundColor: index % 2 === 0 ? '#000000' : '#424242',
                      '&:hover': {
                        backgroundColor: index % 2 === 0 ? '#1a1a1a' : '#525252'
                      }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'medium', color: 'white' }}>
                      {quiz.topic}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={quiz.skillLevel}
                        size="small"
                        sx={{
                          backgroundColor: 
                            quiz.skillLevel.toLowerCase() === 'basic' || quiz.skillLevel.toLowerCase() === 'easy' 
                              ? '#4caf50' 
                              : quiz.skillLevel.toLowerCase() === 'intermediate' || quiz.skillLevel.toLowerCase() === 'medium'
                              ? '#ff9800'
                              : '#f44336',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      <Tooltip title={tooltip} arrow>
                        <Typography 
                          variant="body2" 
                          onClick={() => handleViewFailedQuiz(quiz)}
                          sx={{ 
                            cursor: 'pointer',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '4px',
                              padding: '2px 4px',
                              margin: '-2px -4px'
                            }
                          }}
                        >
                          {preview}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleViewFailedQuiz(quiz)}
                          sx={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#1565c0'
                            },
                            minWidth: '60px'
                          }}
                        >
                          View
                        </Button>
                        <Tooltip title="Delete Quiz">
                          <IconButton
                            onClick={() => handleDeleteClick(index)}
                            sx={{
                              color: '#f44336',
                              '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.1)'
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        </Box>
      )}

      {userFailedQuizzes.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Total Failed Quizzes: {userFailedQuizzes.length}
          </Typography>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Failed Quiz</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this failed quiz? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear All Confirmation Dialog */}
      <Dialog open={clearAllDialogOpen} onClose={handleCancelClearAll}>
        <DialogTitle>Clear All Failed Quizzes</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to clear all {userFailedQuizzes.length} failed quizzes? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClearAll} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmClearAll} color="error" variant="contained">
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReviewQuizzes;
