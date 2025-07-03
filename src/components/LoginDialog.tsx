import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  IconButton
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import CloseIcon from '@mui/icons-material/Close';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose }) => {
  const [method, setMethod] = useState<'google' | 'email'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleMethod = (_: any, newMethod: 'google' | 'email') => {
    if (newMethod) setMethod(newMethod);
    setError('');
  };

  const handleGoogleLogin = () => {
    // Placeholder: In real app, use Google SDK or Firebase
    alert('Google login not implemented.');
    onClose();
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password.match(/^(?=.*\d).{8,}$/)) {
      setError('Password must be at least 8 characters and contain a number.');
      return;
    }
    // Placeholder: In real app, send to backend
    alert('Email login/signup not implemented.');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Login or Signup
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <ToggleButtonGroup
            value={method}
            exclusive
            onChange={handleMethod}
            size="small"
          >
            <ToggleButton value="google">Google</ToggleButton>
            <ToggleButton value="email">Email</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {method === 'google' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{ bgcolor: '#4285F4', color: 'white', '&:hover': { bgcolor: '#357ae8' }, width: '100%' }}
            >
              Continue with Google
            </Button>
            <Typography variant="body2" color="text.secondary" align="center">
              We do not store your data. Google login is for demo only.
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleEmailLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              fullWidth
              helperText="At least 8 characters and a number."
            />
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Sign Up / Login
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
