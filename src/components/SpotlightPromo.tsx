import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const SpotlightPromo = () => {
  return (
    <Paper 
      elevation={6} 
      sx={{ 
        p: 4, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        my: 4
      }}
    >
      {/* Spotlight beam effect */}
      <Box 
        sx={{ 
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
          top: '-100px',
          right: '-50px',
          borderRadius: '50%',
          opacity: 0.8,
          filter: 'blur(8px)',
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SearchIcon sx={{ fontSize: 40, mr: 2, color: '#ffeb3b' }} />
          <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: 1 }}>
            Spotlight
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 2, fontWeight: 500 }}>
          The Evolution of Finders Keepers for the Modern Web
        </Typography>

        <Typography variant="body1" sx={{ my: 3, opacity: 0.9, maxWidth: '90%' }}>
          Discover a revolutionary way to capture, organize, and utilize valuable online information. 
          Spotlight doesn't just save your discoveries—it illuminates them, bringing your most important 
          findings to the forefront exactly when you need them.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, my: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <BookmarkAddIcon sx={{ fontSize: 36, color: '#ffeb3b', mb: 1 }} />
            <Typography variant="body2">Smart Bookmarking</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <LightbulbIcon sx={{ fontSize: 36, color: '#ffeb3b', mb: 1 }} />
            <Typography variant="body2">Contextual Insights</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <SearchIcon sx={{ fontSize: 36, color: '#ffeb3b', mb: 1 }} />
            <Typography variant="body2">Intelligent Search</Typography>
          </Box>
        </Box>

        <Button 
          variant="contained" 
          color="warning" 
          size="large"
          sx={{ 
            mt: 2, 
            px: 4, 
            py: 1.2,
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
            backgroundColor: '#ffeb3b',
            color: '#283593',
            '&:hover': {
              backgroundColor: '#fff176',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.2)'
            },
            transition: 'all 0.3s ease',
          }}
        >
          Try Spotlight Now
        </Button>
      </Box>
    </Paper>
  );
};

export default SpotlightPromo;
