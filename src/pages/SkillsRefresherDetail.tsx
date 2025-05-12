/**
 * SkillsRefresherDetail Component
 * 
 * Displays interactive questions for a specific skill.
 * Features:
 * - Dynamic question loading based on skill
 * - Navigation between questions
 * - Progress tracking
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Box, Button, Stack } from '@mui/material';
import { skills } from '../data/skills';
import type { Skill } from '../data/skills';
import { requestRefresher } from '../services/aiService';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import '../styles/answer-section.css';

// Debounced highlight function
const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const highlightCode = debounce(() => {
  const codeBlocks = document.querySelectorAll('pre code');
  codeBlocks.forEach((block) => {
    if (block instanceof HTMLElement) {
      Prism.highlightElement(block);
    }
  });
}, 100);

export const SkillsRefresherDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const skillTitle = searchParams.get('skill');
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [currentSkill, setCurrentSkill] = useState<Skill | undefined>();

  // Find skill immediately without state updates
  useEffect(() => {
    if (!skillTitle) {
      console.log('No skill title in URL');
      return;
    }
    
    try {
      const customSkillsJson = localStorage.getItem('customSkills');
      const customSkills = customSkillsJson ? JSON.parse(customSkillsJson) : [];
      const allSkills = [...skills, ...customSkills];
      
      // Decode the URL-encoded skill title and handle special characters
      const decodedTitle = decodeURIComponent(skillTitle);
      
      // Case-insensitive comparison and normalize whitespace
      const normalizedTitle = decodedTitle.trim();
      const foundSkill = allSkills.find(s => 
        s.title.trim().toLowerCase() === normalizedTitle.toLowerCase()
      );
      
      console.log('Looking for skill:', normalizedTitle);
      console.log('Available skills:', allSkills.map(s => s.title));
      console.log('Found skill:', foundSkill);
      
      if (foundSkill) {
        setCurrentSkill(foundSkill);
      }
    } catch (error) {
      console.error('Error finding skill:', error);
    }
  }, [skillTitle]);

  const handleAskQuestion = useCallback(async () => {
    if (!currentSkill?.title) return;
    
    setIsLoading(true);
    try {
      const response = await requestRefresher('intermediate', currentSkill.title);
      setQuestion(response || 'Failed to load question. Please try again.');
    } catch (error) {
      console.error('Error fetching question:', error);
      setQuestion('Failed to load question. Please try again.');
    }
    setIsLoading(false);
  }, [currentSkill?.title]);

  // Fetch initial question only when currentSkill changes
  useEffect(() => {
    if (currentSkill?.title) {
      handleAskQuestion();
    }
  }, [currentSkill?.title, handleAskQuestion]);

  // Syntax highlighting effect
  useEffect(() => {
    if (!isLoading && question) {
      highlightCode();
    }
  }, [question, isLoading]);

  if (!currentSkill) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Skill not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary.main">
          {currentSkill.title} Skills Refresher
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Topic areas: {currentSkill.topics.join(', ')}
        </Typography>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          backgroundColor: 'rgba(45, 45, 45, 0.7)',
          borderRadius: 2
        }}
      >
        {isLoading ? (
          <Typography>Loading question...</Typography>
        ) : (
          <>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.light' }}>
              Practice Question
            </Typography>
            <Box
              ref={contentRef}
              className="question-content"
              sx={{ 
                my: 3,
                p: 3, 
                borderRadius: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '& .question-container': {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3
                },
                '& .question': {
                  fontSize: '1.1rem',
                  color: '#fff',
                  fontWeight: 500,
                  marginBottom: 2,
                  p: 2,
                  backgroundColor: '#121212',
                  borderRadius: 1,
                  border: '1px solid #333',
                },
                '& pre': {
                  margin: '16px 0',
                  p: 2,
                  backgroundColor: '#000',
                  borderRadius: 1,
                  overflow: 'auto',
                  border: '1px solid #333'
                },
                '& code': {
                  fontFamily: '"Fira Code", "Consolas", monospace',
                  fontSize: '0.95rem',
                  color: '#fff'
                },
                '& .token': {
                  '&.comment': { color: '#6a9955' },
                  '&.string': { color: '#ce9178' },
                  '&.number': { color: '#b5cea8' },
                  '&.keyword': { color: '#569cd6' },
                  '&.function': { color: '#dcdcaa' },
                  '&.class-name': { color: '#4ec9b0' },
                  '&.operator': { color: '#d4d4d4' },
                  '&.punctuation': { color: '#d4d4d4' }
                }
              }}
              dangerouslySetInnerHTML={{ __html: question }}
            />            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
          
              <Button
                variant="contained"
                color="primary"
                onClick={handleAskQuestion}
                disabled={isLoading}
              >
                Next Question
              </Button>
                  <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/skills')}
                disabled={isLoading}
              >
                Done
              </Button>
            </Stack>
          </>
        )}
      </Paper>
    </Container>
  );
};
