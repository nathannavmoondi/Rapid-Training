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
import SkillsRefresherDetail from './pages/SkillsRefresherDetail';
import { QuizResults } from './pages/QuizResults';
import { QuizProvider } from './contexts/quizContext';
import { ChatProvider, UserProvider } from './contexts/chatContext';
import { PromptDB } from './pages/PromptDB';
import { MarketingAI } from './pages/MarketingAI';
import { YouTubeQuizGenerator } from './pages/YouTubeQuizGenerator';
import MyQuizzes from './pages/MyQuizzes';
import MySlidedecks from './pages/MySlidedecks';
import MyTraining from './pages/MyTraining';
import CustomQuizzes from './pages/CustomQuizzes';
import Explore from './pages/Explore';
import ReviewQuizzes from './pages/ReviewQuizzes';
import CoderTest from './pages/CoderTest';
import InterviewCandidates from './pages/InterviewCandidates';
import { Sidebar } from './components/Sidebar';
import './styles/mobile.css';
import './App.css';
import FailedQuestionsPrimer from './pages/FailedQuestionsPrimer';
import { IWantToLearn } from './pages/IWantToLearn';
import SplashPage from './components/SplashPage';


function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Centralized chat state management
  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const openChat = () => {
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const handleSplashClose = () => {
    setShowSplash(false);
  };

  return (
    <ThemeProvider theme={theme}>
      {showSplash && <SplashPage onClose={handleSplashClose} />}
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
                <Sidebar onChatToggle={handleChatToggle} isChatOpen={isChatOpen} />
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
                      <Route path="/" element={<Navigate to="/topics" replace />} />
                      <Route path="/topics" element={<SkillsRefresher />} />
                      <Route path="/topics/:id" element={<SkillsRefresherDetail onChatToggle={handleChatToggle} isChatOpen={isChatOpen} />} />
                      <Route path="/algorithms" element={<AlgorithmList />} />
                      <Route path="/algorithm/:id" element={<AlgorithmDetail />} />
                      <Route path="/item/:id" element={<Details />} />
                      <Route path="/quiz-results" element={<QuizResults />} />
                      <Route path="/my-quizzes" element={<MyQuizzes />} />
                      <Route path="/interview-candidates" element={<InterviewCandidates />} />
                      <Route path="/my-slidedecks" element={<MySlidedecks />} />
                      <Route path="/my-training" element={<MyTraining />} />
                      <Route path="/custom-quizzes" element={<CustomQuizzes />} />
                      <Route path="/explore" element={<Explore />} />
                      <Route path="/review-quizzes" element={<ReviewQuizzes />} />
                      <Route path="/coder-test" element={<CoderTest />} />
                      <Route path="/failed-questions-primer" element={<React.Suspense fallback={<div>Loading...</div>}><FailedQuestionsPrimer /></React.Suspense>} />
                      <Route path="/promptdb" element={<PromptDB />} />
                      <Route path="/marketing-ai" element={<MarketingAI />} />
                      <Route path="/yt-generator" element={<YouTubeQuizGenerator />} />
                      <Route path="/learn" element={<IWantToLearn />} />                      
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
