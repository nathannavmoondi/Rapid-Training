import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: '#000000',
    },
    background: {
      default: '#1E1E1E',
      paper: 'rgba(45, 45, 45, 0.95)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#153d69',
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(21, 61, 105, 0.95)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          /* HOVER EFFECT FOR CARDS - COMMENTED OUT
             Uncomment the code below to add hover effects to all MUI Cards
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            backgroundColor: 'rgba(21, 61, 105, 0.98)',
          },
          */
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(21, 61, 105, 0.95)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#90caf9', // Light blue, same as primary.main
          '&:hover': {
            color: '#e3f2fd', // Lighter blue on hover, same as primary.light
          },
        },
      },
    },
  },
});