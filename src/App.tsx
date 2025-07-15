import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toastify-dark.css';
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
import { ChatProvider, UserProvider } from './contexts/chatContext';
import { PromptDB } from './pages/PromptDB';
import { MarketingAI } from './pages/MarketingAI';
import { YouTubeQuizGenerator } from './pages/YouTubeQuizGenerator';
import { Sidebar } from './components/Sidebar';
import './styles/mobile.css';
import './App.css';
import FailedQuestionsPrimer from './pages/FailedQuestionsPrimer';
import Test2 from './pages/Test2';
import { IWantToLearn } from './pages/IWantToLearn';


function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <ThemeProvider theme={theme}>
     <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="custom-toast-dark"
      />
      <CssBaseline />
      <QuizProvider>
        <ChatProvider>
          <UserProvider>
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
                    <Routes>                    <Route path="/" element={<Navigate to="/topics" replace />} />
                      <Route path="/topics" element={<SkillsRefresher />} />
                      <Route path="/topics/:id" element={<SkillsRefresherDetail />} />
                      <Route path="/algorithms" element={<AlgorithmList />} />
                      <Route path="/algorithm/:id" element={<AlgorithmDetail />} />
                      <Route path="/item/:id" element={<Details />} />
                      <Route path="/quiz-results" element={<QuizResults />} />
                      <Route path="/failed-questions-primer" element={<React.Suspense fallback={<div>Loading...</div>}><FailedQuestionsPrimer /></React.Suspense>} />
                      <Route path="/promptdb" element={<PromptDB />} />
                      <Route path="/marketing-ai" element={<MarketingAI />} />
                      <Route path="/yt-generator" element={<YouTubeQuizGenerator />} />
                      <Route path="/learn" element={<IWantToLearn />} />
                      <Route path="/test2" element={<Test2 />} />
                    </Routes>
                  </Container>
                </Box>
                <Chat isOpen={isChatOpen} onClose={handleChatToggle} />
              </Box>
            </BrowserRouter>
          </UserProvider>
        </ChatProvider>
      </QuizProvider>
    </ThemeProvider>
  );
}

export default App;
