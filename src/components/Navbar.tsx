import { AppBar, Toolbar, Button, Typography, Box, SxProps, Theme } from '@mui/material'; // Added SxProps and Theme
import { useNavigate, useLocation } from 'react-router-dom';

// Removed favicon import, will use direct path

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => {
    // For skills pages
    if (path === '/skills' && (location.pathname === '/skills' || location.pathname.startsWith('/skills/'))) {
      return true;
    }
    // For algorithm pages
    if (path === '/algorithms' && (location.pathname === '/algorithms' || location.pathname.startsWith('/algorithm/'))) {
      return true;
    }
    // For other pages
    return location.pathname === path;
  };

  // Helper function to generate sx props for buttons to avoid repetition and type issues
  const getButtonSx = (path: string): SxProps<Theme> => ({
    backgroundColor: isActive(path) ? 'rgba(144, 202, 249, 0.2)' : 'transparent',
    borderBottom: isActive(path) ? '2px solid #90CAF9' : 'none',
    fontWeight: isActive(path) ? 600 : 400,
    '&:hover': {
      backgroundColor: isActive(path) ? 'rgba(144, 202, 249, 0.3)' : 'rgba(255, 255, 255, 0.08)'
    }
  });

  return (
    <AppBar position="static" sx={{ 
      borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
    }}>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        minHeight: '48px !important',
        py: 0.5,
        px: { xs: 1, sm: 2 } 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src="/favicon.ico" alt="Favicon" style={{ marginRight: '8px', height: '24px', width: '24px' }} />
          <Typography 
            variant="subtitle1" 
            component="div" 
            sx={{ 
              fontWeight: 500,
              whiteSpace: 'nowrap', 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: { xs: '150px', sm: '300px', md: 'none' },
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.8)'
              },
              transition: 'color 0.2s ease',
            }}
          >
            Rapid Training AI - Nathan Nav Moondi
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 0.5, sm: 1, md: 2 }, 
          flexShrink: 0 
        }}>
          <Button 
            size="small" 
            color="inherit" 
            onClick={() => navigate('/skills')}
            sx={getButtonSx('/skills')}
          >
            Rapid Training 
          </Button>
          <Button 
            size="small" 
            color="inherit" 
            onClick={() => navigate('/algorithms')}
            sx={getButtonSx('/algorithms')}
          >
            Algorithms
          </Button>         
           <Button 
            size="small" 
            color="inherit" 
            onClick={() => navigate('/prompt-db')}
            sx={getButtonSx('/prompt-db')}
          >
            Prompt DB
          </Button>
          <Button 
            size="small" 
            color="inherit" 
            onClick={() => navigate('/marketing-ai')}
            sx={getButtonSx('/marketing-ai')}
          >
            Marketing AI
          </Button>
           <Button 
            size="small" 
            color="inherit" 
            onClick={() => navigate('/details')}
            sx={getButtonSx('/details')}
          >
            Details
          </Button>
         
          <Button 
            size="small"
            color="inherit" 
            href="https://github.com/nathannavmoondi" 
            target="_blank"
            rel="noopener noreferrer"
            // sx prop for external link button can be simpler or use getButtonSx if active state is desired
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)'
              }
            }}
          >
            GitHub
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};