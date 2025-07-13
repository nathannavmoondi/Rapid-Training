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
import { googleLoginWithBackend } from '../services/authService';
import { loginWithEmail } from '../services/emailAuthService';
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


  // Google Identity Services script loader and button renderer
  React.useEffect(() => {
    // Load Google script if not present
    if (!document.getElementById('google-identity')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.id = 'google-identity';
      document.body.appendChild(script);
    }
    // Wait for script to load, then initialize and render button
    const waitForGoogle = () => new Promise<void>((resolve, reject) => {
      let tries = 0;
      function check() {
        // @ts-ignore
        if (window.google && window.google.accounts && window.google.accounts.id) resolve();
        else if (++tries > 20) reject(new Error('Google login is not available.'));
        else setTimeout(check, 200);
      }
      check();
    });
    waitForGoogle().then(() => {
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: '650762672752-ph37g0p2p8bro1saihr4chc4f9cb1bie.apps.googleusercontent.com',
        callback: async (response: any) => {
          if (response.credential) {
            const result = await googleLoginWithBackend(response.credential);
            if (result.success) {
              onClose();
            } else {
              setError(result.error || 'Login failed.');
            }
          } else {
            setError('Google login failed.');
          }
        },
      });
      // Render Google button
      if (document.getElementById('google-signin-btn')) {
        // @ts-ignore
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { theme: 'outline', size: 'large', width: '100%' }
        );
      }
    }).catch((e) => {
      setError(e.message || 'Google login is not available.');
    });
    // Clean up button on close
    return () => {
      const btn = document.getElementById('google-signin-btn');
      if (btn) btn.innerHTML = '';
    };
  }, [open]);

  const handleEmailLogin = async (e: React.FormEvent) => {
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
    // Call backend for login
    setError('');
    const result = await loginWithEmail(email, password);
    console.log('Login result:', result);
    if (result.success && result.token) {
      onClose();
    } else {
      setError(result.error || 'Login failed.');
    }
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
            <div id="google-signin-btn" style={{ width: '100%' }} />
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <Typography variant="body2" align="center" sx={{ color: 'white' }}>
              Google login is under development.
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
