import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Box, 
  SxProps, 
  Theme,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleClose();
  };

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

  const menuItems = [
    { label: 'Rapid Training', path: '/skills' },
    { label: 'Algorithms', path: '/algorithms' },
    { label: 'Prompt DB', path: '/prompt-db' },
    { label: 'Marketing AI', path: '/marketing-ai' },
    { label: 'Food Saver', path: '/food-saver' },
    { label: 'Details', path: '/details' },
    { label: 'GitHub', path: 'https://github.com/nathannavmoondi', external: true }
  ];

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
            Rapid Training AI
          </Typography>
        </Box>

        {isMobile ? (
          <Box>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  mt: 4.5,
                  background: 'rgba(35, 35, 35, 0.95)',
                  border: '1px solid rgba(144, 202, 249, 0.15)',
                  borderRadius: 2,
                }
              }}
            >
              {menuItems.map((item) => (
                <MenuItem 
                  key={item.label}
                  onClick={() => item.external ? window.open(item.path, '_blank') : handleNavigation(item.path)}
                  sx={{
                    color: 'white',
                    minWidth: '200px',
                    ...(isActive(item.path) && !item.external && {
                      backgroundColor: 'rgba(144, 202, 249, 0.2) !important'
                    })
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0.5, sm: 1, md: 2 }, 
            flexShrink: 0 
          }}>
            {menuItems.map((item) => (
  item.external ? (
    <Button
      key={item.label}
      size="small"
      color="inherit"
      component="a"
      href={item.path}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' } }}
    >
      {item.label}
    </Button>
  ) : (
    <Button
      key={item.label}
      size="small"
      color="inherit"
      onClick={() => navigate(item.path)}
      sx={getButtonSx(item.path)}
    >
      {item.label}
    </Button>
  )
))}

          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};