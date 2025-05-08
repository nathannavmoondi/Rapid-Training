import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import { theme } from './styles/theme';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AlgorithmList } from './pages/AlgorithmList';
import { AlgorithmDetail } from './pages/AlgorithmDetail';
import { Details } from './pages/Details';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100vh',
        }}>
          <Navbar />
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/algorithms" replace />} />
              <Route path="/algorithms" element={<AlgorithmList />} />
              <Route path="/algorithm/:id" element={<AlgorithmDetail />} />
              <Route path="/details" element={<Details />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
