import { Box, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#153d69',
        color: 'white',
        padding: 3,
        marginTop: 'auto',
        width: '100%',
        borderTop: '2px solid rgba(255, 255, 255, 0.2)',
        borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <Typography variant="body2" align="center">
        © {new Date().getFullYear()} Rapid Training AI - Nathan Nav Moondi and Happy Dappy Technologies. All rights reserved.
      </Typography>
    </Box>
  );
};