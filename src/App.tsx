import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline, Container } from '@mui/material'; // Added Container
import { theme } from './styles/theme';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AlgorithmList } from './pages/AlgorithmList';
import { AlgorithmDetail } from './pages/AlgorithmDetail';
import { Details } from './pages/Details';
import { SkillsRefresher } from './pages/SkillsRefresher';
import { SkillsRefresherDetail } from './pages/SkillsRefresherDetail';
import { QuizResults } from './pages/QuizResults'; // Import QuizResults
import { QuizProvider } from './contexts/quizContext'; // Import QuizProvider
import { PromptDB } from './pages/PromptDB';
import { MarketingAI } from './pages/MarketingAI';
import { FoodSaver } from './pages/FoodSaver';
import './App.css';
import './styles/prism-custom.css';  // Add this line

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <QuizProvider> {/* Wrap routes with QuizProvider */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh',
          }}>
            <Navbar />
            <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
              <Routes>
                <Route path="/" element={<Navigate to="/skills" replace />} />
                <Route path="/algorithms" element={<AlgorithmList />} />
                <Route path="/algorithm/:id" element={<AlgorithmDetail />} />
                <Route path="/details" element={<Details />} />                <Route path="/skills" element={<SkillsRefresher />} />
                <Route path="/skills/detail" element={<SkillsRefresherDetail />} />                <Route path="/quiz-results" element={<QuizResults />} />
                <Route path="/prompt-db" element={<PromptDB />} />                <Route path="/marketing-ai" element={<MarketingAI />} />
                <Route path="/food-saver" element={<FoodSaver />} />
              </Routes>
            </Container>
            <Footer />
          </Box>
        </QuizProvider> {/* Close QuizProvider */}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
