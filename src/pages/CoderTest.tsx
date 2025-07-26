import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';

const CoderTest: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const language = searchParams.get('language') || 'Unknown';
  const initialLevel = searchParams.get('level') || 'basic';
  
  const [level, setLevel] = useState(initialLevel);

  const getLanguageDisplayName = (lang: string) => {
    switch (lang) {
      case 'csharp': return 'C#';
      case 'javascript': return 'JavaScript';
      case 'cpp': return 'C++';
      case 'python': return 'Python';
      case 'java': return 'Java';
      default: return lang.charAt(0).toUpperCase() + lang.slice(1);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  const handlePrevious = () => {
    // TODO: Implement previous question logic
    console.log('Previous question');
  };

  const handleNext = () => {
    // TODO: Implement next question logic
    console.log('Next question');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary.main">
          Coder Test - {getLanguageDisplayName(language)}
        </Typography>
      </Box>

      {/* Main Paper */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          backgroundColor: 'rgba(45, 45, 45, 0.7)', 
          borderRadius: 2 
        }}
      >
        {/* Content Area */}
        <Box sx={{ 
          minHeight: '400px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: 4
        }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#9C27B0',
              textAlign: 'center'
            }}
          >
            Coming Soon
          </Typography>
        </Box>

        {/* Bottom Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          {/* Left side - Cancel */}
          <Button
            variant="contained"
            onClick={handleCancel}
            sx={{ 
              backgroundColor: '#f44336',
              color: 'white',
              '&:hover': { backgroundColor: '#d32f2f' }
            }}
          >
            Cancel
          </Button>

          {/* Right side - Previous and Next */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              onClick={handlePrevious}
              sx={{ 
                backgroundColor: '#2196F3',
                color: 'white',
                '&:hover': { backgroundColor: '#1976D2' }
              }}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ 
                backgroundColor: '#2196F3',
                color: 'white',
                '&:hover': { backgroundColor: '#1976D2' }
              }}
            >
              Next
            </Button>
          </Box>
        </Box>

        {/* Level Dropdown - Bottom Row */}
        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-start' }}>
          <Typography variant="body1" sx={{ color: 'white', mr: 1 }}>Level:</Typography>
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel id="level-select-label" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}></InputLabel>
            <Select
              labelId="level-select-label"
              id="level-select"
              value={level}
              label=""
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Select option</span>;
                }
                return selected;
              }}
              onChange={(e) => setLevel(e.target.value as string)}
              sx={{
                backgroundColor: '#4CAF50',
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2E7D32',
                },
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1B5E20',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#388E3C',
                },
              }}
            >
              <MenuItem value="">
                <em>Select option</em>
              </MenuItem>
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
    </Container>
  );
};

export default CoderTest;
