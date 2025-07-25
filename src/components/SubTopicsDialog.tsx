import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress,
  Alert
} from '@mui/material';
import { Close as CloseIcon, School as SchoolIcon } from '@mui/icons-material';
import { getSubTopics } from '../services/aiService';

interface SubTopicsDialogProps {
  open: boolean;
  onClose: () => void;
  skillTitle: string;
  onLearnMore: (subTopic: string) => void;
}

export const SubTopicsDialog: React.FC<SubTopicsDialogProps> = ({
  open,
  onClose,
  skillTitle,
  onLearnMore
}) => {
  const [subTopics, setSubTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  useEffect(() => {
    if (open && skillTitle) {
      fetchSubTopics();
    }
  }, [open, skillTitle]);

  const fetchSubTopics = async () => {
    setLoading(true);
    setError(null);
    try {
      const topics = await getSubTopics(skillTitle);
      setSubTopics(topics);
    } catch (err) {
      setError('Failed to load sub topics. Please try again.');
      console.error('Error fetching sub topics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLearnMore = () => {
    if (selectedTopic) {
      onLearnMore(selectedTopic);
      onClose();
    }
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(45, 45, 45, 0.95)',
          border: '1px solid rgba(156, 39, 176, 0.3)',
          borderRadius: 2,
          minHeight: '500px'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 'bold',
          fontSize: '1.5rem'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon />
          Sub Topics for {skillTitle}
        </Box>
        <Button
          onClick={onClose}
          sx={{ 
            color: 'white',
            minWidth: 'auto',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 3, backgroundColor: 'rgba(30, 30, 30, 0.9)' }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px',
              gap: 2
            }}
          >
            <CircularProgress sx={{ color: '#9C27B0' }} />
            <Typography sx={{ color: 'white' }}>
              Loading sub topics for {skillTitle}...
            </Typography>
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              color: 'white',
              '& .MuiAlert-icon': { color: '#f44336' }
            }}
          >
            {error}
          </Alert>
        ) : (
          <>
            <Typography
              variant="h6"
              sx={{
                color: '#9C27B0',
                mb: 3,
                textAlign: 'center',
                fontWeight: 'medium'
              }}
            >
              Select a sub topic to learn more about:
            </Typography>

            <Grid container spacing={2}>
              {subTopics.map((topic, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Card
                    sx={{
                      backgroundColor: selectedTopic === topic 
                        ? 'rgba(156, 39, 176, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: selectedTopic === topic 
                        ? '2px solid #9C27B0' 
                        : '1px solid rgba(156, 39, 176, 0.2)',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(156, 39, 176, 0.15)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)'
                      }
                    }}
                  >
                    <CardActionArea onClick={() => handleTopicSelect(topic)}>
                      <CardContent sx={{ p: 2, textAlign: 'center' }}>
                        <Typography
                          sx={{
                            color: 'white',
                            fontWeight: selectedTopic === topic ? 'bold' : 'medium',
                            fontSize: '0.95rem',
                            lineHeight: 1.4
                          }}
                        >
                          {topic}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {selectedTopic && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: 'rgba(156, 39, 176, 0.1)',
                  border: '1px solid rgba(156, 39, 176, 0.3)',
                  borderRadius: 1,
                  textAlign: 'center'
                }}
              >
                <Typography sx={{ color: 'white', fontWeight: 'medium' }}>
                  Selected: <span style={{ color: '#9C27B0' }}>{selectedTopic}</span>
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem', mt: 1 }}>
                  Click "Learn More" to get a detailed explanation
                </Typography>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: 'rgba(30, 30, 30, 0.9)',
          p: 3,
          justifyContent: 'space-between'
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#d32f2f',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#c62828'
            },
            '&:disabled': {
              backgroundColor: 'rgba(211, 47, 47, 0.3)',
              color: 'rgba(255, 255, 255, 0.5)'
            }
          }}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleLearnMore}
          disabled={!selectedTopic || loading}
          variant="contained"
          sx={{
            backgroundColor: '#9C27B0',
            color: 'white',
            fontWeight: 'bold',
            px: 4,
            '&:hover': { backgroundColor: '#7B1FA2' },
            '&:disabled': {
              backgroundColor: 'rgba(156, 39, 176, 0.3)',
              color: 'rgba(255, 255, 255, 0.5)'
            }
          }}
        >
          Learn More
        </Button>
      </DialogActions>
    </Dialog>
  );
};
