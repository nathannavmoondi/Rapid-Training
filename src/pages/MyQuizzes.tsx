import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  Button,
  Tooltip,
  Chip
} from '@mui/material';
import {
  Quiz as QuizIcon,
  Construction as ConstructionIcon,
  BookmarkBorder as BookmarkIcon,
  Code as CodeIcon,
  School as SchoolIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Save as SaveIcon,
  Slideshow as SlideshowIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useQuiz, SavedItem, generateLabelFromHtml } from '../contexts/quizContext';
import { useChat } from '../contexts/chatContext';
import { useNavigate } from 'react-router-dom';
import EditLabelDialog from '../components/EditLabelDialog';

const MyQuizzes: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    index: number;
    label: string;
    type: 'snippet' | 'quiz' | 'slidedeck' | 'codertest';
  } | null>(null);
  
  const { 
    userSavedSnippets, 
    setUserSavedSnippets, 
    clearSavedSnippets,
    savedUserCoderTests,
    setSavedUserCoderTests,
    clearSavedCoderTests,
    savedUserQuizzes,
    setSavedUserQuizzes,
    clearSavedQuizzes,
    savedUserSlidedecks,
    setSavedUserSlidedecks,
    clearSavedSlidedecks
  } = useQuiz();
  const { addExternalMessage } = useChat();
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleDeleteSnippet = (index: number) => {
    setUserSavedSnippets(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditSnippet = (index: number) => {
    setEditingItem({
      index,
      label: userSavedSnippets[index].label,
      type: 'snippet'
    });
    setEditDialogOpen(true);
  };

  const handleViewSnippet = async (snippet: SavedItem) => {
    try {
      // Create a message directly with the saved snippet content
      const snippetMessage = {
        id: Math.random().toString(36).substring(7),
        text: snippet.html,
        isUser: false,
        timestamp: new Date(),
        isFromLearnDialog: true, // Mark as from learn dialog so save button appears
        isSavedContent: true, // Mark as saved content to hide save button
        savedContentType: 'Saved Snippet'
      };
      
      console.log('MyQuizzes - Viewing snippet:', snippetMessage);
      
      // Add the snippet as an external message
      addExternalMessage(snippetMessage);
      
      // Don't navigate away - the chat should auto-open on this page due to external messages
      // The App.tsx has logic to auto-open chat when external messages are added
    } catch (e) {
      console.error('Error viewing snippet:', e);
    }
  };

  // Coder Tests handlers
  const handleDeleteCoderTest = (index: number) => {
    setSavedUserCoderTests(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditCoderTest = (index: number) => {
    setEditingItem({
      index,
      label: savedUserCoderTests[index].label,
      type: 'codertest'
    });
    setEditDialogOpen(true);
  };

  const handleViewCoderTest = async (test: SavedItem) => {
    try {
      const testMessage = {
        id: Math.random().toString(36).substring(7),
        text: test.html,
        isUser: false,
        timestamp: new Date(),
        isViewingQuizContent: false,  // Coder tests should NOT use quiz styling
        isSavedContent: true, // Mark as saved content to hide save button
        savedContentType: 'Saved Coder Test'
      };
      
      addExternalMessage(testMessage);
    } catch (e) {
      console.error('Error viewing coder test:', e);
    }
  };

  // Quizzes handlers
  const handleDeleteQuiz = (index: number) => {
    setSavedUserQuizzes(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditQuiz = (index: number) => {
    setEditingItem({
      index,
      label: savedUserQuizzes[index].label,
      type: 'quiz'
    });
    setEditDialogOpen(true);
  };

  const handleViewQuiz = async (quiz: SavedItem) => {
    try {
      // Ensure options and explanation divs have white text color
      let processedHtml = quiz.html;
      
      // Add inline styles to options to ensure white text
      processedHtml = processedHtml.replace(
        /<div([^>]*class="[^"]*option[^"]*"[^>]*)>/gi,
        '<div$1 style="color: white !important;">'
      );
      
      // Also handle explanation paragraphs
      processedHtml = processedHtml.replace(
        /<p([^>]*class="[^"]*explanation[^"]*"[^>]*)>/gi,
        '<p$1 style="color: white !important;">'
      );
      
      // Handle any explanation content that might not have proper styling
      processedHtml = processedHtml.replace(
        /(<div[^>]*class="[^"]*explanation[^"]*"[^>]*>)([\s\S]*?)(<\/div>)/gi,
        (match: string, openingTag: string, content: string, closingTag: string) => {
          // Add white color to the explanation div itself and all elements within it
          const whiteOpeningTag = openingTag.replace('>', ' style="color: white !important;">');
          const whiteContent = content.replace(/<(p|div|span|h[1-6])([^>]*)>/gi, '<$1$2 style="color: white !important;">');
          return whiteOpeningTag + whiteContent + closingTag;
        }
      );

      const quizMessage = {
        id: Math.random().toString(36).substring(7),
        text: processedHtml,
        isUser: false,
        timestamp: new Date(),
        isViewingQuizContent: true,
        isSavedContent: true, // Mark as saved content to hide save button
        savedContentType: 'Saved Quiz'
      };
      
      addExternalMessage(quizMessage);
    } catch (e) {
      console.error('Error viewing quiz:', e);
    }
  };

  // Slidedecks handlers
  const handleDeleteSlidedeck = (index: number) => {
    setSavedUserSlidedecks(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditSlidedeck = (index: number) => {
    setEditingItem({
      index,
      label: savedUserSlidedecks[index].label,
      type: 'slidedeck'
    });
    setEditDialogOpen(true);
  };

  const handleViewSlidedeck = async (slidedeck: SavedItem) => {
    try {
      const slidedeckMessage = {
        id: Math.random().toString(36).substring(7),
        text: slidedeck.html,
        isUser: false,
        timestamp: new Date(),
        isViewingQuizContent: false,  // Slidedecks should have code highlighting, not quiz styling
        isSavedContent: true, // Mark as saved content to hide save button
        savedContentType: 'Saved Slide Deck'
      };
      
      addExternalMessage(slidedeckMessage);
    } catch (e) {
      console.error('Error viewing slidedeck:', e);
    }
  };

  // Edit dialog handlers
  const handleSaveLabel = (newLabel: string) => {
    if (!editingItem) return;
    
    const { index, type } = editingItem;
    
    switch (type) {
      case 'snippet':
        setUserSavedSnippets(prev => 
          prev.map((item, i) => 
            i === index ? { ...item, label: newLabel } : item
          )
        );
        break;
      case 'codertest':
        setSavedUserCoderTests(prev => 
          prev.map((item, i) => 
            i === index ? { ...item, label: newLabel } : item
          )
        );
        break;
      case 'quiz':
        setSavedUserQuizzes(prev => 
          prev.map((item, i) => 
            i === index ? { ...item, label: newLabel } : item
          )
        );
        break;
      case 'slidedeck':
        setSavedUserSlidedecks(prev => 
          prev.map((item, i) => 
            i === index ? { ...item, label: newLabel } : item
          )
        );
        break;
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingItem(null);
  };

  const getItemTypeName = (type: string) => {
    switch (type) {
      case 'snippet': return 'Snippet';
      case 'codertest': return 'Coder Test';
      case 'quiz': return 'Quiz';
      case 'slidedeck': return 'Slide Deck';
      default: return 'Item';
    }
  };

  const renderUnderDevelopment = (title: string, description: string) => (
    <Card
      sx={{
        maxWidth: 600,
        mx: 'auto',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        {/* Icons */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <ConstructionIcon sx={{ fontSize: 48, color: '#667eea' }} />
          <QuizIcon sx={{ fontSize: 48, color: '#764ba2' }} />
          <BookmarkIcon sx={{ fontSize: 48, color: '#667eea' }} />
        </Box>

        {/* Main Status */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#667eea',
            mb: 3,
            fontSize: { xs: '1.8rem', sm: '2.2rem' }
          }}
        >
          {title}
        </Typography>

        {/* Divider */}
        <Box
          sx={{
            width: 60,
            height: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2,
            mx: 'auto',
            mb: 3
          }}
        />

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            lineHeight: 1.6,
            fontSize: '1.1rem',
            fontWeight: 'medium'
          }}
        >
          {description}
        </Typography>

        {/* Coming Soon Badge */}
        <Paper
          sx={{
            display: 'inline-block',
            mt: 3,
            px: 3,
            py: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 20,
            fontWeight: 'bold',
            fontSize: '0.9rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}
        >
          Coming Soon
        </Paper>
      </CardContent>
    </Card>
  );

  // Render functions for different content types
  const renderCoderTests = () => {
    if (savedUserCoderTests.length === 0) {
      return (
        <Card
          sx={{
            maxWidth: 600,
            mx: 'auto',
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)',
            border: '1px solid rgba(25, 118, 210, 0.2)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <CodeIcon sx={{ fontSize: 64, color: '#1976d2', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
              No Coder Tests Saved Yet
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.6
              }}
            >
              Use the Coder Test feature and save tests to see them here.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/coder-test')}
              sx={{
                mt: 3,
                background: 'linear-gradient(135deg, #1976d2 0%, #3f51b5 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #3949ab 100%)',
                }
              }}
            >
              Visit Coder Test Page
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3
        }}
      >
        {savedUserCoderTests.map((test, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)',
              border: '1px solid rgba(25, 118, 210, 0.2)',
              borderRadius: 3,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CodeIcon sx={{ fontSize: 24, color: '#1976d2', mr: 1 }} />
                <Chip
                  label={test.label}
                  size="small"
                  onClick={() => handleViewCoderTest(test)}
                  sx={{
                    backgroundColor: 'rgba(25, 118, 210, 0.2)',
                    color: '#1976d2',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.3)'
                    }
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                onClick={() => handleViewCoderTest(test)}
                sx={{
                  color: 'text.secondary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.4,
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'text.primary'
                  }
                }}
              >
                {test.html.substring(0, 150)}...
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ViewIcon />}
                onClick={() => handleViewCoderTest(test)}
                sx={{ flex: 1 }}
              >
                View
              </Button>
              <Tooltip title="Edit Label">
                <IconButton
                  onClick={() => handleEditCoderTest(index)}
                  sx={{
                    color: '#2196f3',
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.1)'
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteCoderTest(index)}
              >
                Delete
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    );
  };

  const renderQuizzes = () => {
    if (savedUserQuizzes.length === 0) {
      return (
        <Card
          sx={{
            maxWidth: 600,
            mx: 'auto',
            background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(233, 30, 99, 0.1) 100%)',
            border: '1px solid rgba(156, 39, 176, 0.2)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <QuizIcon sx={{ fontSize: 64, color: '#9c27b0', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
              No Quizzes Saved Yet
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.6
              }}
            >
              Use the Topics feature and save quizzes to see them here.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/skills-refresher')}
              sx={{
                mt: 3,
                background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #8e24aa 0%, #d81b60 100%)',
                }
              }}
            >
              Visit Topics Page
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3
        }}
      >
        {savedUserQuizzes.map((quiz, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(233, 30, 99, 0.1) 100%)',
              border: '1px solid rgba(156, 39, 176, 0.2)',
              borderRadius: 3,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <QuizIcon sx={{ fontSize: 24, color: '#9c27b0', mr: 1 }} />
                <Chip
                  label={quiz.label}
                  size="small"
                  onClick={() => handleViewQuiz(quiz)}
                  sx={{
                    backgroundColor: 'rgba(156, 39, 176, 0.2)',
                    color: '#9c27b0',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(156, 39, 176, 0.3)'
                    }
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                onClick={() => handleViewQuiz(quiz)}
                sx={{
                  color: 'text.secondary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.4,
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'text.primary'
                  }
                }}
              >
                {quiz.html.substring(0, 150)}...
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ViewIcon />}
                onClick={() => handleViewQuiz(quiz)}
                sx={{ flex: 1 }}
              >
                View
              </Button>
              <Tooltip title="Edit Label">
                <IconButton
                  onClick={() => handleEditQuiz(index)}
                  sx={{
                    color: '#2196f3',
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.1)'
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteQuiz(index)}
              >
                Delete
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    );
  };

  const renderSlidedecks = () => {
    if (savedUserSlidedecks.length === 0) {
      return (
        <Card
          sx={{
            maxWidth: 600,
            mx: 'auto',
            background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%)',
            border: '1px solid rgba(255, 152, 0, 0.2)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <SlideshowIcon sx={{ fontSize: 64, color: '#ff9800', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
              No Slidedecks Saved Yet
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.6
              }}
            >
              Use the Topics Slide Deck feature and save slidedecks to see them here.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/topics')}
              sx={{
                mt: 3,
                background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f57c00 0%, #ffb300 100%)',
                }
              }}
            >
              Visit Topics Page
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3
        }}
      >
        {savedUserSlidedecks.map((slidedeck, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%)',
              border: '1px solid rgba(255, 152, 0, 0.2)',
              borderRadius: 3,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SlideshowIcon sx={{ fontSize: 24, color: '#ff9800', mr: 1 }} />
                <Chip
                  label={slidedeck.label}
                  size="small"
                  onClick={() => handleViewSlidedeck(slidedeck)}
                  sx={{
                    backgroundColor: 'rgba(255, 152, 0, 0.2)',
                    color: '#ff9800',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 152, 0, 0.3)'
                    }
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                onClick={() => handleViewSlidedeck(slidedeck)}
                sx={{
                  color: 'text.secondary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.4,
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'text.primary'
                  }
                }}
              >
                {slidedeck.html.substring(0, 150)}...
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ViewIcon />}
                onClick={() => handleViewSlidedeck(slidedeck)}
                sx={{ flex: 1 }}
              >
                View
              </Button>
              <Tooltip title="Edit Label">
                <IconButton
                  onClick={() => handleEditSlidedeck(index)}
                  sx={{
                    color: '#2196f3',
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.1)'
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteSlidedeck(index)}
              >
                Delete
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    );
  };

  const renderSnippets = () => {
    if (userSavedSnippets.length === 0) {
      return (
        <Card
          sx={{
            maxWidth: 600,
            mx: 'auto',
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <SaveIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: '#4caf50',
                mb: 2
              }}
            >
              No Snippets Saved Yet
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.6
              }}
            >
              Use the "I Want to Learn" feature (or use chatbox) and save AI responses to see them here.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/learn')}
              sx={{
                mt: 3,
                background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #45a049 0%, #7cb342 100%)',
                }
              }}
            >
              Visit "I Want to Learn" Page
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3
        }}
      >
        {userSavedSnippets.map((snippet, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)',
              border: '1px solid rgba(76, 175, 80, 0.2)',
              borderRadius: 3,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon sx={{ fontSize: 24, color: '#4caf50', mr: 1 }} />
                  <Chip
                    label={snippet.label}
                    size="small"
                    onClick={() => handleViewSnippet(snippet)}
                    sx={{
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                      color: '#4caf50',
                      fontWeight: 'bold',
                      maxWidth: '200px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.3)'
                      }
                    }}
                  />
                </Box>
                
                <Typography
                  variant="body2"
                  onClick={() => handleViewSnippet(snippet)}
                  sx={{
                    color: 'text.secondary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.5,
                    minHeight: '6em',
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'text.primary'
                    }
                  }}
                >
                  {(() => {
                    // Extract content after "Topic: xxx" if it exists
                    const content = snippet.html.startsWith('Topic: ') 
                      ? snippet.html.split('\n\n').slice(1).join('\n\n')
                      : snippet.html;
                    return content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
                  })()}
                </Typography>
              </CardContent>
              
              <Box
                sx={{
                  p: 2,
                  pt: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 1
                }}
              >
                <Tooltip title="View in Chat">
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewSnippet(snippet)}
                    sx={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #45a049 0%, #7cb342 100%)',
                      }
                    }}
                  >
                    View
                  </Button>
                </Tooltip>
                
                <Tooltip title="Edit Label">
                  <IconButton
                    onClick={() => handleEditSnippet(index)}
                    sx={{
                      color: '#2196f3',
                      '&:hover': {
                        backgroundColor: 'rgba(33, 150, 243, 0.1)'
                      }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Delete Snippet">
                  <IconButton
                    onClick={() => handleDeleteSnippet(index)}
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
            </Card>
        ))}
      </Box>
    );
  };
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
            mb: 2
          }}
        >
          My Collection
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper
        sx={{
          mb: 4,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1rem',
              py: 2,
              color: '#667eea',
              '&.Mui-selected': {
                color: '#764ba2',
                background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%)',
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#764ba2',
              height: 3,
            }
          }}
        >
          <Tab
            icon={<QuizIcon />}
            iconPosition="start"
            label="Quizzes"
          />
          <Tab
            icon={<CodeIcon />}
            iconPosition="start"
            label="Coder Tests"
          />
          <Tab
            icon={<BookmarkIcon />}
            iconPosition="start"
            label="Slidedecks"
          />
          <Tab
            icon={<SaveIcon />}
            iconPosition="start"
            label="Snippets"
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <Box>
            {/* Quizzes Header with Clear Button */}
            {savedUserQuizzes.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <QuizIcon sx={{ color: '#9c27b0' }} />
                  Saved Quizzes ({savedUserQuizzes.length})
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={clearSavedQuizzes}
                  sx={{
                    borderColor: '#f44336',
                    color: '#f44336',
                    '&:hover': {
                      borderColor: '#d32f2f',
                      backgroundColor: 'rgba(244, 67, 54, 0.04)',
                    }
                  }}
                >
                  Clear All Quizzes
                </Button>
              </Box>
            )}
            {renderQuizzes()}
          </Box>
        )}
        {activeTab === 1 && (
          <Box>
            {/* Coder Tests Header with Clear Button */}
            {savedUserCoderTests.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <CodeIcon sx={{ color: '#1976d2' }} />
                  Saved Coder Tests ({savedUserCoderTests.length})
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={clearSavedCoderTests}
                  sx={{
                    borderColor: '#f44336',
                    color: '#f44336',
                    '&:hover': {
                      borderColor: '#d32f2f',
                      backgroundColor: 'rgba(244, 67, 54, 0.04)',
                    }
                  }}
                >
                  Clear All Coder Tests
                </Button>
              </Box>
            )}
            {renderCoderTests()}
          </Box>
        )}
        {activeTab === 2 && (
          <Box>
            {/* Slidedecks Header with Clear Button */}
            {savedUserSlidedecks.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <SlideshowIcon sx={{ color: '#ff9800' }} />
                  Saved Slidedecks ({savedUserSlidedecks.length})
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={clearSavedSlidedecks}
                  sx={{
                    borderColor: '#f44336',
                    color: '#f44336',
                    '&:hover': {
                      borderColor: '#d32f2f',
                      backgroundColor: 'rgba(244, 67, 54, 0.04)',
                    }
                  }}
                >
                  Clear All Slidedecks
                </Button>
              </Box>
            )}
            {renderSlidedecks()}
          </Box>
        )}
        {activeTab === 3 && (
          <Box>
            {/* Snippets Header with Clear Button */}
            {userSavedSnippets.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <SchoolIcon sx={{ color: '#4caf50' }} />
                  Saved Snippets ({userSavedSnippets.length})
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={clearSavedSnippets}
                  sx={{
                    borderColor: '#f44336',
                    color: '#f44336',
                    '&:hover': {
                      borderColor: '#d32f2f',
                      backgroundColor: 'rgba(244, 67, 54, 0.04)',
                    }
                  }}
                >
                  Clear All Snippets
                </Button>
              </Box>
            )}
            {renderSnippets()}
          </Box>
        )}
      </Box>

      {/* Future Features Preview - only show for non-snippets tabs */}
      {activeTab !== 3 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              mb: 2,
              fontWeight: 'medium'
            }}
          >
            Upcoming Features
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 2,
              maxWidth: 500,
              mx: 'auto'
            }}
          >
            {[
              'Save Favorite Quizzes',
              'Quiz History',
              'Performance Analytics',
              'Study Playlists'
            ].map((feature, index) => (
              <Paper
                key={index}
                sx={{
                  px: 2,
                  py: 1,
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: 2,
                  color: '#667eea',
                  fontSize: '0.9rem',
                  fontWeight: 'medium'
                }}
              >
                {feature}
              </Paper>
            ))}
          </Box>
        </Box>
      )}
      
      {/* Edit Label Dialog */}
      <EditLabelDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        currentLabel={editingItem?.label || ''}
        onSave={handleSaveLabel}
        itemType={editingItem ? getItemTypeName(editingItem.type) : ''}
      />
    </Container>
  );
};

export default MyQuizzes;
