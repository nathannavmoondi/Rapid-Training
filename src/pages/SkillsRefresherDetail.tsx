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
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { Container, Typography, Paper, Box, Button, Stack, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Select, MenuItem, InputLabel } from '@mui/material'; // Added Select, MenuItem, InputLabel
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material'; // Added icons for feedback
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
import 'prismjs/components/prism-c'; // Added for C-like language dependency
import 'prismjs/components/prism-graphql'; // Added for GraphQL support
import 'prismjs/components/prism-cpp'; // Added for C++ support
import 'prismjs/components/prism-python'; // Added for Python support
import 'prismjs/components/prism-rust'; // Added for Rust support
import 'prismjs/components/prism-go'; // Added for Go support
import 'prismjs/components/prism-ruby'; // Added for Ruby support
import 'prismjs/components/prism-sql'; // Added for SQL support
import 'prismjs/components/prism-java'; // Added for Java support
import 'prismjs/components/prism-csharp'; // Added for C# support
import '../styles/answer-section.css';
import { useQuiz } from '../contexts/quizContext'; // Import useQuiz

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

// Helper function to process HTML for answer visibility and quiz status
const getProcessedQuestionHtml = (html: string, answerVisible: boolean, showFeedback: boolean = false, isCorrect: boolean | null = null, maxQuizzes?: number, quizzesTaken?: number): string => {
  if (!html) return '';
  
  // Handle both answer box and explanation visibility
  const answerBoxRegex = /<div\s+[^>]*class="[^"]*\banswer-box\b[^"]*">[\s\S]*?<\/div>/gi;
  const explanationRegex = /<div\s+[^>]*class="[^"]*\bexplanation\b[^"]*">[\s\S]*?<\/div>/gi;
  
  // If answer shouldn't be visible, remove both sections entirely
  if (!answerVisible) {
    // First remove explanation divs
    html = html.replace(explanationRegex, '');
    // Then remove answer box divs
    html = html.replace(answerBoxRegex, '');
  } else {
    // When showing answer, ensure both sections are properly visible
    html = html.replace(explanationRegex, (match) => {
      return match.replace(/<div style="display:none">/g, '<div>');
    });
    html = html.replace(answerBoxRegex, (match) => {
      return match.replace(/<div style="display:none">/g, '<div>');
    });
  }

  // Handle quiz status content
  if (showFeedback && isCorrect !== null) {
    const feedbackContent = `
      <div style="margin: 16px 0; padding: 16px; border: 2px solid ${isCorrect ? 'green' : 'red'}; border-radius: 4px; background-color: transparent; display: flex; align-items: center; justify-content: center">
        <span style="margin-right: 8px; color: ${isCorrect ? 'green' : 'red'}; font-size: 24px;">
          ${isCorrect ? '✓' : '✕'}
        </span>
        <span style="font-size: 20px; color: ${isCorrect ? 'white' : 'red'}">
          ${isCorrect ? 'Correct!' : 'Incorrect!'}
        </span>
      </div>
    `;
    
    // Replace empty quiz-status div with our feedback
    html = html.replace(/<div class="quiz-status"><\/div>/, `<div class="quiz-status">${feedbackContent}</div>`);
  } else if (!showFeedback && !answerVisible) {
    // Show remaining questions when not showing feedback
    const remainingContent = `
      <div style="margin: 16px 0; padding: 8px; border: 1px solid grey; border-radius: 4px; text-align: center">
        <span style="color: white; font-size: 14px;">Questions remaining in this quiz: #NUM#</span>
      </div>
    `.replace('#NUM#', String((maxQuizzes ?? 5) - (quizzesTaken ?? 0))); // Show remaining questions
  }

  return html;
};

export const SkillsRefresherDetail = () => {  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
    const { 
    score, 
    quizzesTaken,
    maxQuizzes,
    selectedAnswer, 
    isQuizActive, 
    level,
    lastAnswerCorrect,
    startQuiz, 
    selectAnswer: selectQuizAnswer,
    submitAnswer: submitQuizAnswer,
    resetQuiz,
    setPreviousPath,
    previousPath,
    setLevel
  } = useQuiz();

  // Ref to track the latest isQuizActive state for unmount cleanup
  const isQuizActiveRef = useRef(isQuizActive);
  useEffect(() => {
    isQuizActiveRef.current = isQuizActive;
  }, [isQuizActive]);
  
  // Add lastAnswerCorrect to the ref as well if needed, or ensure dependencies using it are correct.
  // For now, direct usage of lastAnswerCorrect from context in render should be fine.

  const skillTitle = searchParams.get('skill');  const skillCategory = searchParams.get('category');
  const contentRef = useRef<HTMLDivElement>(null);
  const quizContentRef = useRef<HTMLDivElement>(null);// Add ref for quiz content section
  
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
    if (isQuizActive) {
      resetQuiz();
    }
    // ... rest of original handleSlideDeck logic
    if (!currentSkill?.title) return;
    setIsLoading(true);
    setShowAnswer(false); // Reset answer visibility for new question
    setIsSlideDeck(true);
    setQuestion(''); // Clear previous question while loading new one
    try {
      const response = await requestRefresher('slidedeck', currentSkill.title, currentSkill.category);
      setQuestion(response || 'Failed to load slidedeck. Please try again.');
    } catch (error) {
      console.error('Error fetching slidedeck:', error);
      setQuestion('Failed to load slidedeck. Please try again.');
    }
    setIsLoading(false);
  }, [currentSkill?.title, currentSkill?.category, isQuizActive, resetQuiz]);

  const handleRequestNewQuestion = useCallback(async (intendsNewQuizRound: boolean) => {
    if (!currentSkill?.title) return;

    setIsLoading(true);
    setShowAnswer(false);
    setIsSlideDeck(false);
    setQuestion('');
    
    if (intendsNewQuizRound && quizzesTaken < maxQuizzes) {
      if (!previousPath) { // Set previous path only if not already set (e.g. by "Start Quiz with this Q")
        setPreviousPath(location.pathname + location.search);
      }
      startQuiz(); // Sets isQuizActive = true, resets selectedAnswer for the new question
    } else if (!intendsNewQuizRound && isQuizActive) {
      // If fetching a regular question while a quiz was active, effectively end the quiz mode for this question.
      // The quiz context's submitAnswer already sets isQuizActive to false.
      // If a user explicitly asks for a "New Question" (not "Next Quiz Question"), reset the quiz progression.
      resetQuiz();
    }


    try {
      const response = await requestRefresher(level, currentSkill.title, currentSkill.category); // Use level from context
      setQuestion(response || 'Failed to load question. Please try again.');
    } catch (error) {
      console.error('Error fetching question:', error);
      setQuestion('Failed to load question. Please try again.');
    }
    setIsLoading(false);
  }, [currentSkill, startQuiz, setPreviousPath, location.pathname, location.search, quizzesTaken, resetQuiz, isQuizActive, previousPath, level]);
  // Fetch initial question only when currentSkill changes and has a title
  useEffect(() => {
    if (currentSkill?.title) {
      if (!question && !isLoading && !isQuizActive) { // Fetch initial question if none exists, not loading, AND not in a quiz
        handleRequestNewQuestion(false); 
      }
    }
  }, [currentSkill, handleRequestNewQuestion, question, isLoading, isQuizActive]); // Added isQuizActive

  // Syntax highlighting effect
  useEffect(() => {
    if (!isLoading && question) {
      Promise.resolve().then(() => { // Microtask delay
        highlightCode();
      });
    }
  }, [question, isLoading, showAnswer, isQuizActive]); // Added isQuizActive to dependency array

  // Cleanup effect to reset quiz if user navigates away while quiz is active
  useEffect(() => {
    return () => {
      // Only reset if quiz was active at the point of unmount (or equivalent navigation)
      if (isQuizActiveRef.current) {
        // console.log("SkillsRefresherDetail unmounting with active quiz (checked via ref), resetting.");
        resetQuiz();
      }
    };
  }, [resetQuiz]); // resetQuiz is stable due to useCallback in context

  if (!currentSkill) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Skill not found. Please check the URL or go back to skills list.
        </Typography>
        <Button onClick={() => navigate('/skills')} sx={{ mt: 2 }}>Back to Skills</Button>
      </Container>
    );
  }  const htmlToRender = getProcessedQuestionHtml(
    question, 
    showAnswer,
    showAnswer && !isSlideDeck, // Only show feedback when answer is shown and not in slidedeck
    lastAnswerCorrect,  // Pass the correct/incorrect state
    maxQuizzes,
    quizzesTaken
  );

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectQuizAnswer(event.target.value);
  };
  const handleSubmitQuizAnswer = () => {    // Get the current scroll position before any updates
    const currentScrollPosition = window.scrollY;

    if (selectedAnswer && question) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(question, 'text/html');
      const correctAnswerElement = doc.querySelector('.correct-answer');
      if (correctAnswerElement?.textContent) {
        submitQuizAnswer(correctAnswerElement.textContent);
      } else {
        // Fallback or error if correct answer can't be parsed
        console.warn("Could not parse correct answer from question HTML.");
        submitQuizAnswer("Error: Could not determine correct answer."); // Or handle differently
      }
    }

    // Use requestAnimationFrame to maintain scroll position during state update
    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollPosition);
      
      // After maintaining position, smoothly scroll to quiz status
      setTimeout(() => {
        const quizStatusElement = document.querySelector('.quiz-status');
        if (quizStatusElement) {
          quizStatusElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    });
    
    setShowAnswer(true); // Show answer section after submission
  };
  
  const handleStartThisQuestionAsQuiz = () => {
    if (quizzesTaken < maxQuizzes) {
      setPreviousPath(location.pathname + location.search);
      startQuiz(); // Makes the current question a quiz question
    } else {
      navigate('/quiz-results');
    }
  };  const handleShowAnswer = () => {
    // Get the current scroll position before any updates
    const currentScrollPosition = window.scrollY;

    // Use requestAnimationFrame to maintain scroll position during state update
    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollPosition);
      
      // After maintaining position, smoothly scroll to quiz status
      setTimeout(() => {
        const quizStatusElement = document.querySelector('.quiz-status');
        if (quizStatusElement) {
          quizStatusElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    });

    setShowAnswer(true);
  };

  const quizOptions = ['A', 'B', 'C', 'D'];
  const difficultyLevels = ['basic', 'intermediate', 'advanced'];

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
          <Typography> { isSlideDeck ? 'Loading Slidedeck... (please wait)' : 'Loading question...'}</Typography>
        ) : (
          <>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.light' }}>
              { isSlideDeck ? 'Slide Deck (basics of ' + currentSkill?.title + ')' : 'Practice Question'}
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
                  fontSize: '1.2rem', // Changed from 1.1rem
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
                  fontSize: '1.0rem', // Changed from 0.95rem
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
                },
                '& a': { // Style for anchor tags
                  color: 'primary.main',
                  textDecoration: 'underline',
                  '&:hover': {
                    color: 'primary.light',
                  },
                },
              }}
              dangerouslySetInnerHTML={{ __html: htmlToRender }}
            />

            {!isSlideDeck && isQuizActive && (
              <FormControl component="fieldset" sx={{ my: 2, p:2, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
                <FormLabel component="legend" sx={{ color: 'primary.light', mb: 1 }}>Choose an answer:</FormLabel>
                <RadioGroup row aria-label="quiz-option" name="quiz-option-group" value={selectedAnswer || ''} onChange={handleOptionChange}>
                  {quizOptions.map((option) => (
                    <FormControlLabel 
                      key={option} 
                      value={option} 
                      control={<Radio sx={{ color: 'primary.light', '&.Mui-checked': { color: 'secondary.main' } }} />} 
                      label={option} 
                      sx={{ color: 'text.secondary' }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}            {/* Button Container: Adjusted for new layout */}
            <Box sx={{ mt: 3 }}>
              {/* First row of buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                {/* Left-aligned: Start Quiz Button */}
                <Box>
                  {!isSlideDeck && !isQuizActive && !showAnswer && quizzesTaken < maxQuizzes && (
                    <Button
                      variant="contained"
                      onClick={handleStartThisQuestionAsQuiz}
                      disabled={isLoading || !question}
                      sx={{ backgroundColor: '#FFC107', color: 'black', '&:hover': { backgroundColor: '#FFA000'} }}
                    >
                      Start Quiz (This Q)
                    </Button>
                  )}
                </Box>

                {/* Right-aligned group */}
                <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
                  <Button
                    variant="contained"
                    onClick={isQuizActive && !showAnswer ? handleSubmitQuizAnswer : handleShowAnswer}
                    disabled={isLoading || showAnswer || !question || isSlideDeck || (isQuizActive && !selectedAnswer && !showAnswer)}
                    sx={{ 
                      backgroundColor: (isQuizActive && !showAnswer) ? '#007bff' : '#4CAF50', 
                      color: 'white',
                      '&:hover': { backgroundColor: (isQuizActive && !showAnswer) ? '#0056b3' : '#388E3C'}
                    }}
                  >
                    {isQuizActive && !showAnswer ? 'Submit Answer' : 'Show Answer'}
                  </Button>                  {showAnswer && !isSlideDeck && (
                    quizzesTaken < maxQuizzes ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleRequestNewQuestion(!!previousPath)}
                        disabled={isLoading}
                        sx={{ backgroundColor: '#2196F3', '&:hover': { backgroundColor: '#1976D2'} }}
                      >
                        Next Question
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/quiz-results')}
                        disabled={isLoading}
                        sx={{ backgroundColor: '#2196F3', '&:hover': { backgroundColor: '#1976D2'} }}
                      >
                        View Results
                      </Button>
                    )
                  )}

                  {/* "New Practice Question" button visibility changed here */}
                  {!isSlideDeck && (!previousPath || !showAnswer) && (
                    <Button // General "New Question" - distinct from "Next Quiz Question"
                      variant="contained"
                      color="info"
                      onClick={() => handleRequestNewQuestion(false)} // Always fetches a non-quiz question, resets quiz if active
                      disabled={isLoading} // isSlideDeck is implicitly handled by the outer condition
                      sx={{ backgroundColor: '#17a2b8', '&:hover': { backgroundColor: '#117a8b'} }}
                    >
                      {!isQuizActive && !showAnswer && !isSlideDeck ? 'Next Question' : 'End Quiz'}
                    </Button>
                  )}
                    <Button
                    variant="outlined"
                    onClick={() => { resetQuiz(); navigate('/skills'); }}
                    sx={{ borderColor: 'primary.main', color: 'primary.main', '&:hover': { borderColor: 'primary.light', backgroundColor: 'rgba(255, 255, 255, 0.08)'} }}
                  >
                    Done (Back to Skills)
                  </Button>
                </Stack>
              </Box>

              {/* Second row for Slidedeck button and Level dropdown */}
              <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center" sx={{ mt: 1 }}>
                <Typography variant="body1" sx={{ color: 'white', mr: 1 }}>Level:</Typography>
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel id="level-select-label" sx={{ color: 'black' }}></InputLabel>
                  <Select
                    labelId="level-select-label"
                    id="level-select"
                    value={level}
                    label=""
                    onChange={(e) => setLevel(e.target.value as string)}
                    disabled={isLoading || isQuizActive} // Disable if loading or quiz is active
                    sx={{
                      backgroundColor: 'lightblue',
                      color: 'black',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black', // Ensure border is visible against lightblue
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'black', // Dropdown arrow color
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black', // Border color when focused
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black', // Border color on hover
                      },
                    }}
                  >
                    {difficultyLevels.map((levelName) => (
                      <MenuItem 
                        key={levelName} 
                        value={levelName} 
                        sx={{ color: 'black',  backgroundColor: 'lightblue', }} // Ensure menu item text is black
                      >
                        {levelName.charAt(0).toUpperCase() + levelName.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleSlideDeck} // handleSlideDeck now also calls resetQuiz if active
                  disabled={isLoading || isSlideDeck}
                  sx={{ backgroundColor: '#FF9800', '&:hover': { backgroundColor: '#F57C00'} }}
                >
                  Slidedeck (The Basics)
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};
