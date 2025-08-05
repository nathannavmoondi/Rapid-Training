import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Paper,
  CircularProgress,
  Breadcrumbs,
  Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { getFaqQuestions, FaqItem } from '../services/aiService';
import '../styles/faq.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Faq: React.FC = () => {
  const { skillTopic } = useParams<{ skillTopic: string }>();
  const navigate = useNavigate();

  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedAccordions, setExpandedAccordions] = useState<{ [key: number]: boolean }>({});
  const [allExpanded, setAllExpanded] = useState<boolean>(false);

  useEffect(() => {
    const fetchFaqData = async () => {
      if (!skillTopic) return;
      
      setLoading(true);
      try {
        const questions = await getFaqQuestions(skillTopic);
        setFaqItems(questions);
      } catch (error) {
        console.error('Error fetching FAQ questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqData();
  }, [skillTopic]);
  
  // Process answer content to apply syntax highlighting
  const processAnswerContent = useCallback((htmlContent: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Find all pre > code blocks and replace them with properly formatted code
    const codeBlocks = tempDiv.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock) => {
      // Try to determine the language from the class (if any)
      const classNames = codeBlock.className.split(' ');
      let language = 'javascript'; // Default
      
      for (const className of classNames) {
        if (className.startsWith('language-')) {
          language = className.replace('language-', '');
          break;
        }
      }
      
      // Mark this block to be replaced with SyntaxHighlighter later
      codeBlock.setAttribute('data-language', language);
      codeBlock.setAttribute('data-highlighted', 'false');
    });
    
    return tempDiv.innerHTML;
  }, []);

  const handleAccordionChange = (index: number) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [index]: isExpanded
    }));
  };

  const handleToggleAll = () => {
    const newExpandState = !allExpanded;
    setAllExpanded(newExpandState);
    
    const newExpandedState: { [key: number]: boolean } = {};
    faqItems.forEach((_, index) => {
      newExpandedState[index] = newExpandState;
    });
    
    setExpandedAccordions(newExpandedState);
  };

  const decodedSkillTopic = skillTopic ? decodeURIComponent(skillTopic) : '';
  
  // Add effect to apply syntax highlighting after render
  useEffect(() => {
    if (!loading && faqItems.length > 0) {
      // Find all code blocks that need highlighting
      const codeBlocks = document.querySelectorAll('.faq-answer pre code');
      
      codeBlocks.forEach((block) => {
        const preElement = block.parentElement;
        if (!preElement) return;
        
        const language = block.getAttribute('data-language') || 'javascript';
        const code = block.textContent || '';
        
        // Create a React element with SyntaxHighlighter
        const highlightedElement = document.createElement('div');
        highlightedElement.className = 'syntax-highlighter-wrapper';
        
        // Replace the pre element with our highlighted version
        if (preElement.parentElement) {
          preElement.parentElement.replaceChild(highlightedElement, preElement);
          
          // Using React.render would be better here, but for this quick fix we'll use a styled element
          highlightedElement.innerHTML = `<pre class="syntax-highlighted ${language}" style="background: #1d1f21; border-radius: 4px; padding: 1rem; color: #e0e0e0; overflow-x: auto;">${code}</pre>`;
        }
      });
    }
  }, [loading, faqItems, expandedAccordions]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ mr: 2 }}
              color="primary"
              variant="outlined"
            >
              Back
            </Button>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" onClick={() => navigate('/topics')} sx={{ cursor: 'pointer' }}>
                Topics
              </Link>
              <Typography color="text.primary">{decodedSkillTopic} FAQ</Typography>
            </Breadcrumbs>
          </Box>
        </Box>

        <Paper elevation={3} sx={{ p: 3, backgroundColor: '#121212' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
              <QuestionAnswerIcon sx={{ mr: 1, color: '#4dabf7' }} />
              Top 20 Questions about {decodedSkillTopic}
              {loading && (
                <CircularProgress size={24} sx={{ ml: 2, color: '#1976d2' }} />
              )}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleToggleAll}
              disabled={loading}
            >
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              {faqItems.map((faq, index) => (
                <Accordion 
                  key={index}
                  expanded={expandedAccordions[index] === true}
                  onChange={handleAccordionChange(index)}
                  sx={{
                    backgroundColor: '#1e1e1e',
                    color: 'white',
                    mb: 2,
                    '&:before': {
                      display: 'none',
                    },
                    '& .MuiAccordionSummary-root': {
                      borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                    },
                    '&.Mui-expanded': {
                      margin: '0 0 16px 0',
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#1976d2' }} />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                    sx={{
                      '& .MuiAccordionSummary-content': {
                        margin: '12px 0',
                      },
                      backgroundColor: '#1a2233'
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 500,
                        color: '#4dabf7'
                      }}
                      dangerouslySetInnerHTML={{ __html: faq.question }}
                    />
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 2, color: '#e0e0e0' }}>
                    <Box 
                      dangerouslySetInnerHTML={{ __html: processAnswerContent(faq.answer) }}
                      className="faq-answer"
                      sx={{ color: '#e0e0e0' }}
                    />
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Faq;
