import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import MemoryIcon from '@mui/icons-material/Memory';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { useChat } from '../contexts/chatContext';
import { useLocation, useParams } from 'react-router-dom';
import { getRefresherSyntax } from '../services/aiService';
import { chatService, ChatMessage } from '../services/chatService';

const Refresher: React.FC = () => {
  const [skillLevel, setSkillLevel] = useState('basic');
  const [loading, setLoading] = useState(false);
  const { 
    setChatboxSkill, 
    addExternalMessage,
    setIsRefresherSession, 
    setRefresherSkill, 
    setRefresherLevel 
  } = useChat();
  const location = useLocation();
  const params = useParams();
  
  // Extract skill from URL query parameters
  const skill = new URLSearchParams(location.search).get('skill') || params.skill || 'React';

  const handleSkillLevelChange = (event: SelectChangeEvent) => {
    setSkillLevel(event.target.value);
  };
  
  const handleStartRefresher = async () => {
    setLoading(true);
    try {
      // Set the chatbox title to "Refresher: {skill}"
      setChatboxSkill(`Refresher: ${skill}`);
      
      // Set refresher context flags
      setIsRefresherSession(true);
      setRefresherSkill(skill);
      setRefresherLevel(skillLevel);
      
      // Call the AI service to get refresher content
      const refresherContent = await getRefresherSyntax(skill, skillLevel);
      
      // Add the AI response to the chat (refresherContent is already a ChatMessage object)
      addExternalMessage(refresherContent);
    } catch (error) {
      console.error('Failed to start refresher:', error);
      // Create a ChatMessage object for the error
      const errorMessage = {
        id: Date.now().toString(),
        text: 'Sorry, there was an error generating the refresher content. Please try again.',
        isUser: false,
        timestamp: new Date(),
        isFromLearnDialog: true,
        originalTopic: `${skill} Refresher (${skillLevel})`
      };
      addExternalMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card 
        variant="outlined" 
        sx={{ 
          maxWidth: 800, 
          mx: 'auto', 
          mb: 4,
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(59, 63, 85, 0.5)',
          backgroundColor: '#262b3d'
        }}
      >
        <CardContent sx={{ p: 4 }}>

            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <CheckCircle color="success" sx={{ mr: 2 }} />
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                   Cool New Feature! 
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, mb: 3 }}>
            <CodeIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <KeyboardIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <MemoryIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          </Box>
          
          <Typography variant="h4" component="div" align="center" gutterBottom sx={{ fontWeight: 500, mb: 2, color: '#a5b3ff' }}>
            {skill} Refresher
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Divider sx={{ width: '120px', height: '3px', backgroundColor: '#a5b3ff', opacity: 0.7 }} />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ textAlign: 'center', color: '#d1d8ff', marginBottom: '10px' }}>
              Select your skill level to get tailored syntax examples for {skill} that you can type out to refresh your knowledge.
              <br />
                 <Divider sx={{ mb: 2, mt: 2 }} />
                
              The AI will provide code snippets for you to retype. Typing out code is one of the best ways to reinforce your memory!
            </Typography>
          </Box>
          
          <FormControl 
            sx={{ 
              width: '250px', 
              mx: 'auto', 
              mb: 4,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                color: '#d1d8ff',
                '& fieldset': {
                  borderColor: 'rgba(165, 179, 255, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: '#a5b3ff',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#a5b3ff',
              },
              '& .MuiSvgIcon-root': {
                color: '#a5b3ff',
              }
            }}
          >
            <InputLabel id="skill-level-label">Skill Level</InputLabel>
            <Select
              labelId="skill-level-label"
              id="skill-level-select"
              value={skillLevel}
              label="Skill Level"
              onChange={handleSkillLevelChange}
            >
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
          
          <Divider sx={{ mt: 2, mb: 4 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleStartRefresher}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <CodeIcon />}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Loading...' : `Start ${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)} Refresher`}
            </Button>
          </Box>
          
          <Divider sx={{ mt: 4 }} />
        </CardContent>
      </Card>
    </Container>
  );
};

export default Refresher;