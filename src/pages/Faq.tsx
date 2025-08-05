import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
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
import { useChat } from '../contexts/chatContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { getFaqQuestions, FaqItem } from '../services/aiService';
import { chatService } from '../services/chatService';
import '../styles/faq.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FaqProps {
  onChatToggle?: () => void;
  isChatOpen?: boolean;
}

const Faq: React.FC<FaqProps> = ({ onChatToggle, isChatOpen = false }) => {
  const { skillTopic } = useParams<{ skillTopic: string }>();
  const navigate = useNavigate();
  const { setChatboxSkill, addExternalMessage } = useChat();

  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedAccordions, setExpandedAccordions] = useState<{ [key: number]: boolean }>({});
  const [allExpanded, setAllExpanded] = useState<boolean>(false);
  const [explainingFurtherIds, setExplainingFurtherIds] = useState<{ [key: number]: boolean }>({});

  const numberOfQuestions = 50;

  useEffect(() => {
    const fetchFaqData = async () => {
      if (!skillTopic) return;
      
      setLoading(true);
      try {
        const questions = await getFaqQuestions(skillTopic, numberOfQuestions);
        setFaqItems(questions);
      } catch (error) {
        console.error('Error fetching FAQ questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqData();
  }, [skillTopic]);
  
  // Process answer content to prepare code blocks for highlighting
  const processAnswerContent = useCallback((htmlContent: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Find all pre > code blocks and mark them for later processing
    const codeBlocks = tempDiv.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock, index) => {
      // Try to determine the language from the class (if any)
      const classNames = codeBlock.className.split(' ');
      let language = 'javascript'; // Default
      
      for (const className of classNames) {
        if (className.startsWith('language-')) {
          language = className.replace('language-', '');
          break;
        }
      }
      
      // Create a unique ID for this code block
      const codeId = `code-block-${index}`;
      
      // Replace the pre element with a placeholder div that we can target later
      const pre = codeBlock.parentElement;
      if (pre && pre.parentElement) {
        const placeholder = document.createElement('div');
        placeholder.className = 'syntax-highlighter-placeholder';
        placeholder.setAttribute('data-code-id', codeId);
        placeholder.setAttribute('data-language', language);
        placeholder.setAttribute('data-content', encodeURIComponent(codeBlock.textContent || ''));
        pre.parentElement.replaceChild(placeholder, pre);
      }
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

  const handleExplainFurther = async (index: number) => {
    if (!skillTopic) return;
    
    // Mark this FAQ as being explained
    setExplainingFurtherIds(prev => ({
      ...prev,
      [index]: true
    }));
    
    try {
      // Create a thinking message first
      const thinkingMessage = {
        id: Math.random().toString(36).substring(7),
        text: "Thinking...",
        isUser: false,
        timestamp: new Date()
      };
      addExternalMessage(thinkingMessage);
      
      // Make sure chat is open
      if (onChatToggle && !isChatOpen) {
        // Set topic in chat context
        setChatboxSkill(decodedSkillTopic);
        
        // Open the chat panel
        onChatToggle();
        // Wait a bit for the chat to fully open
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Call AI with the explain further prompt
      const faq = faqItems[index];
      const content = `<strong>Question:</strong> ${faq.question} <br/><br/><strong>Answer:</strong> ${faq.answer}`;
      
      const aiResponse = await chatService.explainQuizInDepth(
        decodedSkillTopic,
        content,
        'english' // You can add language support later if needed
      );
      
      // Add AI response to chat (replaces the thinking message)
      addExternalMessage(aiResponse);
      
      // Force scroll to top after a small delay to ensure the message is rendered
      setTimeout(() => {
        const chatContainer = document.querySelector('.chat-messages');
        if (chatContainer) {
          chatContainer.scrollTop = 0;
        }
      }, 200);
      
    } catch (error) {
      console.error('Error explaining further:', error);
      
      // Add an error message
      const errorMessage = {
        id: Math.random().toString(36).substring(7),
        text: "I apologize, but I encountered an error processing your request. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      addExternalMessage(errorMessage);
      
    } finally {
      // Clear the explaining state
      setExplainingFurtherIds(prev => ({
        ...prev,
        [index]: false
      }));
    }
  };

  const decodedSkillTopic = skillTopic ? decodeURIComponent(skillTopic) : '';
  
  // Add effect to apply syntax highlighting after render using proper React components
  useEffect(() => {
    if (!loading && faqItems.length > 0) {
      // Find all placeholder divs that need to be replaced with SyntaxHighlighter
      const placeholders = document.querySelectorAll('.faq-answer .syntax-highlighter-placeholder');
      
      placeholders.forEach((placeholder) => {
        const language = placeholder.getAttribute('data-language') || 'javascript';
        const encodedContent = placeholder.getAttribute('data-content') || '';
        const code = decodeURIComponent(encodedContent);
        
        // Create the syntax highlighter component using React
        const syntaxHighlighterRoot = document.createElement('div');
        syntaxHighlighterRoot.className = 'syntax-highlighter-wrapper';
        
        // Replace the placeholder with our container
        if (placeholder.parentElement) {
          placeholder.parentElement.replaceChild(syntaxHighlighterRoot, placeholder);
          
          // Render the actual SyntaxHighlighter component into the DOM
          ReactDOM.createRoot(syntaxHighlighterRoot).render(
            <SyntaxHighlighter 
              language={language} 
              style={atomDark}
              customStyle={{
                borderRadius: '4px',
                fontSize: '14px',
                margin: '1rem 0',
                padding: '1rem',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                boxShadow: '0 3px 5px rgba(0,0,0,0.3)'
              }}
              codeTagProps={{
                style: {
                  fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
                  color: '#e0e0e0'
                }
              }}
            >
              {code}
            </SyntaxHighlighter>
          );
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
          
          {onChatToggle && (
            <Button
              startIcon={<QuestionAnswerIcon />}
              onClick={() => {
                if (onChatToggle) {
                  // Set the chatbox skill in the chat context
                  setChatboxSkill(decodedSkillTopic);
                  
                  // Then toggle the chat
                  onChatToggle();
                }
              }}
              variant="contained"
              color="primary"
              sx={{
                ml: 2
              }}
            >
              Chat with AI
            </Button>
          )}
        </Box>

        <Paper elevation={3} sx={{ p: 3, backgroundColor: '#121212' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
              <QuestionAnswerIcon sx={{ mr: 1, color: '#4dabf7' }} />
              Top Questions about {decodedSkillTopic} (FAQ)
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent accordion toggle
                          handleExplainFurther(index);
                        }}
                        disabled={explainingFurtherIds[index] === true}
                        startIcon={<TipsAndUpdatesIcon />}
                        sx={{
                          backgroundColor: '#2e7d32', // Dark green
                          '&:hover': {
                            backgroundColor: '#1b5e20', // Darker green on hover
                          }
                        }}
                      >
                        {explainingFurtherIds[index] ? 'Explaining...' : 'Explain Further'}
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              startIcon={<KeyboardArrowUpIcon />}
            >
              Back to Top
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Faq;
