import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper 
} from '@mui/material';
import { getMarketingPlan } from '../services/aiService';

export const MarketingAI: React.FC = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  React.useEffect(() => {
    if (result && currentIndex < result.length) {
      // Add characters in chunks for faster typing effect
      const chunkSize = 5;
      const timer = setTimeout(() => {
        const nextChunk = result.slice(currentIndex, currentIndex + chunkSize);
        setCurrentText(prev => prev + nextChunk);
        setCurrentIndex(c => c + chunkSize);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [result, currentIndex]);
  const [buttonText, setButtonText] = useState('Get Marketing Plan');
  const handleFetch = async () => {
    try {
      setIsLoading(true);
      setButtonText('Please wait....');
      setCurrentText('');
      setCurrentIndex(0);
      const urlToAnalyze = url.trim() || 'ford.com';
      if (!url.trim()) {
        setUrl('ford.com');
      }
      const response = await getMarketingPlan(urlToAnalyze);
      setResult(response);
      setIsLoading(false);
      setButtonText('Get Marketing Plan');
    } catch (error) {
      console.error('Error fetching marketing plan:', error);
      setResult('Error fetching results. Please try again.');
      setIsLoading(false);
      setButtonText('Get Marketing Plan');
    }
  };
  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3, md: 3 },
          background: 'linear-gradient(180deg, rgba(35, 35, 35, 0.95) 0%, rgba(25, 25, 25, 0.98) 100%)',
          borderRadius: 3,
          border: '1px solid rgba(144, 202, 249, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)'
        }}
      >        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          color="primary.main" 
          textAlign="center"
          sx={{            fontSize: { xs: '2rem', sm: '2.5rem' },
            fontWeight: 600,
            mb: 2,
            background: 'linear-gradient(45deg, #90CAF9 10%, #64B5F6 50%, #42A5F5 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 15px rgba(144, 202, 249, 0.2)',
            letterSpacing: '-0.5px'
          }}
        >
          Marketing AI
        </Typography>

        <Box sx={{ mt: 2, mb: 1 }}>
          <TextField
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter company URL (e.g., ford.com, tacobell.com)"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleFetch();
              }
            }}
            variant="outlined"
            multiline
            minRows={1}
            maxRows={4}
            sx={{
              // Target the placeholder for both input and textarea
              '& ::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)',
                opacity: 1,
              },
              '& .MuiInputBase-root': {
                minHeight: '56px',
                height: 'auto',
                fontSize: '1.1rem',
                paddingTop: '10px', // Adjusted padding for multiline
                paddingBottom: '10px', // Adjusted padding for multiline
                color: 'white', // Set text color on the root as well for good measure
              },
              // Target the actual input/textarea element
              '& .MuiInputBase-input': {
                color: 'white', // Explicitly set text color here
                whiteSpace: 'pre-wrap !important', // Ensure wrapping
                wordBreak: 'break-word !important', // Ensure words break correctly
                overflowX: 'hidden !important', // Prevent horizontal scroll
                // overflowY: 'auto', // Vertical scroll will be handled by maxRows
                lineHeight: '1.5em', // Adjust line height for readability
                padding: '0px 14px !important', // Re-apply padding here if MuiInputBase-root padding isn't enough due to internal structure
              },
              // Ensure the fieldset border is styled correctly
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(144, 202, 249, 0.2)',
                  borderWidth: '2px',
                  transition: 'all 0.2s ease-in-out',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(144, 202, 249, 0.4)',
                  backgroundColor: 'rgba(144, 202, 249, 0.02)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#90CAF9',
                  borderWidth: '2px',
                  boxShadow: '0 0 20px rgba(144, 202, 249, 0.15)',
                },
              },
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
            }}
          />
        </Box>        <Button
          variant="contained"
          onClick={handleFetch}
          disabled={isLoading}
          fullWidth
          sx={{            py: 1.5,
            mb: 2,
            mt: 1,
            background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
            fontSize: '1.1rem',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '12px',
            letterSpacing: '0.5px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 10%, #2196F3 70%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
            },
            '&:disabled': {
              backgroundColor: 'rgba(144, 202, 249, 0.12)',
              color: 'rgba(255, 255, 255, 0.3)'
            }
          }}
        >
          {buttonText}
        </Button>        {currentText && (          <Box            sx={{ 
              mt: 3,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent 0%, #90CAF9 50%, transparent 100%)',
                borderRadius: '4px',
                opacity: 0.6
              }
            }}
          >
            <Typography
              variant="body1"
              component="div"
              sx={{      
                color: 'white',
                fontSize: '1.1rem',
                
              }}
              dangerouslySetInnerHTML={{ __html: currentText }}
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};
