import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { Container, Typography, Paper, Box, Button, Stack, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Select, MenuItem, InputLabel, IconButton, Tooltip } from '@mui/material'; // Added Select, MenuItem, InputLabel
import { CheckCircleOutline, HighlightOff, Chat as ChatIcon, YouTube, PictureAsPdf as PictureAsPdfIcon, Save as SaveIcon } from '@mui/icons-material'; // Added icons for feedback
import { toast } from 'react-toastify';
import { skills } from '../data/skills';
import type { Skill } from '../data/skills';
import { requestRefresher } from '../services/aiService';
import { getYoutubeResources } from '../services/resourceService';
import { Chat } from '../components/Chat';
import { SubTopicsDialog } from '../components/SubTopicsDialog';
import { useChat } from '../contexts/chatContext';
import { chatService } from '../services/chatService';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


import { downloadHtmlAsPdf } from '../services/pdfService';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/answer-section.css';
import { useQuiz, languages, generateLabelFromHtml } from '../contexts/quizContext'; // Import useQuiz and languages


// Helper function to process HTML for answer visibility and quiz status.  Add or remove sections.
const processQuestionHtml = (html: string, answerVisible: boolean, showFeedback: boolean = false, isCorrect: boolean | null = null,
   maxQuizzes: number, quizzesTaken: number, pdfExport: boolean): string => {    

  if (!html) return '';
  
  // Handle both answer box and explanation visibility
  const answerBoxRegex = /<div\s+[^>]*class="[^"]*\banswer-box\b[^"]*">[\s\S]*?<\/div>/gi;
  const explanationRegex = /<div\s+[^>]*class="[^"]*\bexplanation\b[^"]*">[\s\S]*?<\/div>/gi;
  if (!answerVisible) {
    html = html.replace(explanationRegex, '');
    html = html.replace(answerBoxRegex, '');
  } else {
    html = html.replace(explanationRegex, (match) => {
      return match.replace(/<div style="display:none">/g, '<div>');
    });
    html = html.replace(answerBoxRegex, (match) => {
      return match.replace(/<div style="display:none">/g, '<div>');
    });
  }
  if (showFeedback && isCorrect !== null && !pdfExport) { //later part says pdf export cheap fix
    console.log('in answer part', isCorrect);
      
    const feedbackContent = `      <div style="margin: 16px 0; padding: 16px; border: 2px solid ${isCorrect ? '#00FF00' : '#FF0000'}; border-radius: 4px; background-color: transparent; display: flex; align-items: center; justify-content: center">
        <span style="margin-right: 8px; color: ${isCorrect ? '#00FF00' : '#FF0000 !important'}; font-size: 24px;">
          ${isCorrect ? '✓' : '✕'}
        </span>
        <span style="font-size: 20px; color: ${isCorrect ? '#00FF00' : '#FF0000 !important'}">
          ${isCorrect ? 'Correct!' : 'Incorrect!!!'}
        </span>
      </div>
    `;
    html = html.replace(/<div class="quiz-status"><\/div>/, `<div class="quiz-status">${feedbackContent}</div>`);
  } else if (!showFeedback && !answerVisible) {
    // Show remaining questions when not showing feedback
    const remainingContent = `
      <div style="margin: 16px 0; padding: 8px; border: 1px solid grey; border-radius: 4px; text-align: center">
        <span style="color: white; font-size: 14px;">Questions remaining in this quiz: #NUM#</span>
      </div>
    `.replace('#NUM#', String((maxQuizzes ?? 5) - (quizzesTaken ?? 0)));
    // (not used in rendering)
  }
  return html;
};

export interface SkillsRefresherDetailProps {
  onChatToggle?: () => void;
  isChatOpen?: boolean;
}

export default function SkillsRefresherDetail({ onChatToggle, isChatOpen = false }: SkillsRefresherDetailProps) {  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  
  const { 
    score, 
    quizzesTaken,
    maxQuizzes,
    setMaxQuizzes,
    selectedAnswer,    isQuizActive, 
    level,
    lastAnswerCorrect,
    showYoutubeResources,
    startQuiz, 
    selectAnswer: selectQuizAnswer,
    submitAnswer: submitQuizAnswer,
    resetQuiz,
    setPreviousPath,
    previousPath,
    setLevel,
    setSkillDescription,
    setStartCourse,
    setShowYoutubeResources,
    startCourse,
    previousQuizzes, //most of these shoudl be local state
    setPreviousQuizzes,
    savedUserQuizzes,
    setSavedUserQuizzes,
    savedUserSlidedecks,
    setSavedUserSlidedecks,
    language,
    setLanguage
  } = useQuiz(); //from quizcontext

  const {setChatboxSkill, addExternalMessage } = useChat();
  //states

  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [currentSkill, setCurrentSkill] = useState<Skill | undefined>();

  // Chat functionality

  const [showAnswer, setShowAnswer] = useState(false); // Added state for answer visibility
  const [isSlideDeck, setIsSlideDeck] = useState(false); // Added state for slide deck
  const [youtubeContent, setYoutubeContent] = useState(''); // Added state for YouTube resources content
  const [isLoadingYoutube, setIsLoadingYoutube] = useState(false); // Added loading state for YouTube  
  const [isExplainingFurther, setIsExplainingFurther] = useState(false); // Added loading state for Explain Further
  const [showSubTopics, setShowSubTopics] = useState(false); // Added state for Sub Topics
  const [subTopicsDialogOpen, setSubTopicsDialogOpen] = useState(false); // Added state for Sub Topics Dialog  
  const [saveQuizSuccess, setSaveQuizSuccess] = useState(false); // Added state for quiz save feedback
  const [saveSlideDeckSuccess, setSaveSlideDeckSuccess] = useState(false); // Added state for slide deck save feedback
  const [pendingMode, setPendingMode] = useState<string | null>(null); // Track mode to trigger after skill is loaded

  const skillTitle = searchParams.get('skill');    
  const mode = searchParams.get('mode'); // Get mode parameter from URL
  const contentRef = useRef<HTMLDivElement>(null);
  
  let userSelectedOption: string = ''; // Track user-selected option for quiz questions 
  const quizOptions = ['A', 'B', 'C', 'D'];
  const difficultyLevels = ['basic', 'intermediate', 'advanced'];
  let  questionRawHtml = "";
  let userLanguage = language;

  //run upon startup
  useEffect(() => {    
    if (!skillTitle) {
      console.log('No skill title in URL');
      return;
    }
    try {
      //todo: just use url params.get('skill') and not localStorage
      const customSkillsJson = localStorage.getItem('customSkills');
      const customSkillsData = customSkillsJson ? JSON.parse(customSkillsJson) : []; // Renamed to avoid conflict
      const allSkills = [...skills, ...customSkillsData]; // Use renamed variable
      const decodedTitle = decodeURIComponent(skillTitle);
      const normalizedTitle = decodedTitle.trim();
      const foundSkill = allSkills.find(s => 
        s.title.trim().toLowerCase() === normalizedTitle.toLowerCase()
      );

      //important so we can get all the topic details like this is technology, general, etc.
      if (foundSkill) {
        setCurrentSkill(foundSkill);
        setChatboxSkill(foundSkill.title); // Update chat context with current skill
        
        // Set pending mode if provided in URL
        if (mode) {
          setPendingMode(mode);
        }
      } else {
        setCurrentSkill({ id: 'not-found', title: skillTitle, category: 'non-technology', description: skillTitle, topics: [] }); // Reset skill if not found
        //add toastr alert that skill was not found so creating generic course
        toast.info(`Topic not found: ${normalizedTitle}. Creating generic course.`);
        console.log('Skill not found:', normalizedTitle);
      }
    } catch (error) {
      console.error('Error finding skill:', error);
    }
  }, []);

  // Handle pending mode after skill is loaded
  useEffect(() => {
    if (!currentSkill || !pendingMode) return;
    
    const timer = setTimeout(() => {
      if (pendingMode === 'slidedeck') {
        // Reset any active quiz first
        if (isQuizActive) {
          resetQuiz();
        }
        // Trigger slide deck mode
        setIsLoading(true);
        setShowAnswer(false);
        setIsSlideDeck(true);
        setShowYoutubeResources(false);
        setQuestion(''); // Clear any existing question
        
        requestRefresher('slidedeck', currentSkill.title, currentSkill.category, userLanguage, startCourse)
          .then(response => {
            setQuestion(response || 'Failed to load slidedeck. Please try again.');
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error fetching slidedeck:', error);
            setQuestion('Failed to load slidedeck. Please try again.');
            setIsLoading(false);
          });
      } else if (pendingMode === 'youtube') {
        // Reset any active quiz first
        if (isQuizActive) {
          resetQuiz();
        }
        // Trigger YouTube mode
        setShowYoutubeResources(true);
        setIsSlideDeck(false);
        setShowAnswer(false);
        setQuestion(''); // Clear any existing question
        
        if (currentSkill?.title) {
          setIsLoadingYoutube(true);
          getYoutubeResources(currentSkill.title)
            .then(response => {
              setYoutubeContent(response || 'Failed to load YouTube resources. Please try again.');
              setIsLoadingYoutube(false);
            })
            .catch(error => {
              console.error('Error fetching YouTube resources:', error);
              setYoutubeContent('Failed to load YouTube resources. Please try again.');
              setIsLoadingYoutube(false);
            });
        }
      } else if (pendingMode === 'course') {
        // Reset any active quiz first
        if (isQuizActive) {
          resetQuiz();
        }
        // Trigger course mode
        setIsLoading(true);
        setShowAnswer(false);
        setIsSlideDeck(false);
        setShowYoutubeResources(false);
        setQuestion(''); // Clear any existing question
        
        // Clear localStorage for fresh course start
        localStorage.removeItem('previousContent');
        localStorage.removeItem('currentSection');
        
        // Set course mode and fetch course content
        setStartCourse(1);
        requestRefresher('', currentSkill.title, currentSkill.category, userLanguage, 1)
          .then(response => {
            setQuestion(response || 'Failed to load course content. Please try again.');
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error fetching course content:', error);
            setQuestion('Failed to load course content. Please try again.');
            setIsLoading(false);
          });
      }
      setPendingMode(null); // Clear pending mode after execution
    }, 200); // Increased delay to ensure other effects have run

    return () => clearTimeout(timer);
  }, [currentSkill, pendingMode, userLanguage, startCourse, setShowYoutubeResources, isQuizActive, resetQuiz, setStartCourse]);

  const handleSlideDeck = async () => {
    if (isQuizActive) {
      resetQuiz();
    }
    // ... rest of original handleSlideDeck logic
    if (!currentSkill?.title) return;
    setIsLoading(true);
    setShowAnswer(false); // Reset answer visibility for new question
    setIsSlideDeck(true);
    setShowYoutubeResources(false);
    setQuestion(''); // Clear previous question while loading new one
    try {
      const response = await requestRefresher('slidedeck', currentSkill.title, currentSkill.category, userLanguage, startCourse);
      setQuestion(response || 'Failed to load slidedeck. Please try again.');
    } catch (error) {
      console.error('Error fetching slidedeck:', error);
      setQuestion('Failed to load slidedeck. Please try again.');
    }    setIsLoading(false);
  };

  const handleYoutubeResources = async () => {
    if (isQuizActive) {
      resetQuiz();
    }
    setShowYoutubeResources(true);
    setIsSlideDeck(false);
    setShowAnswer(false);
    
    if (!currentSkill?.title) return;
    
    setIsLoadingYoutube(true);
    try {
      const response = await getYoutubeResources(currentSkill.title);
      setYoutubeContent(response || 'Failed to load YouTube resources. Please try again.');
    } catch (error) {
      console.error('Error fetching YouTube resources:', error);
      setYoutubeContent('Failed to load YouTube resources. Please try again.');
    }
    setIsLoadingYoutube(false);
  };

  //remmeber: callback  we call setState and being memoized it won't show latest value! if you use callback, make sure
  //dependencies are correct like previousquizzes!  wasted so many hours and ai was useless.
  const fetchNewQuestion = useCallback( async (intendsNewQuizRound: boolean) => {
    if (!currentSkill?.title) return;

    //think of this as init page load, so we reset everything
    setIsLoading(true);
    setShowAnswer(false);
    setIsSlideDeck(false);
    setShowYoutubeResources(false);
    setQuestion('');
    if (intendsNewQuizRound && quizzesTaken < maxQuizzes) {
      if (!previousPath) { // Set previous path only if not already set (e.g. by "Start Quiz with this Q")
        setPreviousPath(location.pathname + location.search);
      }
      if (currentSkill) {
        setSkillDescription(currentSkill.title); // Set skill description when starting a new quiz round
      }
      startQuiz(); // Sets isQuizActive = true, resets selectedAnswer for the new question
    } else if (!intendsNewQuizRound && isQuizActive) {
      // they clicked end quiz.  reset.
      console.log('Ending quiz mode for new question request');
      resetQuiz();
    }

    //load new question
    try {                  
      const response = await requestRefresher(level, currentSkill.title, currentSkill.category, userLanguage, startCourse, previousQuizzes); // Use level from context
      
      //save to previous quizzes
      if (!isSlideDeck && !showYoutubeResources && startCourse !== 1) {
        setPreviousQuizzes(prevQuizzes =>{ //more than 10 it gets too slow.
          if (prevQuizzes.length > 10) {
               return [...prevQuizzes.slice(-9), response];
          }        
        return [...prevQuizzes, response]
        });  // Store previous question if not in slidedeck or youtube mode
      }
      setQuestion(response || 'Failed to load question. Please try again.');
    } catch (error) {
      console.error('Error fetching question:', error);
      // For testing purposes, provide a sample question when API fails
      const sampleQuestion = `
<div class="question-container">
    <div class="question">
        <p>What is the primary purpose of React Hooks?</p>
    </div>    
    <div class="options">
        <div class="option"><span class="option-prefix">A)</span> To replace class components entirely</div>
        <div class="option"><span class="option-prefix">B)</span> To allow state and lifecycle features in functional components</div>
        <div class="option"><span class="option-prefix">C)</span> To improve performance of React applications</div>
        <div class="option"><span class="option-prefix">D)</span> To handle routing in React applications</div>
    </div>
    <div class="quiz-status"></div>
    <div class="answer-box">
        <div class="correct-answer">
            Correct Answer: B) To allow state and lifecycle features in functional components
        </div>
        <div class="explanation">
            <p>React Hooks were introduced to allow functional components to use state and other React features that were previously only available in class components.</p>
            <p>Hooks like useState, useEffect, and useContext enable functional components to manage local state, handle side effects, and access context, making them more powerful and flexible.</p>
            <p>This allows developers to write more concise and reusable code while maintaining the same functionality as class components.</p>
        </div>
    </div>
</div>`;
      setQuestion(sampleQuestion);
    }
    setIsLoading(false);
  },[currentSkill, startQuiz, setPreviousPath, location.pathname, location.search, quizzesTaken, resetQuiz, isQuizActive, previousPath, level, previousQuizzes, userLanguage]);
  
  // So when some button is clicked, it triggers a new question request 
  useEffect(() => {
    if (currentSkill?.title) {
      if (!question && !isLoading && !isQuizActive && !pendingMode && !isSlideDeck && !showYoutubeResources && startCourse === 0) { // Fetch initial question if none exists, not loading, AND not in a quiz, AND not in pending mode or special modes, AND not in course mode
        fetchNewQuestion(false); 
      }
    }  }, [currentSkill, fetchNewQuestion, question, isLoading, isQuizActive, pendingMode, isSlideDeck, showYoutubeResources, startCourse]); // Added startCourse

 

  if (!currentSkill) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Skill not found. Please check the URL or go back to skills list.
        </Typography>
        <Button onClick={() => navigate('/topics')} sx={{ mt: 2 }}>Back to Topics</Button>
      </Container>
    );  }

  // Function to process raw HTML from AI response
  const processRawHtml = (rawHtml: string): string => {
    if (!rawHtml) return '';
    
    // Convert \n to actual line breaks and clean up escaped characters
    return rawHtml
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\t/g, '\t');
  };  
 

  const htmlToRender = processQuestionHtml(
    processRawHtml(question), 
    showAnswer,
    showAnswer && !isSlideDeck, // Only show feedback when answer is shown, not in slidedeck, AND in quiz mode or course mode
     //isQuizActive ? lastAnswerCorrect : null,  // hide if not quiz mode
    lastAnswerCorrect,   // Pass the correct/incorrect state
    maxQuizzes,
    quizzesTaken,
    false
  );

  questionRawHtml = processQuestionHtml(
    processRawHtml(question), 
    true,
    true, // Only show feedback when answer is shown, not in slidedeck, AND in quiz mode or course mode
    null,  // Pass the correct/incorrect state
    maxQuizzes, // cheap shortcut to tell function this is a pdf export so don't show answer given
    quizzesTaken,
    true
  ); // Store processed HTML for PDF export

  // Simple function to render content with syntax highlighting
  const renderContentWithSyntaxHighlighting = (html: string) => {
    // Extract code blocks and their info
    const codeBlockRegex = /<pre><code class="language-([\w-]+)">([\s\S]*?)<\/code><\/pre>/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(html)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textPart = html.slice(lastIndex, match.index);
        parts.push(
          <div 
            key={`text-${parts.length}`}
            dangerouslySetInnerHTML={{ __html: textPart }}
          />
        );
      }

      // Add syntax highlighted code block
      let language = match[1];
      // Prism-react-syntax-highlighter uses 'bash' for shell, but sometimes 'sh' or 'shell' is used
      if (language === 'shell') language = 'bash';
      if (language === 'sh') language = 'bash';
      // Prism-react-syntax-highlighter uses 'markup' for html
      if (language === 'html') language = 'markup';

      const code = match[2]
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();

      parts.push(
        <SyntaxHighlighter
          key={`code-${parts.length}`}
          language={language}
          style={vscDarkPlus}
          showLineNumbers={false}
          customStyle={{
            margin: '12px 0',
            padding: '16px',
            background: '#1E1E1E',
            fontSize: '18px',
            lineHeight: '1.4',
            borderRadius: '6px',
            fontFamily: "'Fira Code', 'Consolas', monospace",
          }}
        >
          {code}
        </SyntaxHighlighter>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last code block
    if (lastIndex < html.length) {
      const remainingText = html.slice(lastIndex);
      parts.push(
        <div 
          key={`text-${parts.length}`}
          dangerouslySetInnerHTML={{ __html: remainingText }}
        />
      );
    }

    return parts;
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectQuizAnswer(event.target.value);
  };

  const handleSubmitQuizAnswer = () => {    // Get the current scroll position before any updates

    const currentScrollPosition = window.scrollY;
    console.log('select answer', userSelectedOption);
    
    if (question) {
      const processedQuestion = processRawHtml(question);
      const parser = new DOMParser();
      const doc = parser.parseFromString(processedQuestion, 'text/html');
      const correctAnswerElement = doc.querySelector('.correct-answer');
      if (correctAnswerElement?.textContent) {
        submitQuizAnswer(correctAnswerElement.textContent, userSelectedOption, question, skillTitle || 'Unknown Topic', level);
      } else {
        // Fallback or error if correct answer can't be parsed
        console.warn("Could not parse correct answer from question HTML.", processedQuestion);
        submitQuizAnswer("Error: Could not determine correct answer.", '', '', skillTitle || 'Unknown Topic', level); 
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
    if (quizzesTaken < maxQuizzes && currentSkill) {
      setPreviousPath(location.pathname + location.search);
      setSkillDescription(currentSkill.title); // Set the skill description
      startQuiz(); // Makes the current question a quiz question
    } else {
      navigate('/quiz-results');
    }
  };
  
  const handleShowAnswer = () => {
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
  
  const handleExplainFurther = async () => {
    if (!currentSkill || !question || isExplainingFurther) return;
    
    setIsExplainingFurther(true);
    
    try {
      // Add "thinking" message to chat BEFORE opening chat
      const thinkingMessage = {
        id: Math.random().toString(36).substring(7),
        text: "Thinking...",
        isUser: false,
        timestamp: new Date()
      };
      addExternalMessage(thinkingMessage);
      
      // Ensure chat is open only if it's not already open
      if (!isChatOpen) {
        onChatToggle?.();
        // Wait a bit for the chat to fully open before making API call
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Call AI with the explain further prompt
      const aiResponse = await chatService.explainQuizInDepth(
        currentSkill.title,
        question,
        language
      );
      
      // Add AI response to chat
      addExternalMessage(aiResponse);

      // Force scroll to top after a small delay to ensure the message is rendered
      setTimeout(() => {
        const chatContainer = document.querySelector('.chat-messages');
        if (chatContainer) {
          chatContainer.scrollTop = 0;
        }
      }, 100);
    } catch (error) {
      console.error('Failed to explain further:', error);
      const errorMessage = {
        id: Math.random().toString(36).substring(7),
        text: "Sorry, I encountered an error while trying to explain further. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      addExternalMessage(errorMessage);
    } finally {
      setIsExplainingFurther(false);
    }
  };

  const handleSubTopics = () => {
    setSubTopicsDialogOpen(true);
  };

  const handleSubTopicLearnMore = async (subTopic: string) => {
    if (!currentSkill || !subTopic) return;
    
    try {
      // Add "thinking" message to chat BEFORE opening chat
      const thinkingMessage = {
        id: Math.random().toString(36).substring(7),
        text: "Thinking...",
        isUser: false,
        timestamp: new Date()
      };
      addExternalMessage(thinkingMessage);
      
      // Ensure chat is open only if it's not already open
      if (!isChatOpen) {
        onChatToggle?.();
        // Wait a bit for the chat to fully open before making API call
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Call AI with the explain topic prompt
      const aiResponse = await chatService.explainTopicInDepth(
        currentSkill.title,
        subTopic,
        language
      );
      
      // Add AI response to chat
      addExternalMessage(aiResponse);

      // Force scroll to top after a small delay to ensure the message is rendered
      setTimeout(() => {
        const chatContainer = document.querySelector('.chat-messages');
        if (chatContainer) {
          chatContainer.scrollTop = 0;
        }
      }, 100);
    } catch (error) {
      console.error('Failed to explain sub topic:', error);
      const errorMessage = {
        id: Math.random().toString(36).substring(7),
        text: "Sorry, I encountered an error while trying to explain this topic. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      addExternalMessage(errorMessage);
    }
  };
  
  const handleStartCourse = async () => {    
    setIsLoading(true);
    setShowAnswer(false); // Reset answer visibility for new question    
    setShowYoutubeResources(false);
    setIsSlideDeck(false);
    setQuestion(''); // Clear previous question while loading new one
    try {
      if (startCourse === 0) {
        //get rid of local storage previous section
        localStorage.removeItem('previousContent');
        localStorage.removeItem('currentSection');
      }
      
      // Set startCourse to 1 and use the new value directly in requestRefresher
      setStartCourse(1);
      const response = await requestRefresher('', currentSkill.title, currentSkill.category, userLanguage, 1);
      setQuestion(response || 'Failed to load course content. Please try again.');
    } catch (error) {
      console.error('Error fetching course content:', error);
      setQuestion('Failed to load course content. Please try again.');
    }
    setIsLoading(false);
  };

  const handleEndCourse = () => {
    localStorage.removeItem('previousContent');
    localStorage.removeItem('currentSection');
    setStartCourse(0);
    resetQuiz();
    navigate('/topics');
    window.scrollTo(0, 0);
  };

  const getTitle = () => {

    if (isSlideDeck) {
     return 'Slide Deck (basics of ' + currentSkill?.title + ')'
    }

     if (isQuizActive) {
      return `Quiz Question ${quizzesTaken + 1} of ${maxQuizzes}: `;
    }

    if (showYoutubeResources) {
    return 'Youtube Resources for ' + currentSkill?.title;
    }

    if (startCourse === 1) {
      return 'Course Content for ' + currentSkill?.title;
    }

    return 'Practice Quiz';

  };

  // Handler for PDF download
  const handleDownloadPdf = async () => {
    if (contentRef.current) {
      // Clone the content node to avoid modifying the live DOM
      const clone = contentRef.current.cloneNode(true) as HTMLElement;
      try {
        await downloadHtmlAsPdf(clone, `${currentSkill?.title || 'Skill'}-RapidSkillAI.pdf`, currentSkill?.title || 'Skill');
      } catch (err) {
        toast.error('PDF export failed.');
      }
    } else {
      toast.error('Content not available for PDF export.');
    }
  };

  // Handler for saving quiz
  const handleSaveQuiz = () => {    
    try {
      // Just use the question content directly, the label generator will extract what it needs
      const content = question.trim();
      console.log('Question content length:', content.length);
      
      // Create a label with topic, skill level, and title
      const baseLabel = generateLabelFromHtml(content, 'Quiz');
      const label = `${currentSkill?.title || 'Topic'} - (${level}) - ${baseLabel}`;
      console.log('Generated label:', label);
      const savedItem = { label, html: content };
      setSavedUserQuizzes(prev => [...prev, savedItem]);
      setSaveQuizSuccess(true);
      
      // Reset success message after 2 seconds
      setTimeout(() => {
        setSaveQuizSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to save quiz: ', err);
    }
  };

  // Handler for saving slide deck
  const handleSaveSlideDeck = () => {
    try {
      // Create a formatted string with title and slide deck content
      const header = `${currentSkill?.title || 'Slide Deck'} - Slide Deck\n\n`;
      const fullContent = header + question.trim();
      
      const label = generateLabelFromHtml(fullContent, 'Slide Deck');
      const savedItem = { label, html: fullContent };
      setSavedUserSlidedecks(prev => [...prev, savedItem]);
      setSaveSlideDeckSuccess(true);
      
      // Reset success message after 2 seconds
      setTimeout(() => {
        setSaveSlideDeckSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to save slide deck: ', err);
    }
  };

  //main component
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      
      {!currentSkill ? (
        <Typography variant="h6" color="text.secondary" align="center">
          Loading topic details...
        </Typography>
      ) : (
        // main fragment
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom color="primary.main">
              {currentSkill.title} Rapid Skill AI
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {currentSkill.topics.length < 1 ? null : `Topic areas: ${currentSkill.topics.join(', ')}`}
            </Typography>
          </Box>

      {/* create main paper for page */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          backgroundColor: 'rgba(45, 45, 45, 0.7)', 
          borderRadius: 2 
        }}
      >        
      {isLoading && !question ? ( 
          <Typography>
            {isSlideDeck ? 'Loading Slidedeck... ' : 
             startCourse === 1 ? 'Loading Course...' : 'Loading question...'}
          </Typography>
        ) : null}
        
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ color: 'primary.light' }}>
                  {getTitle()}                
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* PDF icon button - always visible except in slide deck or course mode */}
                {!isSlideDeck && startCourse !== 1 && (
                  <Tooltip title="Download as PDF">
                    <IconButton
                      onClick={handleDownloadPdf}
                      sx={{
                        color: 'primary.light',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)'
                        },
                        mr: 1
                      }}
                    >
                      <PictureAsPdfIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {/* Save button - show for both Practice Question and Slide Deck */}
                <Tooltip title={isSlideDeck ? (saveSlideDeckSuccess ? "Slide deck saved!" : "Save slide deck") : (saveQuizSuccess ? "Quiz saved!" : "Save quiz")}>
                  <IconButton
                    onClick={() => {
                      if (isSlideDeck) {
                        handleSaveSlideDeck();
                      } else {
                        handleSaveQuiz();
                      }
                    }}
                    sx={{
                      color: isSlideDeck ? (saveSlideDeckSuccess ? '#4caf50' : 'primary.light') : (saveQuizSuccess ? '#4caf50' : 'primary.light'),
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                      },
                      mr: 1
                    }}
                  >
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                {/* Chat button - only show for Practice Question */}
                {!isSlideDeck && startCourse !== 1 && (
                  <Tooltip title={`Ask questions about ${currentSkill?.title || 'this topic'}`}>
                    <IconButton
                      onClick={onChatToggle}
                      sx={{
                        color: 'primary.light',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)'
                        }
                      }}
                    >
                      <ChatIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
            
            <Box
              ref={contentRef}
              className="question-content" 
              onClick={(e) => {
                // Check if we're not in quiz mode and clicked on an answer option                
                // use fancy code to see if an opption has been clicked in the question section
                if (!showAnswer) { //show answer not clicked yet
                  const target = e.target as HTMLElement;
                  const isOption = target.closest('.option') || // Check for direct option click
                                 target.closest('li'); // Check for list item click (options are often in li elements)
                  if (isOption) {
                    userSelectedOption = isOption.textContent || ''; // Store the selected option since no clue                     
                    handleSubmitQuizAnswer();
                    
                  }
                }
              }} //all the css for this box, maybe put into a css?
              sx={{ 
                color: '#fff', // Set default text color to white for this container
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
                  '&.punctuation': { color: '#d4d4d4' }                },
                '& a': { // Style for anchor tags
                  color: 'primary.main',
                  textDecoration: 'underline',
                  '&:hover': {
                    color: 'primary.light',
                  },
                },
              }}> 
              {/* box */}
     
              {/* //now if yotubemode, show youtube html otherwise show the html       */}
              {showYoutubeResources ? (
                <Box>
                  <Typography variant="h5" component="h2" sx={{ color: 'primary.main', mb: 3 }}>
                    YouTube Learning Resources for {currentSkill?.title}
                  </Typography>
                  {isLoadingYoutube ? (
                    <Typography>Loading YouTube resources...</Typography>
                  ) : (
                    <Box 
                      dangerouslySetInnerHTML={{ __html: youtubeContent }}
                      sx={{
                        '& iframe': {
                          maxWidth: '100%',
                          height: 'auto',
                          aspectRatio: '16/9',
                        },
                        '& .resource-item': {
                          marginBottom: 4,
                          padding: 2,
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        },
                        '& .video-info h3': {
                          color: 'primary.light',
                          marginTop: 2,
                          marginBottom: 1,
                        },
                        '& .video-info p': {
                          color: 'text.secondary',
                          lineHeight: 1.6,
                        }
                      }}
                    />
                  )}
                </Box>
              ) : 
              // otherwise show the question/course/slidedeck html
              (
                renderContentWithSyntaxHighlighting(htmlToRender)
              )}
            </Box>

            {/* now show the options (turned off for now) */}
            {(false) && !isSlideDeck && !showYoutubeResources && (isQuizActive || startCourse === 1) && !showAnswer && !isLoading && (
              <FormControl component="fieldset" sx={{ my: 2, p:2, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
                <FormLabel component="legend" sx={{ color: 'primary.light', mb: 1 }}>Choose an answer:</FormLabel>
                <RadioGroup 
                  row 
                  aria-label="quiz-option" 
                  name="quiz-option-group" 
                  value={selectedAnswer || ''} 
                  onChange={handleOptionChange}
                >
                  {quizOptions.map((option) => (
                    <FormControlLabel 
                      key={option} 
                      value={option} 
                      control={<Radio sx={{ color: 'primary.light', '&.Mui-checked': { color: 'secondary.main' } }} />} 
                      label={option} 
                      sx={{ 
                        color: 'text.secondary',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: 1
                        }
                      }}
                      onClick={() => {
                        if (isQuizActive || startCourse === 1) {
                          // In quiz mode, first set the answer
                          selectQuizAnswer(option);
                          // Then wait for state to be updated before submitting
                          userSelectedOption = option; // Store the selected option for later use
                          handleSubmitQuizAnswer();
                          
                        } else {
                          // Not in quiz mode, show the answer
                          handleShowAnswer();
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>            )}     
            
            {/* Button Container */}
            {!showYoutubeResources && !isLoading && !isLoadingYoutube && (
            <Box sx={{ mt: 3 }}>
              {/* First row of buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '7px' }}>
                {/* Left-aligned: Start Quiz Button */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {!isSlideDeck && !isQuizActive && !showAnswer && startCourse !== 1 && (
                    <>
                      <Button
                        variant="contained"
                        onClick={handleStartThisQuestionAsQuiz}
                        disabled={isLoading || !question}
                        sx={{ backgroundColor: '#FFC107', color: 'black', '&:hover': { backgroundColor: '#FFA000'}, height: 48, fontWeight: 700, fontSize: '1rem', boxShadow: 'none', borderRadius: '6px' }}
                      >
                        Start Quiz (This Q)
                      </Button>

                      <FormControl size="small" sx={{ minWidth: 160, ml: 0, height: 48 }}>
                        <Select
                          value={maxQuizzes}
                          onChange={e => setMaxQuizzes(Number(e.target.value))}
                          sx={{
                            backgroundColor: '#FFC107',
                            color: 'black',
                            height: 48,
                            fontWeight: 700,
                            fontSize: '1rem',
                            boxShadow: 'none',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            '& .MuiSelect-select': { display: 'flex', alignItems: 'center', height: 48, paddingTop: 0, paddingBottom: 0 },
                            '& .MuiSelect-icon': { color: 'black' }
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                backgroundColor: '#FFC107',
                                color: 'black',
                                fontWeight: 700,
                                fontSize: '1rem',
                              }
                            }
                          }}
                        >
                          {Array.from({ length: 18 }, (_, i) => i + 3).map(num => (
                            <MenuItem key={num} value={num}>{num} Questions</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </>
                  )}
                </Box>

                {/* bottom buttons */} 
                <Stack direction="row" spacing={'7px'} justifyContent="flex-end" flexWrap="wrap">
                  {(!showAnswer || (showAnswer && startCourse !== 1)) && (
                    <Button
                      variant="contained"
                      onClick={(isQuizActive || startCourse === 1) && !showAnswer ? handleSubmitQuizAnswer : handleShowAnswer}
                      disabled={isLoading || showAnswer || !question || isSlideDeck || (isQuizActive && !selectedAnswer && !showAnswer)}
                      sx={{ 
                        backgroundColor: (isQuizActive && !showAnswer) ? '#007bff' : '#4CAF50', 
                        color: 'white',
                        '&:hover': { backgroundColor: (isQuizActive && !showAnswer) ? '#0056b3' : '#388E3C'}
                      }}
                    >
                      {(isQuizActive || startCourse === 1) && !showAnswer ? 'Submit Answer' : 'Show Answer'}
                    </Button>
                  )}
                  
                  {/* Explain Further Button - appears when answer is shown */}
                  {showAnswer && !isSlideDeck && startCourse !== 1 && (
                    <Button
                      variant="contained"
                      onClick={handleExplainFurther}
                      disabled={isLoading || isExplainingFurther}
                      sx={{ 
                        backgroundColor: '#9C27B0', 
                        color: 'white',
                        '&:hover': { backgroundColor: '#7B1FA2'}
                      }}
                    >
                      {isExplainingFurther ? 'Explaining...' : 'Explain Further'}
                    </Button>
                  )}
                  
                  {showAnswer && !isSlideDeck &&  startCourse !== 1 && (
                    (quizzesTaken < maxQuizzes || !isQuizActive) ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => fetchNewQuestion(!!previousPath)}
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
                  {isQuizActive && (
                    <Button // General "New Question" - distinct from "Next Quiz Question"
                      variant="contained"
                      color="info"
                      onClick={() => fetchNewQuestion(false)} // Always fetches a non-quiz question, resets quiz if active
                      disabled={isLoading} // isSlideDeck is implicitly handled by the outer condition
                      sx={{ backgroundColor: '#17a2b8', '&:hover': { backgroundColor: '#117a8b'} }}
                    >
                     End Quiz
                    </Button>
                  )}

                  {startCourse !== 1 && (
                    <Button
                      variant="outlined"
                      onClick={() => { resetQuiz(); navigate('/topics'); }}
                      sx={{ borderColor: 'primary.main', color: 'primary.main', '&:hover': { borderColor: 'primary.light', backgroundColor: 'rgba(255, 255, 255, 0.08)'} }}
                    >
                      Done (Back to Topics)
                    </Button>
                  )}
                </Stack>
              </Box>
              
              {/* Second row for buttons */}
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '7px' }}>
                {startCourse === 1 && !isLoading && !isLoadingYoutube ? (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleEndCourse}
                      sx={{ 
                        backgroundColor: '#ff5252', 
                        color: 'white',
                        '&:hover': { backgroundColor: '#d32f2f' }
                      }}
                    >
                      End Course
                    </Button>                    
                    
                    <Box sx={{ display: 'flex', gap: '7px' }}>
                      <Button
                        variant="contained"
                        onClick={handleStartCourse}
                        disabled={isLoading || isQuizActive}
                        sx={{ backgroundColor: '#2196F3', '&:hover': { backgroundColor: '#1976D2'} }}
                      >
                        Next Section
                      </Button>
                    </Box>
                  </>
                ) : (                   
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', ml: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ color: 'white', mr: 1 }}>Level:</Typography>
                      <FormControl sx={{ minWidth: 120 }} size="small">
                        <InputLabel id="level-select-label" sx={{ color: 'black' }}></InputLabel><Select
                        labelId="level-select-label"
                        id="level-select"
                        value={level}
                        label=""
                        onChange={(e) => setLevel(e.target.value as string)}
                        disabled={isLoading || isQuizActive}
                        sx={{
                          backgroundColor: 'lightblue',
                          color: 'black',
                          '& -webkit-text-fill-color': {
                            color: 'black',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'black',
                          },
                          '& .MuiSvgIcon-root': {
                            color: 'black',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'black',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'black',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: '#d3d3d3',
                            color: '#808080',
                            '& .MuiSvgIcon-root': {
                              color: '#808080',
                            },
                          },
                        }}
                      >
                        {difficultyLevels.map((levelName) => (
                          <MenuItem key={levelName} value={levelName}>
                            {levelName}
                          </MenuItem>
                        ))}                    </Select>
                    </FormControl>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={handleYoutubeResources}
                      disabled={isLoading || isLoadingYoutube}
                      sx={{ 
                        backgroundColor: '#FF4444', 
                        color: 'white',
                        '&:hover': { backgroundColor: '#CC0000' },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <YouTube />
                      Resources
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleStartCourse}
                      disabled={isLoading || isQuizActive}
                      sx={{ backgroundColor: '#2196F3', '&:hover': { backgroundColor: '#1976D2'} }}
                    >
                      Start Course
                    </Button>                    {!isSlideDeck && (
                      <Button
                        variant="contained"
                        onClick={handleSlideDeck}
                        disabled={isLoading || isQuizActive}
                        sx={{ backgroundColor: '#FFC107', color: 'black', '&:hover': { backgroundColor: '#FFA000' } }}
                      >
                        Slide Deck (SUMMARY)
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
            )}
            
            {/* Third row: language dropdown with icons on right */}
            {!isSlideDeck && startCourse !== 1 && !showYoutubeResources && !isLoading && !isLoadingYoutube && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '7px' }}>
                {/* Sub Topics Button */}
                <Button
                  variant="contained"
                  onClick={handleSubTopics}
                  sx={{
                    backgroundColor: '#9C27B0',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1rem',
                    borderRadius: '6px',
                    '&:hover': { backgroundColor: '#7B1FA2' }
                  }}
                >
                  Sub Topics
                </Button>
                
                {/* Language dropdown */}
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  
                  <Select
                    labelId="language-select-label"
                    id="language-select"
                    value={language}
                    label="Language"
                    onChange={e => { userLanguage = e.target.value; setLanguage(e.target.value as string)}}
                    sx={{
                      backgroundColor: '#795548',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1rem',
                      borderRadius: '6px',
                      '& .MuiSelect-select': { display: 'flex', alignItems: 'center', color: 'white' },
                      '& .MuiSelect-icon': { color: 'white' }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: '#795548',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '1rem',
                        }
                      }
                    }}
                  >
                    {languages.map(lang => (
                      <MenuItem key={lang} value={lang} sx={{ color: 'white', backgroundColor: '#795548', '&:hover': { backgroundColor: '#5d4037' } }}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                {/* PDF and Chat icons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                  <Tooltip title="Download as PDF">
                    <IconButton
                      onClick={handleDownloadPdf}
                      sx={{
                        color: 'primary.light',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)'
                        }
                      }}
                    >
                      <PictureAsPdfIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={`Ask questions about ${currentSkill?.title || 'this topic'}`}>
                    <IconButton
                      onClick={onChatToggle}
                      sx={{
                        color: 'primary.light',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)'
                        }
                      }}
                    >
                      <ChatIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              
              </Box>
            )}

            {/* Button Container just for youtube resources page (eg: go back)*/}
            {showYoutubeResources && !isLoading && !isLoadingYoutube && (
              <Box sx={{ display: 'flex', gap: '7px', mt: 2 }}>
                <Button                  variant="contained"
                  onClick={() => fetchNewQuestion(false)}
                  sx={{ 
                    backgroundColor: 'blue', 
                    color: 'white',
                    '&:hover': { backgroundColor: 'darkblue' }
                  }}
                >
                  Go Back
                </Button>
              </Box>
            )}

            
          </>
      </Paper>
      
      {/* show course footer */}
      {startCourse === 1 && (
        <>
          <Typography 
            variant="h6" 
            align="center" 
            sx={{ 
              mt: 4, 
              mb: 1,
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 'bold'
            }}
          >
          
          </Typography>
          <Box 
            sx={{ 
              p: 3,
              backgroundColor: 'rgba(25, 118, 210, 0.15)',
              border: '1px solid rgba(25, 118, 210, 0.4)',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >            
          <Typography 
              variant="h6" 
              align="center" 
              sx={{ 
                color: '#90CAF9', 
                fontWeight: 'bold',
                mb: 2
              }}
            >
              Rapid Skill Training
            </Typography>
            <Typography 
              sx={{ 
                color: 'white',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                textAlign: 'center'
              }}
            >
              A new concept designed by Nathan Moondi to reinvent how we learn.  This approach aims to give the student
              little snippets of information, quiz them, then go to next part. They can do this repeatedly until they master it.
              Learn by snippet rather than by entire chapter or course. Easier on the brain and quick dopamine hits.
            </Typography>          </Box>
        </>
      )}
      
      {/* Chat Component */} 
      {/* Chat component is now rendered in App.tsx */}

      {/* Sub Topics Dialog */}
      <SubTopicsDialog
        open={subTopicsDialogOpen}
        onClose={() => setSubTopicsDialogOpen(false)}
        skillTitle={currentSkill?.title || ''}
        onLearnMore={handleSubTopicLearnMore}
      />
        </>
      )}
    </Container>
  );
};
