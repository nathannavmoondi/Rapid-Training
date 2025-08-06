import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Button,
  Paper,
  Divider
} from '@mui/material';
import { MenuBook as MenuBookIcon, School as SchoolIcon, CheckCircle } from '@mui/icons-material';
import { useChat } from '../contexts/chatContext';
import { chatService } from '../services/chatService';
import { useNavigate } from 'react-router-dom';

export const IWantToLearn: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setChatboxSkill, addExternalMessage } = useChat();

  const handleLearnMore = async (useStudyAndLearn: boolean = false) => {
    if (!topic.trim()) return;
    
    setLoading(true);
    try {
      // Set the chatbox skill to the topic
      setChatboxSkill(topic);
      
      // Generate AI explanation for the topic
      const aiResponse = await chatService.explainTopicInDepth(
        "General Learning",
        topic,
        "english",
        false,
        useStudyAndLearn
      );
      
      // Add AI response to chat
      addExternalMessage(aiResponse);
      
      setTopic(''); // Clear the input for next query
    } catch (error) {
      console.error('Failed to start learning:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && topic.trim() && !loading) {
      handleLearnMore(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
      {/* Cool New Feature Banner - Aligned with main card */}
      <Box sx={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        mb: 2
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

      <Box sx={{ mb: 4, textAlign: 'center' }}>                      
        
        <Typography variant="h3" sx={{ 
          color: 'white',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          mb: 2
        }}>
          <MenuBookIcon sx={{ fontSize: 45 }} />
          Learning Hub
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Explore any topic with AI-powered learning
        </Typography>
      </Box>

      {/* Main Content Card */}
      <Box sx={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        borderRadius: 4,
        p: 6,
        textAlign: 'center'
      }}>
          {/* Learning Icons */}
          <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MenuBookIcon sx={{ fontSize: 60, color: '#42a5f5', mb: 1 }} />
            <SchoolIcon sx={{ fontSize: 40, color: '#ffb74d' }} />
          </Box>

          <Typography
            variant="h6"
            sx={{
              color: 'white',
              mb: 3,
              fontWeight: 'medium',
              lineHeight: 1.4
            }}
          >
            What subject would you like to learn?
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 3,
              fontSize: '0.9rem',
              fontStyle: 'italic'
            }}
          >
            (e.g: dog walking, hvac basics, .net logging, difference between interface and type in typescript)
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter any subject you want to learn..."
            disabled={loading}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: 2,
                fontSize: '1.1rem',
                '& input': {
                  color: 'black',
                  padding: '16px 14px'
                },
                '&:hover fieldset': {
                  borderColor: '#42a5f5'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976D2'
                }
              }
            }}
          />

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <CircularProgress sx={{ color: '#42a5f5' }} />
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Button
              onClick={() => handleLearnMore(false)}
              disabled={!topic.trim() || loading}
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#1976D2',
                color: 'white',
                fontWeight: 'bold',
                px: 6,
                py: 1.5,
                fontSize: '1.2rem',
                borderRadius: 3,
                textTransform: 'none',
                '&:hover': { 
                  backgroundColor: '#1565C0',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                },
                transition: 'all 0.2s ease-in-out',
                '&:disabled': {
                  backgroundColor: 'rgba(25, 118, 210, 0.3)',
                  color: 'rgba(255, 255, 255, 0.5)'
                }
              }}
            >
              {loading ? 'Start Learning' : 'Start Learning'}
            </Button>
            <Button
              onClick={() => handleLearnMore(true)}
              disabled={!topic.trim() || loading}
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#4CAF50',
                color: 'white',
                fontWeight: 'bold',
                px: 6,
                py: 1.5,
                fontSize: '1.2rem',
                borderRadius: 3,
                textTransform: 'none',
                '&:hover': { 
                  backgroundColor: '#388E3C',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                },
                transition: 'all 0.2s ease-in-out',
                '&:disabled': {
                  backgroundColor: 'rgba(76, 175, 80, 0.3)',
                  color: 'rgba(255, 255, 255, 0.5)'
                }
              }}
            >
              {loading ? 'Study and Learn (OpenAI Beta)'  : 'Study and Learn (OpenAI Beta)'}
            </Button>
          </Box>
        </Box>
    </Container>
  );
};

export default IWantToLearn;
