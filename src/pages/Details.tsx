/**
 * Details Component
 * 
 * The about page of the application that provides information about:
 * - Project overview and purpose
 * - Tech stack used
 * - Developer information
 * - Social links
 * 
 * Features:
 * - Responsive layout with Material-UI components
 * - Gradient text effects
 * - Image showcase with shadow effects
 * - Social media links section
 * - Animated avatar icon
 */
import { Container, Typography, Paper, Box, Avatar } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import algoImage from '../assets/algo.JPG';
import React from 'react';

export const Details = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
            <CodeIcon sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Welcome to Skills Refresher 
          </Typography>

          <Box sx={{ 
            width: '100%', 
            maxWidth: '600px',
            height: 'auto',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3
          }}>
            <img 
              src={algoImage} 
              alt="Algorithm Visualization" 
              style={{ 
                width: '100%',
                height: 'auto',
                display: 'block'
              }} 
            />
          </Box>

          <Typography variant="body1" paragraph align="center" sx={{ fontSize: '1.1rem' }}>
            This page is to help you refresh your skills as well as various algorithms I wrote by hand as part of interview tests or for my own usage.
            <br />
            Hope you enjoy this site as it's mainly to show off my design and development skills.
          </Typography>

          <Typography variant="body1" paragraph align="center" sx={{ fontSize: '1.1rem' }}>
            I have many others but wanted to keep the most common.
          </Typography>

          <Box sx={{ 
            width: '100%',
            bgcolor: '#153d69', // Changed from primary.main to dark blue
            p: 3,
            mb: 3,
            borderRadius: 2
          }}>
            <Typography variant="h6" gutterBottom align="center" sx={{ color: 'white' }}>
              Tech Stack
            </Typography>
            <Typography variant="body1" align="center" sx={{ color: 'white' }}>
              This site was built using React, TypeScript, Material UI, React Syntax and used Vercel for hosting.
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mt: 2, fontSize: '1.1rem' }}>
            Any questions, please feel free to ask!
          </Typography>

          <Box sx={{ 
            mt: 2, 
            display: 'flex', 
            gap: 2,
            borderTop: '3px solid',  // Thicker divider
            borderColor: 'divider',
            pt: 3,
            width: '100%',
            justifyContent: 'center'
          }}>
            <a href="https://github.com/nathannavmoondi" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
              <GitHubIcon sx={{ fontSize: 30, color: 'text.secondary' }} />
            </a>
            <a href="https://www.linkedin.com/in/nathan-nav-moondi" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
              <LinkedInIcon sx={{ fontSize: 30, color: '#0077b5' }} />
            </a>
          </Box>

          <Typography variant="h6" sx={{ 
            mt: 2,
            fontStyle: 'italic',
            color: 'text.secondary'
          }}>
            Nathan Nav Moondi
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};