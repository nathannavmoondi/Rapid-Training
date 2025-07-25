import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon, MenuBook as MenuBookIcon, School as SchoolIcon } from '@mui/icons-material';

interface IWantToLearnDialogProps {
  open: boolean;
  onClose: () => void;
  onLearnMore: (topic: string) => void;
}

export const IWantToLearnDialog: React.FC<IWantToLearnDialogProps> = ({
  open,
  onClose,
  onLearnMore
}) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLearnMore = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    try {
      await onLearnMore(topic.trim());
      setTopic(''); // Clear the input
      onClose(); // Close the dialog
    } catch (error) {
      console.error('Failed to start learning:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTopic(''); // Clear the input when closing
    onClose();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && topic.trim() && !loading) {
      handleLearnMore();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(25, 118, 210, 0.95)',
          border: '1px solid rgba(33, 150, 243, 0.3)',
          borderRadius: 2,
          minHeight: '400px'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 'bold',
          fontSize: '1.5rem'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MenuBookIcon />
          I Want to Learn
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
          (e.g: dog walking, hvac basics, .net logging)
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
          onClick={handleLearnMore}
          disabled={!topic.trim() || loading}
          variant="contained"
          sx={{
            backgroundColor: '#1976D2',
            color: 'white',
            fontWeight: 'bold',
            px: 4,
            py: 1,
            fontSize: '1rem',
            '&:hover': { backgroundColor: '#1565C0' },
            '&:disabled': {
              backgroundColor: 'rgba(25, 118, 210, 0.3)',
              color: 'rgba(255, 255, 255, 0.5)'
            }
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} sx={{ color: 'white' }} />
              Learning...
            </Box>
          ) : (
            'Learn More'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
