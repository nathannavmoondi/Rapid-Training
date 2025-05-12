/**
 * SkillsRefresherDetail Component
 * 
 * Displays interactive questions for a specific skill.
 * Features:
 * - Dynamic question loading based on skill
 * - Navigation between questions
 * - Progress tracking
 */
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Box, Button, Stack } from '@mui/material';
import { skills } from '../data/skills';
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

export const SkillsRefresherDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const skillId = searchParams.get('skill');
  const skill = skills.find(s => s.id === skillId);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleAskQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await requestRefresher('intermediate', skill?.title || '');
      setQuestion(response || 'Failed to load question. Please try again.');
    } catch (error) {
      console.error('Error fetching question:', error);
      setQuestion('Failed to load question. Please try again.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (skill) {
      handleAskQuestion();
    }
  }, [skill]);  useEffect(() => {
    if (!isLoading && question && contentRef.current) {
      // Force a re-highlight of all code blocks
      const codeBlocks = contentRef.current.querySelectorAll('code[class*="language-"]');
      codeBlocks.forEach((block) => {
        if (block.textContent) {
          block.innerHTML = block.textContent;
          Prism.highlightElement(block);
        }
      });
    }
  }, [question, isLoading]);

  if (!skill) {
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
          {skill.title} Skills Refresher
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Topic areas: {skill.topics.join(', ')}
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
            </Typography>            <Box
              ref={contentRef}
              sx={{ 
                my: 3,
                p: 3, 
                borderRadius: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '& .question-container': {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3
                },                '& .question': {
                  fontSize: '1.1rem',
                  color: '#fff',
                  opacity: 1.0,
                  fontWeight: 500,
                  marginBottom: 2,
                  padding: '16px',
                  backgroundColor: '#121212',
                  borderRadius: 1,
                  border: '1px solid #333',
                  '& pre': {
                    margin: '16px 0',
                    padding: '16px',
                    backgroundColor: '#000',
                    borderRadius: '4px',
                    overflow: 'auto',
                    border: '1px solid #333'
                  },
                  '& code': {
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    fontSize: '0.95rem',
                    color: '#fff'
                  },
                  '& .token.comment': { color: '#6a9955' },
                  '& .token.string': { color: '#ce9178' },
                  '& .token.number': { color: '#b5cea8' },
                  '& .token.keyword': { color: '#569cd6' },
                  '& .token.function': { color: '#dcdcaa' },
                  '& .token.class-name': { color: '#4ec9b0' },
                  '& .token.operator': { color: '#d4d4d4' },
                  '& .token.punctuation': { color: '#d4d4d4' }
                },
                '& .options': {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  padding: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 1,
                  fontFamily: 'monospace'
                },
                '& .answer-box': {
                  marginTop: 2,
                  padding: '16px',
                  backgroundColor: '#121212',
                  borderRadius: 1,
                  border: '1px solid #333'
                },
                '& .correct-answer': {
                  color: '#4caf50',
                  fontWeight: 'bold',
                  marginBottom: 2,
                  fontSize: '1.5rem',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #333'
                },
                '& .explanation': {
                  color: '#fff',
                  '& p': {
                    margin: '12px 0',
                    lineHeight: 1.8,
                    fontSize: '1rem'
                  },
                  '& pre': {
                    margin: '16px 0',
                    padding: '16px',
                    backgroundColor: '#000',
                    borderRadius: '4px',
                    overflow: 'auto',
                    border: '1px solid #333'
                  },
                  '& code': {
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    fontSize: '0.95rem',
                    color: '#fff'
                  },
                  '& .token.comment': { color: '#6a9955' },
                  '& .token.string': { color: '#ce9178' },
                  '& .token.number': { color: '#b5cea8' },
                  '& .token.keyword': { color: '#569cd6' },
                  '& .token.function': { color: '#dcdcaa' },
                  '& .token.class-name': { color: '#4ec9b0' },
                  '& .token.operator': { color: '#d4d4d4' },
                  '& .token.punctuation': { color: '#d4d4d4' }
                }
              }}
              dangerouslySetInnerHTML={{ __html: question }}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={handleAskQuestion}
              >
                Next Question
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/skills')}
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
