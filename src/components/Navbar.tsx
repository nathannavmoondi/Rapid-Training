import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ 
      borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
    }}>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        minHeight: '48px !important',
        py: 0.5
      }}>        <Typography 
          variant="subtitle1" 
          component="div" 
          onClick={() => navigate('/')} 
          sx={{ 
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontWeight: 500,
            cursor: 'pointer',
            '&:hover': {
              color: 'rgba(255, 255, 255, 0.8)'
            },
            transition: 'color 0.2s ease'
          }}
        >
          Algo Demo - Nathan Nav Moondi
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          marginLeft: 'auto'
        }}>
          <Button 
            size="small" 
            color="inherit" 
            onClick={() => navigate('/algorithms')}
          >
            Algorithms
          </Button>
          <Button 
            size="small" 
            color="inherit" 
            onClick={() => navigate('/details')}
          >
            Details
          </Button>
          <Button 
            size="small"
            color="inherit" 
            href="https://github.com/nathannavmoondi" 
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};