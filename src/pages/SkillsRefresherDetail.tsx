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
import 'prismjs/components/prism-graphql'; // Added for GraphQL support
import 'prismjs/components/prism-cpp'; // Added for C++ support
import 'prismjs/components/prism-python'; // Added for Python support
import 'prismjs/components/prism-rust'; // Added for Rust support
import 'prismjs/components/prism-go'; // Added for Go support
import 'prismjs/components/prism-ruby'; // Added for Ruby support
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

// Helper function to process HTML for answer visibility
const getProcessedQuestionHtml = (html: string, answerVisible: boolean): string => {
  if (!html) return '';

  // Regex to target the answer-box div.
  // Captures:
  // 1. tagStart: The part of the tag before style: (<div ... class="...answer-box...")
  // 2. styleAttributeGroup (optional): The whole style attribute like ' style="color:red;"'
  // 3. styleContent (optional, nested in group 2): The content of the style attribute like 'color:red;'
  // 4. tagEndAfterStyle: The part of the tag after style (or after class if no style) up to and including >
  const answerBoxRegex = /(<div\s+[^>]*class="[^"]*\banswer-box\b[^"]*")(\s+style="([^"]*)")?([^>]*>)/gi;

  return html.replace(answerBoxRegex, (match, tagStart, styleAttributeGroup, styleContent, tagEndAfterStyle) => {
    if (answerVisible) {
      // SHOWING: Remove 'display:none' or any 'display:*' from the style attribute
      if (styleAttributeGroup && typeof styleContent === 'string') {
        const cleanedStyles = styleContent
          .split(';')
          .map((s: string) => s.trim())
          .filter((s: string) => s && !s.toLowerCase().startsWith('display:'))
          .join('; ')
          .trim();
        if (cleanedStyles) {
          return `${tagStart} style="${cleanedStyles}"${tagEndAfterStyle}`;
        } else {
          // Style attribute becomes completely empty, remove it.
          return `${tagStart}${tagEndAfterStyle}`;
        }
      }
      // No style attribute to modify, or styleContent is not a string.
      // If answerVisible is true, the element should be visible. If it had no style or no display:none, it's already fine.
      return match; 
    } else {
      // HIDING: Add or ensure 'display:none'
      let currentStylesArray: string[];
      if (styleAttributeGroup && typeof styleContent === 'string') { // Existing style attribute was matched
        currentStylesArray = styleContent.split(';')
          .map((s: string) => s.trim())
          .filter((s: string) => s && !s.toLowerCase().startsWith('display:'));
      } else { // No existing style attribute or styleContent was not a string
        currentStylesArray = [];
      }
      // Add display:none if not already present (though filter should handle it, this is an explicit check)
      if (!currentStylesArray.some(style => style.toLowerCase().startsWith('display:'))) {
        currentStylesArray.push('display:none');
      }
      return `${tagStart} style="${currentStylesArray.join('; ').trim()}"${tagEndAfterStyle}`;
    }
  });
};

export const SkillsRefresherDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const skillTitle = searchParams.get('skill');
  const SkillCategory = searchParams.get('category');
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [currentSkill, setCurrentSkill] = useState<Skill | undefined>();
  const [showAnswer, setShowAnswer] = useState(false); // Added state for answer visibility
  const [isSlideDeck, setIsSlideDeck] = useState(false); // Added state for slide deck

  // Find skill immediately
  useEffect(() => {
    if (!skillTitle) {
      console.log('No skill title in URL');
      return;
    }
    
    try {
      const customSkillsJson = localStorage.getItem('customSkills');
      const customSkillsData = customSkillsJson ? JSON.parse(customSkillsJson) : []; // Renamed to avoid conflict
      const allSkills = [...skills, ...customSkillsData]; // Use renamed variable
      
      const decodedTitle = decodeURIComponent(skillTitle);
      const normalizedTitle = decodedTitle.trim();
      const foundSkill = allSkills.find(s => 
        s.title.trim().toLowerCase() === normalizedTitle.toLowerCase()
      );
      
      if (foundSkill) {
        setCurrentSkill(foundSkill);
      } else {
        console.log('Skill not found:', normalizedTitle);
      }
    } catch (error) {
      console.error('Error finding skill:', error);
    }
  }, [skillTitle]);

  const handleSlideDeck = useCallback(async () => {
    
    console.log('in slide deck', currentSkill?.title);
    if (!currentSkill?.title) return;
    
    setIsLoading(true);
    setShowAnswer(false); // Reset answer visibility for new question
    setIsSlideDeck(true);
    setQuestion(''); // Clear previous question while loading new one
    try {
      const response = await requestRefresher('slidedeck', currentSkill.title, currentSkill.category);
      setQuestion(response || 'Failed to load question. Please try again.');
    } catch (error) {
      console.error('Error fetching question:', error);
      setQuestion('Failed to load question. Please try again.');
    }
    setIsLoading(false);
    setShowAnswer(false); // Reset answer visibility for new question
  }, [currentSkill?.title]); 

  const handleAskQuestion = useCallback(async () => {
    if (!currentSkill?.title) return;
    
    setIsLoading(true);
    setShowAnswer(false); // Reset answer visibility for new question
    setIsSlideDeck(false);
    setQuestion(''); // Clear previous question while loading new one
    try {
      const response = await requestRefresher('intermediate', currentSkill.title, currentSkill.category);
      setQuestion(response || 'Failed to load question. Please try again.');
    } catch (error) {
      console.error('Error fetching question:', error);
      setQuestion('Failed to load question. Please try again.');
    }
    setIsLoading(false);
  }, [currentSkill?.title]); 

  // Fetch initial question only when currentSkill changes and has a title
  useEffect(() => {
    if (currentSkill?.title) {
      handleAskQuestion();
    }
  }, [currentSkill?.title, handleAskQuestion]); 

  // Syntax highlighting effect
  useEffect(() => {
    if (!isLoading && question) {
      Promise.resolve().then(() => { // Microtask delay
        highlightCode();
      });
    }
  }, [question, isLoading, showAnswer]); 

  if (!currentSkill) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Skill not found. Please check the URL or go back to skills list.
        </Typography>
        <Button onClick={() => navigate('/skills')} sx={{ mt: 2 }}>Back to Skills</Button>
      </Container>
    );
  }

  const htmlToRender = getProcessedQuestionHtml(question, showAnswer);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary.main">
          {currentSkill.title} Rapid Training AI
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
        {isLoading && !question ? ( 
          <Typography>Loading question...</Typography>
        ) : (
          <>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.light' }}>
              { isSlideDeck ? 'Slide Deck (the basics)' : 'Practice Question'}
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
                  p:2, 
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
              dangerouslySetInnerHTML={{ __html: htmlToRender }}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
              <Button
                variant="contained"
                // color="secondary" // Replaced by sx prop for custom styling
                onClick={() => setShowAnswer(true)}
                disabled={isLoading || showAnswer || !question || isSlideDeck}
                sx={{
                  backgroundColor: '#4CAF50', // Green
                  color: '#ffffff', // White
                  '&:hover': {
                    backgroundColor: '#388E3C', // Darker green on hover
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(76, 175, 80, 0.5)', // Lighter green when disabled
                    color: 'rgba(255, 255, 255, 0.7)',
                  }
                }}
              >
                Show Answer
              </Button>
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
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}> {/* New Stack for the Slidedeck button */}
              <Button
                variant="contained"
                onClick={handleSlideDeck} // Added onClick handler
                disabled={isLoading} // Added disabled state
                sx={{
                  backgroundColor: '#FF9800', // Orange, adjust as needed
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#F57C00', // Darker orange on hover
                  },
                }}
              >
                Slidedeck (the basics)
              </Button>
            </Stack>
          </>
        )}
      </Paper>
    </Container>
  );
};
