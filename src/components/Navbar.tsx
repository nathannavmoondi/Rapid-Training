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
  useMediaQuery,
  Tooltip,
  Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useChat } from '../contexts/chatContext';

interface NavbarProps {
  onChatToggle: () => void;
  isChatOpen: boolean;
}

export const Navbar = ({ onChatToggle, isChatOpen }: NavbarProps) => {

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { setChatboxSkill } = useChat();
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
    if (path === '/topics' && (location.pathname === '/topics' || location.pathname.startsWith('/topics/'))) {
      return true;
    }
    // For algorithm pages
    if (path === '/algorithms' && (location.pathname === '/algorithms' || location.pathname.startsWith('/algorithm/'))) {
      return true;
    }
    // For other pages
    return location.pathname === path;
  };

  const isSkillDetailPage = () => {
    return location.pathname === '/topics/detail';
  };  // Set skill name when arriving at a skill detail page

  useEffect(() => {
    if (isSkillDetailPage()) {
      const params = new URLSearchParams(location.search);
      const skill = params.get('skill');
      if (skill) {
        const decodedSkill = decodeURIComponent(skill);
        setChatboxSkill(decodedSkill); //chatcontext
      }
    }
  }, [location.search, setChatboxSkill]);

  const getCurrentSkill = () => {
    if (isSkillDetailPage()) {
      const params = new URLSearchParams(location.search);
      const skill = params.get('skill');
      return skill ? decodeURIComponent(skill) : '';
    }
    return '';
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
    { label: 'Rapid Training AI', path: '/topics',  external: false   },
    { label: 'Algorithms', path: '/algorithms',  external: false   },
    { label: 'Marketing AI', path: '/marketing-ai',  external: false   },
    { label: 'Food Saver', path: '/food-saver',   external: false   },
    { label: 'Github', path: 'https://github.com/nathannavmoondi', external: true }
  ]; 
  
  return (
    <AppBar position="fixed" sx={{ 
      borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
      zIndex: 1300,
      height: 40
    }}>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        minHeight: '40px !important',
        height: 40,
        py: 0,
        px: { xs: 1, sm: 2 } 
      }}>
        {/* Logo and title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => navigate('/')}>
          <img 
            src="/favicon.ico" 
            alt="Logo" 
            style={{ 
              width: '24px', 
              height: '24px',
              marginRight: '8px',
              verticalAlign: 'middle'
            }} 
          />
          <Typography 
            variant="subtitle2"
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
              fontSize: '0.875rem'
            }}
          >
            Rapid Training - AI Based Learning (Nathan Moondi DEMO)
          </Typography>
        </Box>

        {/* Navigation and Chat */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile ? (
            <>
              <IconButton
                size="small"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    onClick={() => {
                      if (item.external) {
                        window.open(item.path, '_blank');
                      } else {
                        handleNavigation(item.path);
                      }
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() => {
                    if (item.external) {
                      window.open(item.path, '_blank');
                    } else {
                      navigate(item.path);
                    }
                  }}
                  sx={getButtonSx(item.path)}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {isSkillDetailPage() && (
            <Tooltip title={`AI Assistant (${getCurrentSkill()})`}>
              <IconButton
                onClick={onChatToggle}
                sx={{ 
                  color: isChatOpen ? '#90CAF9' : 'white',
                  '&:hover': { color: '#90CAF9' }
                }}
              >
                <ChatIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};