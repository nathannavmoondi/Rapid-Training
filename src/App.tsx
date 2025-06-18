import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline, Container } from '@mui/material';
import { theme } from './styles/theme';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Chat } from './components/Chat';
import { AlgorithmList } from './pages/AlgorithmList';
import { AlgorithmDetail } from './pages/AlgorithmDetail';
import { Details } from './pages/Details';
import { SkillsRefresher } from './pages/SkillsRefresher';
import { SkillsRefresherDetail } from './pages/SkillsRefresherDetail';
import { QuizResults } from './pages/QuizResults';
import { QuizProvider } from './contexts/quizContext';
import { ChatProvider } from './contexts/chatContext';
import { PromptDB } from './pages/PromptDB';
import { MarketingAI } from './pages/MarketingAI';
import { FoodSaver } from './pages/FoodSaver';
import { Sidebar } from './components/Sidebar';
import './App.css';


function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QuizProvider>
        <ChatProvider>
          <BrowserRouter>
            <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
              <Navbar 
                onChatToggle={handleChatToggle} 
                isChatOpen={isChatOpen}
              />
              <Sidebar />
              <Box 
                sx={{ 
                  flex: 1,
                  marginLeft: '60px',
                  marginTop: '40px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Container>
                  <Routes>
                    <Route path="/" element={<Navigate to="/skills" replace />} />
                    <Route path="/skills" element={<SkillsRefresher />} />
                    <Route path="/skills/:id" element={<SkillsRefresherDetail />} />
                    <Route path="/algorithms" element={<AlgorithmList />} />
                    <Route path="/algorithm/:id" element={<AlgorithmDetail />} />
                    <Route path="/item/:id" element={<Details />} />
                    <Route path="/quiz-results" element={<QuizResults />} />
                    <Route path="/promptdb" element={<PromptDB />} />
                    <Route path="/marketing-ai" element={<MarketingAI />} />
                    <Route path="/food-saver" element={<FoodSaver />} />
                  </Routes>
                </Container>
              </Box>
              <Chat isOpen={isChatOpen} onClose={handleChatToggle} />
            </Box>
          </BrowserRouter>
        </ChatProvider>
      </QuizProvider>
    </ThemeProvider>
  );
}

export default App;
