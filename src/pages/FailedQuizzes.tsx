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
  Button,
  Divider
} from '@mui/material';
import {
  Delete as DeleteIcon,
  QuizOutlined as QuizIcon
} from '@mui/icons-material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { useQuiz } from '../contexts/quizContext';
import { useChat } from '../contexts/chatContext';

const FailedQuizzes: React.FC = () => {
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
      // Process the quiz.html string to apply styles and format code blocks
      let processedHtml = quiz.html;

      // Add option class if missing
      processedHtml = processedHtml.replace(
        /<div>([A-D]\))/gi,
        '<div class="option"><span class="option-prefix">$1</span>'
      );

      // Style options divs for visibility
      processedHtml = processedHtml.replace(
        /<div([^>]*class="[^"]*option[^"]*"[^>]*)>/gi,
        '<div$1 style="border: 1px solid #666 !important; border-radius: 8px !important; margin-bottom: 10px !important; background-color: #2A2A2A !important; color: white !important; display: block !important;">'
      );

      // Style option prefixes with cyan color
      processedHtml = processedHtml.replace(
        /<span([^>]*class="[^"]*option-prefix[^"]*"[^>]*)>/gi,
        '<span$1 style="color: #00FFFF !important; font-weight: bold !important; margin-right: 8px !important; display: inline-block !important;">'
      );

     

      processedHtml = processedHtml.replace(
  /<pre[^>]*>\s*<code class="language-([^"]+)">([\s\S]*?)<\/code>\s*<\/pre>/gi,
  (match: string, language: string, code: string) => {
    const decodedCode = code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'");
    return `\`\`\`${language}\n${decodedCode}\n\`\`\``;
  }
);

processedHtml = processedHtml.replace(
  /<code class="language-([^"]+)">([\s\S]*?)<\/code>/gi,
  (match: string, language: string, code: string) => {
    const decodedCode = code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'");
    return `\`\`\`${language}\n${decodedCode}\n\`\`\``;
  }
);


      // Additional styling fixes for other elements
      processedHtml = processedHtml.replace(
        /<div class="correct-answer">/gi,
        '<div class="correct-answer" style="color: #4caf50 !important; font-weight: bold !important; margin-bottom: 10px !important; font-size: 1.1rem !important; padding: 10px 0 !important; border-bottom: 1px solid #444 !important;">'
      );

      processedHtml = processedHtml.replace(
        /<div class="question-container">/gi,
        '<div class="question-container" style="color: white !important;">'
      );

      processedHtml = processedHtml.replace(
        /<p([^>]*class="[^"]*explanation[^"]*"[^>]*)>/gi,
        '<p$1 style="color: white !important;">'
      );

      // Prepare quiz message for adding to chat
      const quizMessage = {
        id: Math.random().toString(36).substring(7),
        text: processedHtml,
        isUser: false,
        timestamp: new Date(),
        isFromLearnDialog: true,
        isSavedContent: true,
        isViewingQuizContent: true,
        savedContentType: 'Failed Quiz'
      };

      addExternalMessage(quizMessage);
    } catch (e) {
      console.error('Error viewing failed quiz:', e);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Cool New Feature Banner - Aligned with main content */}
      <Box sx={{ 
        maxWidth: '100%', 
        margin: '0 auto',
        mb: 3
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          mb: 1
        }}>
          <CheckCircle color="success" sx={{ mr: 2 }} />
          <Typography variant="h6">
            Cool New Feature!
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
      </Box>
      
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ color: 'white' }}>
          Failed Quizzes
        </Typography>
        {userFailedQuizzes.length > 0 && (
          <Button variant="outlined" color="error" onClick={handleClearAllClick}>
            Clear All
          </Button>
        )}
      </Box>

      <Box>
        <TableContainer component={Paper} sx={{ backgroundColor: '#121212' }}>
          <Table aria-label="failed quizzes table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Topic</TableCell>
                <TableCell sx={{ color: 'white' }}>Skill Level</TableCell>
                <TableCell sx={{ color: 'white' }}>Preview</TableCell>
                <TableCell sx={{ color: 'white', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userFailedQuizzes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', color: 'gray' }}>
                    {/* Empty row for no data */}
                  </TableCell>
                </TableRow>
              ) : (
                userFailedQuizzes.map((quiz, index) => {
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

export default FailedQuizzes;
