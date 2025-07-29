import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

interface EditLabelDialogProps {
  open: boolean;
  onClose: () => void;
  currentLabel: string;
  onSave: (newLabel: string) => void;
  itemType: string; // e.g., "Snippet", "Quiz", "Slide Deck", etc.
}

export const EditLabelDialog: React.FC<EditLabelDialogProps> = ({
  open,
  onClose,
  currentLabel,
  onSave,
  itemType
}) => {
  const [label, setLabel] = useState(currentLabel);

  useEffect(() => {
    setLabel(currentLabel);
  }, [currentLabel]);

  const handleSave = () => {
    if (label.trim()) {
      onSave(label.trim());
      onClose();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(30, 30, 30, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <EditIcon sx={{ color: '#42a5f5' }} />
        Edit {itemType} Label
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            mb: 2 
          }}
        >
          Enter a new descriptive label for this {itemType.toLowerCase()}:
        </Typography>
        
        <TextField
          autoFocus
          fullWidth
          variant="outlined"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Enter ${itemType.toLowerCase()} label...`}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)'
              },
              '&:hover fieldset': {
                borderColor: '#42a5f5'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976D2'
              }
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }}
        />
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 3, 
        pt: 1,
        gap: 1
      }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.4)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          variant="contained"
          disabled={!label.trim()}
          sx={{
            backgroundColor: '#1976D2',
            '&:hover': {
              backgroundColor: '#1565C0'
            },
            '&:disabled': {
              backgroundColor: 'rgba(25, 118, 210, 0.3)'
            }
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditLabelDialog;
