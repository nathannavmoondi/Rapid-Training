import { Box, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#153d69',
        color: 'white',
        py: 1, // Reduced vertical padding
        px: 2, // Reduced horizontal padding
        marginTop: 'auto',
        width: '100%',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)', // Thinner border
        minHeight: '32px', // Set explicit height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography 
        variant="caption" 
        align="center"
        sx={{ 
          fontSize: '0.75rem',
          opacity: 0.9
        }}
      >
        © {new Date().getFullYear()} Rapid Mind AI - Nathan Nav Moondi and Happy Dappy Technologies. All rights reserved.
      </Typography>
    </Box>
  );
};