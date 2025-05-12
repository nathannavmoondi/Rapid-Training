import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/algorithms' && location.pathname === '/') return true;
    return location.pathname === path;
  };

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
          Skills Refresher Demo - Nathan Nav Moondi
        </Typography>        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          marginLeft: 'auto'
        }}>          <Button 
            size="small" 
            color="inherit" 
            onClick={() => navigate('/skills')}
            sx={{
              backgroundColor: isActive('/skills') ? 'rgba(144, 202, 249, 0.2)' : 'transparent',
              '&:hover': {
                backgroundColor: isActive('/skills') ? 'rgba(144, 202, 249, 0.3)' : 'rgba(255, 255, 255, 0.08)'
              }
            }}
          >
            Skills Refresher
          </Button>
          <Button 
            size="small" 
            color="inherit" 
            onClick={() => navigate('/algorithms')}
            sx={{
              backgroundColor: isActive('/algorithms') ? 'rgba(144, 202, 249, 0.2)' : 'transparent',
              '&:hover': {
                backgroundColor: isActive('/algorithms') ? 'rgba(144, 202, 249, 0.3)' : 'rgba(255, 255, 255, 0.08)'
              }
            }}
          >
            Algorithms
          </Button>
          <Button 
            size="small" 
            color="inherit" 
            onClick={() => navigate('/details')}
            sx={{
              backgroundColor: isActive('/details') ? 'rgba(144, 202, 249, 0.2)' : 'transparent',
              '&:hover': {
                backgroundColor: isActive('/details') ? 'rgba(144, 202, 249, 0.3)' : 'rgba(255, 255, 255, 0.08)'
              }
            }}
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