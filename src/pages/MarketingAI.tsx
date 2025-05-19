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
    if (result && currentIndex < result.length) {      const timer = setTimeout(() => {
        setCurrentText(prev => prev + result[currentIndex]);
        setCurrentIndex(c => c + 1);
      }, 0); // Speed of typewriter effect - super fast
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(45, 45, 45, 0.8)', borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary.main" textAlign="center">
          Marketing AI
        </Typography>

        <Box sx={{ mt: 3, mb: 2 }}>
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
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(144, 202, 249, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(144, 202, 249, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleFetch}
          disabled={isLoading}
          fullWidth
          sx={{
            py: 1.5,
            mb: 3,
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          {buttonText}
        </Button>

        {currentText && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="body1"
              component="div"
              sx={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                p: 2,
                borderRadius: 1,
                border: '1px solid rgba(144, 202, 249, 0.2)',
                minHeight: '200px'
              }}
            >
              {currentText}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};
