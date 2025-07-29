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
  Save as SaveIcon
} from '@mui/icons-material';
import { useQuiz } from '../contexts/quizContext';
import { useChat } from '../contexts/chatContext';
import { useNavigate } from 'react-router-dom';

const MyQuizzes: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { userSavedSnippets, setUserSavedSnippets, clearSavedSnippets } = useQuiz();
  const { addExternalMessage } = useChat();
  const navigate = useNavigate();

  // Debug logging for snippets
  console.log('MyQuizzes - Current saved snippets:', userSavedSnippets.length);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleDeleteSnippet = (index: number) => {
    setUserSavedSnippets(prev => prev.filter((_, i) => i !== index));
  };

  const handleViewSnippet = async (snippet: string) => {
    try {
      // Create a message directly with the saved snippet content
      const snippetMessage = {
        id: Math.random().toString(36).substring(7),
        text: snippet,
        isUser: false,
        timestamp: new Date(),
        isFromLearnDialog: true // Mark as from learn dialog so save button appears
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
              Use the "I Want to Learn" feature and save AI responses to see them here.
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
              Start Learning
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
                    label={
                      snippet.startsWith('Topic: ') 
                        ? snippet.split('\n')[0].replace('Topic: ', '')
                        : `Snippet ${index + 1}`
                    }
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                      color: '#4caf50',
                      fontWeight: 'bold',
                      maxWidth: '200px'
                    }}
                  />
                </Box>
                
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.5,
                    minHeight: '6em'
                  }}
                >
                  {(() => {
                    // Extract content after "Topic: xxx" if it exists
                    const content = snippet.startsWith('Topic: ') 
                      ? snippet.split('\n\n').slice(1).join('\n\n')
                      : snippet;
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
        {activeTab === 0 && renderUnderDevelopment("Quizzes Under Development", "Here you will see list of your saved quizzes")}
        {activeTab === 1 && renderUnderDevelopment("Coder Tests Under Development", "Here you will see list of your saved coder test results")}
        {activeTab === 2 && renderUnderDevelopment("Slidedecks Under Development", "Here you will see list of your saved slidedecks")}
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
    </Container>
  );
};

export default MyQuizzes;
