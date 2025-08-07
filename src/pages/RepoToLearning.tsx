import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  GitHub as GitHubIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as ProcessIcon
} from '@mui/icons-material';

export const RepoToLearning: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [branchName, setBranchName] = useState<string>('main');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidRepo, setIsValidRepo] = useState<boolean | null>(null);

  const handleRepoUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRepoUrl(event.target.value);
    // Reset validation state when input changes
    setIsValidRepo(null);
  };

  const handleBranchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBranchName(event.target.value);
  };

  const handleProcessRepo = () => {
    // Basic validation
    if (!repoUrl.trim()) {
      setIsValidRepo(false);
      return;
    }
    
    // Simple GitHub URL validation
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    if (!githubRegex.test(repoUrl)) {
      setIsValidRepo(false);
      return;
    }
    
    setIsValidRepo(true);
    setIsProcessing(true);
    
    // Simulating a process with a timeout
    setTimeout(() => {
      setIsProcessing(false);
      // Additional logic would go here for actual processing
    }, 2000);
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
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
                  <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                  <Typography variant="h6">
                    Cool New Feature!
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
              </Box>

      {/* Header */}
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
          <GitHubIcon sx={{ fontSize: 45, color: '#1976d2' }} />
          Repo Learning
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Create interactive learning materials from a GitHub Repository<br/>
        <span style={{ color: '#00bcd4', fontWeight: 600, marginLeft: 8 }}>
            (under development)
        </span>
          
        </Typography>
      </Box>

      {/* Main Content Card */}
      <Box sx={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        borderRadius: 4,
        p: 6
      }}>
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            mb: 3,
            fontWeight: 'medium',
            textAlign: 'center'
          }}
        >
          Please enter a PUBLIC GitHub repository URL you would like to learn from.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            mb: 4,
            textAlign: 'center'
          }}
        >
          Once processed, our system will generate quizzes, summaries, and allow you to ask questions about the code.
        </Typography>

        {/* GitHub Repo URL Input */}
        <Box 
          sx={{ 
            mb: 4,
            p: 4, 
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 2,
            border: isValidRepo === false ? '2px solid #f44336' : '2px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <TextField
            fullWidth
            label="GitHub Repository URL"
            variant="outlined"
            placeholder="https://github.com/username/repository"
            value={repoUrl}
            onChange={handleRepoUrlChange}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: '#42a5f5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GitHubIcon sx={{ color: '#1976d2' }} />
                </InputAdornment>
              ),
            }}
            error={isValidRepo === false}
            helperText={isValidRepo === false ? "Please enter a valid GitHub repository URL" : ""}
          />
          
          <TextField
            fullWidth
            label="Branch Name"
            variant="outlined"
            placeholder="main"
            value={branchName}
            onChange={handleBranchChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: '#42a5f5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CodeIcon sx={{ color: '#1976d2' }} />
                </InputAdornment>
              ),
            }}
          />
          
          {isValidRepo === true && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', color: '#4CAF50' }}>
              <CheckCircleIcon sx={{ mr: 1 }} />
              <Typography variant="body2">Valid repository URL</Typography>
            </Box>
          )}
        </Box>

        {/* Process Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={handleProcessRepo}
            disabled={!repoUrl.trim() || isProcessing}
            variant="contained"
            size="large"
            startIcon={isProcessing ? <CircularProgress size={24} color="inherit" /> : <ProcessIcon />}
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
            {isProcessing ? 'Processing...' : 'Process Repository'}
          </Button>
        </Box>

        {/* Information Box */}
        <Box sx={{ mt: 4, p: 3, backgroundColor: 'rgba(25, 118, 210, 0.1)', borderRadius: 2, border: '1px solid rgba(25, 118, 210, 0.3)' }}>
          <Typography variant="subtitle1" sx={{ color: '#42a5f5', fontWeight: 'bold', mb: 1 }}>
            What happens next?
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Our system will analyze the GitHub repository code, extract key concepts, and create interactive learning materials. You'll receive an email notification once processing is complete.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RepoToLearning;
