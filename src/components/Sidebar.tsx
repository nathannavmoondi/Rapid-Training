import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import FunctionsIcon from '@mui/icons-material/Functions';
import CampaignIcon from '@mui/icons-material/Campaign';
import GitHubIcon from '@mui/icons-material/GitHub';
import SettingsIcon from '@mui/icons-material/Settings';
import QuizIcon from '@mui/icons-material/Quiz';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import StarIcon from '@mui/icons-material/Star';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { label: 'Topics', path: '/topics', icon: <SchoolIcon />, external: false },
  { label: 'Algorithms', path: '/algorithms', icon: <FunctionsIcon />, external: false },
  { label: 'Marketing AI', path: '/marketing-ai', icon: <CampaignIcon />, external: false },
  { label: 'My Quizzes', path: '/my-quizzes', icon: <QuizIcon />, external: false },
  { label: 'My Slidedecks', path: '/my-slidedecks', icon: <WysiwygIcon />, external: false },
  { label: 'My Training', path: '/my-training', icon: <WorkspacesIcon />, external: false },
  { label: 'Custom Quizzes', path: '/custom-quizzes', icon: <StarIcon />, external: false },
  { label: 'YT Generator', path: '/yt-generator', icon: <YouTubeIcon />, external: false },
  { label: 'Explore', path: '/explore', icon: <SettingsIcon />, external: false },
  { label: 'Github', path: 'https://github.com/nathannavmoondi', icon: <GitHubIcon />, external: true }
];

const SIDEBAR_MIN_WIDTH = 60;
const SIDEBAR_MAX_WIDTH = 235;
const TEXT_VISIBILITY_THRESHOLD = 130; // Width below which text will be hidden
const WIDTH_BREAKPOINT = 1100;

export const Sidebar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [width, setWidth] = useState(window.innerWidth < WIDTH_BREAKPOINT ? SIDEBAR_MIN_WIDTH : SIDEBAR_MAX_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [shouldShowHamburger, setShouldShowHamburger] = useState(window.innerWidth < WIDTH_BREAKPOINT);
  const showText = width >= TEXT_VISIBILITY_THRESHOLD;

  useEffect(() => {
    const handleResize = () => {
      const shouldCollapse = window.innerWidth < WIDTH_BREAKPOINT;
      setShouldShowHamburger(shouldCollapse);
      setWidth(shouldCollapse ? SIDEBAR_MIN_WIDTH : SIDEBAR_MAX_WIDTH);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = Math.max(
      SIDEBAR_MIN_WIDTH,
      Math.min(SIDEBAR_MAX_WIDTH, e.clientX)
    );
    setWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    // Snap to min width if close to it
    if (width < TEXT_VISIBILITY_THRESHOLD) {
      setWidth(SIDEBAR_MIN_WIDTH);
    }
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <Box
      sx={{
        width: width,
        minWidth: SIDEBAR_MIN_WIDTH,
        maxWidth: SIDEBAR_MAX_WIDTH,
        height: 'calc(100vh - 40px)',
        bgcolor: '#005487',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        transition: isResizing ? 'none' : 'all 0.2s',
        position: 'fixed',
        top: 40,
        left: 0,
        zIndex: 1200,
        borderRight: '3px solid rgba(255, 255, 255, 0.05)',
        boxShadow: `
          inset -2px 0 3px rgba(255, 255, 255, 0.15),
          inset -3px 0 4px rgba(0, 0, 0, 0.3),
          2px 0 5px rgba(0, 0, 0, 0.2)
        `,
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: -1,
          width: '3px',
          height: '100%',
          background: 'linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.15) 100%)',
          pointerEvents: 'none',
          boxShadow: '1px 0 2px rgba(0,0,0,0.3)'
        }
      }}
    >
      {shouldShowHamburger && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 1 }}>
          <IconButton 
            size="small" 
            sx={{ color: '#e3f2fd' }}
            onClick={() => setWidth(width <= SIDEBAR_MIN_WIDTH ? SIDEBAR_MAX_WIDTH : SIDEBAR_MIN_WIDTH)}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 0.5, 
        py: shouldShowHamburger ? 1 : 2,
        mt: shouldShowHamburger ? 0 : 1
      }}>
        {menuItems.map((item) => (
          <Tooltip title={!showText ? item.label : ''} placement="right" key={item.label}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1.2,
                cursor: 'pointer',
                gap: 2,
                '&:hover': {
                  bgcolor: '#1976d2',
                },
                transition: 'background 0.2s',
                borderRadius: '4px',
                mx: 0.5,
                justifyContent: showText ? 'flex-start' : 'center'
              }}
              onClick={() => {
                if (item.external) {
                  window.open(item.path, '_blank');
                } else {
                  navigate(item.path);
                }
              }}
            >
              {item.icon}
              {showText && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#e3f2fd', 
                    fontWeight: 500,
                    opacity: Math.min((width - TEXT_VISIBILITY_THRESHOLD) / 30, 1),
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item.label}
                </Typography>
              )}
            </Box>
          </Tooltip>
        ))}
      </Box>

      {/* Settings at bottom */}
      <Box sx={{ 
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        py: 1,
        mt: 'auto'
      }}>
        <Tooltip title={!showText ? "Settings" : ""} placement="right">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 1.2,
              cursor: 'pointer',
              gap: 2,
              '&:hover': {
                bgcolor: '#1976d2',
              },
              transition: 'background 0.2s',
              borderRadius: '4px',
              mx: 0.5,
              justifyContent: showText ? 'flex-start' : 'center'
            }}
          >
            <SettingsIcon sx={{ color: '#e3f2fd' }} />
            {showText && (
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#e3f2fd', 
                  fontWeight: 500,
                  opacity: Math.min((width - TEXT_VISIBILITY_THRESHOLD) / 30, 1),
                  whiteSpace: 'nowrap'
                }}
              >
                Settings
              </Typography>
            )}
          </Box>
        </Tooltip>
      </Box>

      {/* Resizer */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: -3,
          width: 6,
          height: '100%',
          cursor: 'ew-resize',
          zIndex: 1300,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
        onMouseDown={handleMouseDown}
      />
    </Box>
  );
};
