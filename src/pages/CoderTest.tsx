import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getCoderTestQuestion } from '../services/aiService';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useQuiz } from '../contexts/quizContext';

// Component to render content with syntax highlighting (similar to Chat.tsx)
const MessageContent: React.FC<{ 
  text: string; 
  showAnswer: boolean;
  showTips: boolean;
  onToggleAnswer: () => void;
  onToggleTips: () => void;
}> = ({ text, showAnswer, showTips, onToggleAnswer, onToggleTips }) => {
  // Parse the message to identify code blocks and apply syntax highlighting
  const renderContentWithSyntaxHighlighting = (content: string) => {
    // First, handle HTML code blocks (<pre><code class="language-xxx">)
    let processedContent = content.replace(
      /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
      (match, language, code) => {
        // Decode HTML entities and convert to markdown format
        const decodedCode = code
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'");
        return `\`\`\`${language}\n${decodedCode}\n\`\`\``;
      }
    );

    // Also handle plain <pre><code> without language class
    processedContent = processedContent.replace(
      /<pre><code>([\s\S]*?)<\/code><\/pre>/g,
      (match, code) => {
        const decodedCode = code
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'");
        return `\`\`\`javascript\n${decodedCode}\n\`\`\``;
      }
    );

    // Split content into question, tips, and answer sections
    // Look for the specific div sections in the AI response
    let questionContent = processedContent;
    let answerContent = '';
    let tipsContent = '';
    
    // Debug logging
    console.log('Processing content:', processedContent.substring(0, 500));
    
    // Extract tips section
    const tipsMatch = processedContent.match(/([\s\S]*?)(<div class="tips-section"[\s\S]*?)(<div class="answer-section"[\s\S]*)/);
    if (tipsMatch) {
      questionContent = tipsMatch[1];
      tipsContent = tipsMatch[2];
      answerContent = tipsMatch[3];
      
      // Remove inline display:none styles from tips and answer content
      tipsContent = tipsContent.replace(/style="display:\s*none;?"/, '').replace(/style='display:\s*none;?'/, '');
      answerContent = answerContent.replace(/style="display:\s*none;?"/, '').replace(/style='display:\s*none;?'/, '');
      
      console.log('Found tips content:', tipsContent.substring(0, 200));
    } else {
      // Fallback: try to extract just answer section if no tips
      const answerMatch = processedContent.match(/([\s\S]*?)(<div class="answer-section"[\s\S]*)/);
      if (answerMatch) {
        questionContent = answerMatch[1];
        answerContent = answerMatch[2];
        
        // Remove inline display:none style from answer content
        answerContent = answerContent.replace(/style="display:\s*none;?"/, '').replace(/style='display:\s*none;?'/, '');
        
        console.log('No tips found, only answer section');
      } else {
        console.log('No structured sections found in content');
      }
    }

    // Split content by code blocks (```language...```)
    const processContentParts = (contentToProcess: string) => {
      const parts = contentToProcess.split(/(```[\w]*\n[\s\S]*?\n```)/g);
      
      // Language mapping for better syntax highlighting
      const mapLanguage = (lang: string): string => {
        const languageMap: { [key: string]: string } = {
          'language-jsx': 'jsx',
          'language-tsx': 'tsx',
          'language-javascript': 'javascript',
          'language-typescript': 'typescript',
          'language-html': 'markup',
          'language-xml': 'markup',
          'language-markup': 'markup',
          'jsx': 'jsx',
          'tsx': 'tsx',
          'js': 'javascript',
          'ts': 'typescript',
          'html': 'markup',
          'xml': 'markup',
          'py': 'python',
          'cs': 'csharp',
          'cpp': 'cpp',
          'c++': 'cpp',
          'java': 'java',
          'php': 'php',
          'ruby': 'ruby',
          'go': 'go',
          'rust': 'rust',
          'swift': 'swift',
          'kotlin': 'kotlin',
          'scala': 'scala',
          'sql': 'sql',
          'json': 'json',
          'yaml': 'yaml',
          'yml': 'yaml',
          'toml': 'toml',
          'ini': 'ini',
          'bash': 'bash',
          'sh': 'bash',
          'shell': 'bash',
          'powershell': 'powershell',
          'ps1': 'powershell'
        };
        
        return languageMap[lang.toLowerCase()] || lang || 'javascript';
      };
      
      return parts.map((part, index) => {
        // Check if this part is a code block
        const codeMatch = part.match(/^```(\w*)\n([\s\S]*?)\n```$/);
        
        if (codeMatch) {
          const [, language, code] = codeMatch;
          const mappedLang = mapLanguage(language);
          
          return (
            <Box key={index} sx={{ my: 2 }}>
              <SyntaxHighlighter
                language={mappedLang}
                style={vscDarkPlus}
                showLineNumbers={false}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  background: '#1E1E1E',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  borderRadius: '6px',
                  fontFamily: "'Fira Code', 'Consolas', monospace",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "'Fira Code', 'Consolas', monospace",
                  }
                }}
              >
                {code.trim()}
              </SyntaxHighlighter>
            </Box>
          );
        } else {
          // Regular HTML content
          return (
            <Typography
              key={index}
              component="div"
              sx={{
                color: 'white',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                '& h3': { color: '#f500ff', mb: 2, fontSize: '1.5rem', fontWeight: 'bold' },
                '& h4': { color: '#00FF00', mb: 1, fontSize: '1.2rem', fontWeight: 'bold' },
                '& p': { color: 'white', mb: 1, lineHeight: '1.6' },
                '& li': { color: 'white', mb: 0.5, lineHeight: '1.5' },
                '& ul': { paddingLeft: '1.5em', mb: 2 },
                '& strong': { fontWeight: 'bold', color: 'lightcyan' },
                '& em': { fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.9)' }
              }}
              dangerouslySetInnerHTML={{ __html: part }}
            />
          );
        }
      });
    };
    
    return (
      <>
        {/* Question Section */}
        <div>
          {processContentParts(questionContent)}
        </div>
        
        {/* Show/Hide Buttons */}
        {(answerContent || tipsContent) && (
          <Box sx={{ my: 3, textAlign: 'center', display: 'flex', gap: 2, justifyContent: 'center' }}>
            {tipsContent && (
              <Button
                variant="contained"
                onClick={onToggleTips}
                sx={{
                  backgroundColor: showTips ? '#ff9800' : '#2196F3',
                  color: 'white',
                  '&:hover': { 
                    backgroundColor: showTips ? '#f57c00' : '#1976D2' 
                  }
                }}
              >
                {showTips ? 'Hide Tips' : 'Show Tips'}
              </Button>
            )}
            
            {answerContent && (
              <Button
                variant="contained"
                onClick={onToggleAnswer}
                sx={{
                  backgroundColor: showAnswer ? '#f44336' : '#4CAF50',
                  color: 'white',
                  '&:hover': { 
                    backgroundColor: showAnswer ? '#d32f2f' : '#388E3C' 
                  }
                }}
              >
                {showAnswer ? 'Hide Answer' : 'Show Answer'}
              </Button>
            )}
          </Box>
        )}
        
        {/* Tips Section (conditionally rendered) */}
        {showTips && tipsContent && (
          <div style={{ marginTop: '20px', borderTop: '2px solid #2196F3', paddingTop: '20px' }}>
            {processContentParts(tipsContent)}
          </div>
        )}
        
        {/* Answer Section (conditionally rendered) */}
        {showAnswer && answerContent && (
          <div style={{ marginTop: '20px', borderTop: '2px solid #333', paddingTop: '20px' }}>
            {processContentParts(answerContent)}
          </div>
        )}
      </>
    );
  };

  return <Box>{renderContentWithSyntaxHighlighting(text)}</Box>;
};

const CoderTest: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const language = searchParams.get('language') || 'javascript';
  const initialLevel = searchParams.get('level') || 'basic';
  
  const [level, setLevel] = useState(initialLevel);
  const [questionContent, setQuestionContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Quiz context for tracking coder test questions
  const { setCoderTestQuestions, setInCoderTest, coderTestQuestions, setLevel: setQuizLevel } = useQuiz();

  // Copy to clipboard function
  const handleCopyToClipboard = async () => {
    try {
      // Extract just the question text from the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = questionContent;
      
      // Remove answer and tips sections for copying
      const answerSections = tempDiv.querySelectorAll('.answer-section, .tips-section');
      answerSections.forEach(section => section.remove());
      
      // Get clean text content
      const questionText = tempDiv.textContent || tempDiv.innerText || '';
      
      // Create header with programming language and skill level
      const header = `Coder Test - ${getLanguageDisplayName(language)} (${level})\n\n`;
      
      // Combine header with question content
      const fullContent = header + questionText.trim();
      
      await navigator.clipboard.writeText(fullContent);
      setCopySuccess(true);
      
      // Reset success message after 2 seconds
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy question: ', err);
    }
  };

  // Set inCoderTest to true when entering the page, false when leaving
  useEffect(() => {
    setInCoderTest(true);
    return () => {
      setInCoderTest(false);
      setCoderTestQuestions([]); // Clear questions when leaving page
    };
  }, [setInCoderTest, setCoderTestQuestions]);

  // Load coding question when component mounts or when language changes (but not level)
  useEffect(() => {
    loadQuestion();
  }, [language]); // Removed level dependency to prevent auto-loading on level change

  const loadQuestion = async () => {
    setIsLoading(true);
    setError('');
    setShowAnswer(false);
    setShowTips(false);
    
    try {
      const response = await getCoderTestQuestion(language, level, coderTestQuestions);
      setQuestionContent(response);
      // Add the new question to the array
      setCoderTestQuestions(prev => [...prev, response]);
    } catch (err) {
      console.error('Error loading question:', err);
      setError('Failed to load coding question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
    setShowTips(false); // Hide tips when showing answer
  };

  const toggleTips = () => {
    setShowTips(!showTips);
    setShowAnswer(false); // Hide answer when showing tips
  };

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    setQuizLevel(newLevel); // Update quiz context level
    setCoderTestQuestions([]); // Clear previous questions
  };

  const getLanguageDisplayName = (lang: string) => {
    switch (lang) {
      case 'csharp': return 'C#';
      case 'javascript': return 'JavaScript';
      case 'cpp': return 'C++';
      case 'python': return 'Python';
      case 'java': return 'Java';
      default: return lang.charAt(0).toUpperCase() + lang.slice(1);
    }
  };

  const handleCancel = () => {
    navigate('/'); // Go back to home page
  };

  const handlePrevious = () => {
    // TODO: Implement previous question logic
    console.log('Previous question');
  };

  const handleNext = () => {
    // Load a new question
    loadQuestion();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary.main" sx={{ mb: 0 }}>
          Coder Test - {getLanguageDisplayName(language)} ({level})
        </Typography>
        
        {/* Copy to Clipboard Button */}
        {questionContent && !isLoading && (
          <Tooltip 
            title={copySuccess ? "Question copied!" : "Copy question to clipboard"}
            open={copySuccess || undefined}
            arrow
          >
            <IconButton
              onClick={handleCopyToClipboard}
              sx={{
                color: 'primary.light',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Main Paper */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          backgroundColor: 'rgba(45, 45, 45, 0.7)', 
          borderRadius: 2 
        }}
      >
        {/* Content Area */}
        <Box sx={{ 
          minHeight: '400px',
          mb: 4
        }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress sx={{ color: '#9C27B0' }} />
              <Typography sx={{ ml: 2, color: 'white' }}>Loading coding question...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ color: '#f44336', mb: 2 }}>
                Error Loading Question
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                {error}
              </Typography>
              <Button 
                variant="contained" 
                onClick={loadQuestion}
                sx={{ 
                  backgroundColor: '#9C27B0',
                  '&:hover': { backgroundColor: '#7B1FA2' }
                }}
              >
                Try Again
              </Button>
            </Box>
          ) : (
            <Box 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: 2,
                p: 3,
                mb: 3
              }}
            >
              {/* AI Generated Content with Syntax Highlighting */}
              <MessageContent 
                text={questionContent} 
                showAnswer={showAnswer}
                showTips={showTips}
                onToggleAnswer={toggleAnswer}
                onToggleTips={toggleTips}
              />
            </Box>
          )}
        </Box>

        {/* Bottom Buttons - Hidden during loading */}
        {!isLoading && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
              {/* Left side - Cancel */}
              <Button
                variant="contained"
                onClick={handleCancel}
                sx={{ 
                  backgroundColor: '#f44336',
                  color: 'white',
                  '&:hover': { backgroundColor: '#d32f2f' }
                }}
              >
                Cancel
              </Button>

              {/* Right side - Previous and Next */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handlePrevious}
                  sx={{ 
                    backgroundColor: '#2196F3',
                    color: 'white',
                    '&:hover': { backgroundColor: '#1976D2' }
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ 
                    backgroundColor: '#2196F3',
                    color: 'white',
                    '&:hover': { backgroundColor: '#1976D2' }
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>

            {/* Level Dropdown - Bottom Row */}
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-start' }}>
              <Typography variant="body1" sx={{ color: 'white', mr: 1 }}>Level:</Typography>
              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel id="level-select-label" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}></InputLabel>
                <Select
                  labelId="level-select-label"
                  id="level-select"
                  value={level}
                  label=""
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Select option</span>;
                    }
                    return selected;
                  }}
                  onChange={(e) => handleLevelChange(e.target.value as string)}
                  sx={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2E7D32',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1B5E20',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#388E3C',
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select option</em>
                  </MenuItem>
                  <MenuItem value="basic">Basic</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default CoderTest;
