import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon, Code as CodeIcon, School as SchoolIcon } from '@mui/icons-material';

interface CoderTestDialogProps {
  open: boolean;
  onClose: () => void;
  onBegin: (language: string, level: string) => void;
}

export const CoderTestDialog: React.FC<CoderTestDialogProps> = ({
  open,
  onClose,
  onBegin
}) => {
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBegin = async () => {
    if (!language || !level) return;
    
    setLoading(true);
    try {
      await onBegin(language, level);
      setLanguage(''); // Clear the selections
      setLevel('');
      onClose(); // Close the dialog
    } catch (error) {
      console.error('Failed to start coder test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLanguage(''); // Clear the selections when closing
    setLevel('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(156, 39, 176, 0.95)',
          border: '1px solid rgba(186, 104, 200, 0.3)',
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
          <CodeIcon />
          Coder Test
        </Box>
        <Button
          onClick={handleClose}
          sx={{ 
            color: 'white',
            minWidth: 'auto',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 4, backgroundColor: 'rgba(30, 30, 30, 0.9)', textAlign: 'center' }}>
        {/* Coding Icons */}
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CodeIcon sx={{ fontSize: 60, color: '#ba68c8', mb: 1 }} />
          <SchoolIcon sx={{ fontSize: 40, color: '#ffb74d' }} />
        </Box>

        <Typography
          variant="h6"
          sx={{
            color: 'white',
            mb: 4,
            fontWeight: 'medium',
            lineHeight: 1.4
          }}
        >
          Please choose a programming language
        </Typography>

        {/* Language Dropdown */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': { color: '#ba68c8' }
            }}
          >
            Programming Language
          </InputLabel>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={loading}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return <em style={{ color: '#999' }}>Please select</em>;
              }
              // Display the actual language name
              const languageNames: { [key: string]: string } = {
                'csharp': 'C#',
                'javascript': 'JavaScript',
                'cpp': 'C++',
                'python': 'Python',
                'java': 'Java'
              };
              return languageNames[selected as string] || selected;
            }}
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              '& .MuiSelect-select': {
                color: 'black',
                padding: '16px 14px'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ba68c8'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#9C27B0'
              }
            }}
          >
            <MenuItem value="csharp">C#</MenuItem>
            <MenuItem value="javascript">JavaScript</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="java">Java</MenuItem>
          </Select>
        </FormControl>

        <Typography
          variant="h6"
          sx={{
            color: 'white',
            mb: 3,
            fontWeight: 'medium',
            lineHeight: 1.4
          }}
        >
          Please select skill level
        </Typography>

        {/* Level Dropdown */}
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': { color: '#ba68c8' }
            }}
          >
            Difficulty Level
          </InputLabel>
          <Select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            disabled={loading}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return <em style={{ color: '#999' }}>Please select</em>;
              }
              // Display the actual level name with proper capitalization
              const levelNames: { [key: string]: string } = {
                'basic': 'Basic',
                'intermediate': 'Intermediate'
              };
              return levelNames[selected as string] || selected;
            }}
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              '& .MuiSelect-select': {
                color: 'black',
                padding: '16px 14px'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ba68c8'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#9C27B0'
              }
            }}
          >
            <MenuItem value="basic">Basic</MenuItem>
            <MenuItem value="intermediate">Intermediate</MenuItem>
          </Select>
        </FormControl>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            mb: 3,
            fontSize: '1rem',
            lineHeight: 1.6,
            fontStyle: 'italic'
          }}
        >
          You will see a "LeetCode" style question. You can copy paste it into your editor or simply click "Show Answer" to view detailed answer on how to solve it.
          <br /><br />
          You can continue to view more questions.
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CircularProgress sx={{ color: '#ba68c8' }} />
          </Box>
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
          onClick={handleClose}
          variant="contained"
          disabled={loading}
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
          onClick={handleBegin}
          disabled={!language || !level || loading}
          variant="contained"
          sx={{
            backgroundColor: '#9C27B0',
            color: 'white',
            fontWeight: 'bold',
            px: 4,
            py: 1,
            fontSize: '1rem',
            '&:hover': { backgroundColor: '#7B1FA2' },
            '&:disabled': {
              backgroundColor: 'rgba(156, 39, 176, 0.3)',
              color: 'rgba(255, 255, 255, 0.5)'
            }
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} sx={{ color: 'white' }} />
              Starting...
            </Box>
          ) : (
            'Begin'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
