import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

export const languages: string[] = ["english", "french", "spanish"];

export interface SavedItem {
  label: string;
  html: string;
}

// Helper function to generate label from HTML content
export const generateLabelFromHtml = (html: string, defaultLabel: string): string => {
  try {
    // Remove HTML tags for basic text extraction
    const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Look for specific patterns to determine content type
    if (html.includes('class="slide"') || html.includes('# ') || html.includes('## ')) {
      // For slide deck: only topic
      const topicMatch = textContent.match(/^([^\n.!?]{1,60})/);
      return topicMatch ? topicMatch[1].trim() : 'Slide Deck';
    }
    
    if (html.includes('class="coding-question-container"') || html.includes('Solution') || html.includes('Approach') || html.includes('Implementation')) {
      // For coder test: programming language (skill level) - title
      let title = 'Coding Problem';
      let skillLevel = 'medium';
      
      // Extract programming language from context
      let language = 'General';
      if (html.toLowerCase().includes('javascript') || html.toLowerCase().includes('js')) language = 'JavaScript';
      else if (html.toLowerCase().includes('python') || html.toLowerCase().includes('py')) language = 'Python';
      else if (html.toLowerCase().includes('java') && !html.toLowerCase().includes('javascript')) language = 'Java';
      else if (html.toLowerCase().includes('c++') || html.toLowerCase().includes('cpp')) language = 'C++';
      else if (html.toLowerCase().includes('c#') || html.toLowerCase().includes('csharp')) language = 'C#';
      else if (html.toLowerCase().includes('typescript') || html.toLowerCase().includes('ts')) language = 'TypeScript';
      else if (html.toLowerCase().includes('go') || html.toLowerCase().includes('golang')) language = 'Go';
      else if (html.toLowerCase().includes('rust')) language = 'Rust';
      else if (html.toLowerCase().includes('swift')) language = 'Swift';
      else if (html.toLowerCase().includes('kotlin')) language = 'Kotlin';
      else if (html.toLowerCase().includes('ruby')) language = 'Ruby';
      else if (html.toLowerCase().includes('php')) language = 'PHP';
      
      // Extract skill level from the content
      if (html.toLowerCase().includes('easy') || html.toLowerCase().includes('beginner') || html.toLowerCase().includes('basic')) skillLevel = 'easy';
      else if (html.toLowerCase().includes('hard') || html.toLowerCase().includes('advanced') || html.toLowerCase().includes('expert')) skillLevel = 'hard';
      else if (html.toLowerCase().includes('medium') || html.toLowerCase().includes('intermediate')) skillLevel = 'medium';
      
      // Extract the actual problem title with aggressive cleaning
      // First, try to find content that looks like the actual problem title
      
      // Remove any "Coder Test" or "Title" prefixes from the text content
      let cleanedText = textContent
        .replace(/^Coder\s+Test\s*[-–—]?\s*/i, '')
        .replace(/^Title\s*[-–—]\s*/i, '')
        .replace(/^\s*[-–—]\s*/, '')
        .trim();
      
      // Look for patterns like "Title - Actual Problem Name"
      const titlePatternMatch = cleanedText.match(/^(?:Title\s*[-–—]\s*)?(.+?)(?:\s+Coding\s+Challenge)?/i);
      if (titlePatternMatch && titlePatternMatch[1].length > 3) {
        title = titlePatternMatch[1].trim();
      } else {
        // Try to extract from HTML h2 tags
        const h2Matches = html.match(/<h2[^>]*>([^<]+)<\/h2>/gi);
        if (h2Matches) {
          for (const h2 of h2Matches) {
            const content = h2.replace(/<[^>]*>/g, '').trim();
            if (content && !content.toLowerCase().includes('title') && content.length > 3) {
              title = content;
              break;
            }
          }
        }
        
        // If still no good title, look for common problem patterns
        if (title === 'Coding Problem') {
          const problemPatterns = [
            /Count\s+\w+/i,
            /Find\s+\w+/i,
            /Calculate\s+\w+/i,
            /Sort\s+\w+/i,
            /Search\s+\w+/i,
            /Binary\s+\w+/i,
            /Two\s+\w+/i,
            /Maximum\s+\w+/i,
            /Minimum\s+\w+/i,
            /Longest\s+\w+/i,
            /Shortest\s+\w+/i
          ];
          
          for (const pattern of problemPatterns) {
            const match = cleanedText.match(pattern);
            if (match) {
              title = match[0];
              break;
            }
          }
        }
      }
      
      // Final cleanup - remove unwanted prefixes and suffixes using regex
      title = title
        .replace(/^(Coder\s+Test\s*[-–—]?\s*|Title\s*[-–—]\s*|Problem\s*[-–—]\s*|Challenge\s*[-–—]\s*)/i, '')
        .replace(/\s*(Coding\s+Challenge|Programming\s+Challenge|Algorithm|Problem)\s*$/i, '')
        .replace(/^\s*[-–—]\s*/, '')
        .trim();
      
      // If title is still empty or too generic, use a fallback
      if (!title || title.length < 3 || title.toLowerCase() === 'coding problem') {
        title = 'Coding Challenge';
      }
      
      return `${language} (${skillLevel}) - ${title}`;
    }
    
    if (html.includes('class="option"') || html.includes('A)') || html.includes('B)') || html.includes('C)') || html.includes('D)')) {
      // For quiz: topic - skill level - title format
      const topicMatch = textContent.match(/^([^\n.!?]{1,60})/);
      let topic = topicMatch ? topicMatch[1].trim() : 'Quiz Topic';
      
      // Extract skill level
      let skillLevel = 'Intermediate';
      if (html.toLowerCase().includes('easy') || html.toLowerCase().includes('beginner')) skillLevel = 'Beginner';
      else if (html.toLowerCase().includes('hard') || html.toLowerCase().includes('advanced') || html.toLowerCase().includes('expert')) skillLevel = 'Advanced';
      else if (html.toLowerCase().includes('medium') || html.toLowerCase().includes('intermediate')) skillLevel = 'Intermediate';
      
      // Extract title (use the first question or heading if available)
      let title = 'Quiz';
      const h2Match = html.match(/<h2[^>]*>([^<]+)<\/h2>/i);
      if (h2Match && h2Match[1].trim()) {
        title = h2Match[1].trim()
          // Remove skill level words from the title since we already have it separately
          .replace(/\s*-?\s*(beginner|intermediate|advanced|easy|medium|hard)\s*$/i, '')
          .replace(/^(beginner|intermediate|advanced|easy|medium|hard)\s*-?\s*/i, '')
          .trim();
      } else {
        const questionMatch = html.match(/class="question-text"[^>]*>([^<]+)<\//i);
        if (questionMatch && questionMatch[1].trim()) {
          title = questionMatch[1].trim()
            // Remove skill level words from the title
            .replace(/\s*-?\s*(beginner|intermediate|advanced|easy|medium|hard)\s*$/i, '')
            .replace(/^(beginner|intermediate|advanced|easy|medium|hard)\s*-?\s*/i, '')
            .trim();
        }
      }
      
      return `${topic} - ${skillLevel} - ${title}`;
    }
    
    // For snippets: just the title (nothing before it)
    const snippetMatch = textContent.match(/^([^\n.!?]{1,60})/);
    return snippetMatch ? snippetMatch[1].trim() : defaultLabel;
    
  } catch (error) {
    console.error('Error generating label from HTML:', error);
    return defaultLabel;
  }
};

interface QuizContextType {
  score: number;
  quizzesTaken: number;
  maxQuizzes: number;  
  selectedAnswer: string | null;
  isQuizActive: boolean;
  previousPath: string | null;
  level: string;
  lastAnswerCorrect: boolean | null;
  skillDescription: string;
  startCourse: number;
  showYoutubeResources: boolean;
  previousQuizzes: string[];
  failedQuizzes: string[];
  coderTestQuestions: string[];
  currentCoderTestIndex: number;
  inCoderTest: boolean;
  userSavedSnippets: SavedItem[];
  savedUserCoderTests: SavedItem[];
  savedUserQuizzes: SavedItem[];
  savedUserSlidedecks: SavedItem[];
  setStartCourse: (value: number) => void;
  setMaxQuizzes: (value: number) => void;
  startQuiz: () => void;
  selectAnswer: (answer: string) => void;
  submitAnswer: (correctAnswer: string, userAnswer: string, quizHtml?: string) => void;
  resetQuiz: () => void;
  setPreviousPath: (path: string) => void;
  setLevel: (level: string) => void;
  setSkillDescription: (description: string) => void;
  setShowYoutubeResources: (show: boolean) => void;
  setPreviousQuizzes: React.Dispatch<React.SetStateAction<string[]>>;
  setFailedQuizzes: React.Dispatch<React.SetStateAction<string[]>>;
  setCoderTestQuestions: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrentCoderTestIndex: (index: number) => void;
  setInCoderTest: (inTest: boolean) => void;
  setUserSavedSnippets: React.Dispatch<React.SetStateAction<SavedItem[]>>;
  setSavedUserCoderTests: React.Dispatch<React.SetStateAction<SavedItem[]>>;
  setSavedUserQuizzes: React.Dispatch<React.SetStateAction<SavedItem[]>>;
  setSavedUserSlidedecks: React.Dispatch<React.SetStateAction<SavedItem[]>>;
  clearSavedSnippets: () => void;
  clearSavedCoderTests: () => void;
  clearSavedQuizzes: () => void;
  clearSavedSlidedecks: () => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) =>   
  {
  //the state values that what we want to share
  const [score, setScore] = useState(0);
  const [quizzesTaken, setQuizzesTaken] = useState(0);
  const [maxQuizzes, setMaxQuizzes] = useState(3); // Make maxQuizzes stateful
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [previousPath, setPreviousPath_internal] = useState<string | null>(null);  const [startCourse, setStartCourse] = useState(0);
  const [level, setLevelState] = useState<string>('intermediate');
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [skillDescription, setSkillDescription] = useState<string>('');
  const [showYoutubeResources, setShowYoutubeResources] = useState<boolean>(false);
  const [previousQuizzes, setPreviousQuizzes] = useState<string[]>([]);
  const [failedQuizzes, setFailedQuizzes] = useState<string[]>([]);
  const [coderTestQuestions, setCoderTestQuestions] = useState<string[]>([]);
  const [currentCoderTestIndex, setCurrentCoderTestIndex] = useState<number>(0);
  const [inCoderTest, setInCoderTest] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("english");
  
  // Initialize userSavedSnippets from localStorage
  const [userSavedSnippets, setUserSavedSnippets] = useState<SavedItem[]>(() => {
    try {
      const savedSnippets = localStorage.getItem('userSavedSnippets');
      if (savedSnippets) {
        const parsed = JSON.parse(savedSnippets);
        // Migrate old string array format to new SavedItem format
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === 'string') {
            return parsed.map((html: string) => ({
              label: generateLabelFromHtml(html, 'Snippet'),
              html
            }));
          }
        }
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Error loading saved snippets from localStorage:', error);
      return [];
    }
  });

  // Initialize savedUserCoderTests from localStorage
  const [savedUserCoderTests, setSavedUserCoderTests] = useState<SavedItem[]>(() => {
    try {
      const savedTests = localStorage.getItem('savedUserCoderTests');
      if (savedTests) {
        const parsed = JSON.parse(savedTests);
        console.log('waht is in localstorage', parsed);
        // Migrate old string array format to new SavedItem format
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === 'string') {
            return parsed.map((html: string) => ({
              label: generateLabelFromHtml(html, 'Coder Test'),
              html
            }));
          }
        }
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Error loading saved coder tests from localStorage:', error);
      return [];
    }
  });

  // Initialize savedUserQuizzes from localStorage
  const [savedUserQuizzes, setSavedUserQuizzes] = useState<SavedItem[]>(() => {
    try {
      const savedQuizzes = localStorage.getItem('savedUserQuizzes');
      if (savedQuizzes) {
        const parsed = JSON.parse(savedQuizzes);
        // Migrate old string array format to new SavedItem format
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === 'string') {
            return parsed.map((html: string) => ({
              label: generateLabelFromHtml(html, 'Quiz'),
              html
            }));
          }
        }
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Error loading saved quizzes from localStorage:', error);
      return [];
    }
  });

  // Initialize savedUserSlidedecks from localStorage
  const [savedUserSlidedecks, setSavedUserSlidedecks] = useState<SavedItem[]>(() => {
    try {
      const savedSlidedecks = localStorage.getItem('savedUserSlidedecks');
      if (savedSlidedecks) {
        const parsed = JSON.parse(savedSlidedecks);
        // Migrate old string array format to new SavedItem format
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === 'string') {
            return parsed.map((html: string) => ({
              label: generateLabelFromHtml(html, 'Slide Deck'),
              html
            }));
          }
        }
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Error loading saved slidedecks from localStorage:', error);
      return [];
    }
  });


  // // Add effect to log quiz state changes
  // useEffect(() => {
  //   console.log('Quiz context - previousQuizzes updated:', previousQuizzes.length);    
  // }, [previousQuizzes]);

  // Save userSavedSnippets to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('userSavedSnippets', JSON.stringify(userSavedSnippets));
      console.log('Quiz context - Saved snippets to localStorage:', userSavedSnippets.length);
    } catch (error) {
      console.error('Error saving snippets to localStorage:', error);
    }
  }, [userSavedSnippets]);

  // Save savedUserCoderTests to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('savedUserCoderTests', JSON.stringify(savedUserCoderTests));
      console.log('Quiz context - Saved coder tests to localStorage:', savedUserCoderTests.length);
    } catch (error) {
      console.error('Error saving coder tests to localStorage:', error);
    }
  }, [savedUserCoderTests]);

  // Save savedUserQuizzes to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('savedUserQuizzes', JSON.stringify(savedUserQuizzes));      
    } catch (error) {
      console.error('Error saving quizzes to localStorage:', error);
    }
  }, [savedUserQuizzes]);

  // Save savedUserSlidedecks to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('savedUserSlidedecks', JSON.stringify(savedUserSlidedecks));
      console.log('Quiz context - Saved slidedecks to localStorage:', savedUserSlidedecks.length);
    } catch (error) {
      console.error('Error saving slidedecks to localStorage:', error);
    }
  }, [savedUserSlidedecks]);

  const startQuiz = useCallback(() => {
    setIsQuizActive(true);
    setSelectedAnswer(null);
    setLastAnswerCorrect(null);
  }, []);

  const selectAnswer = useCallback((answer: string) => {
    setSelectedAnswer(answer);
  }, []);  
  
  const submitAnswer = (correctAnswer: string,  userAnswer: string, quizHtml?: string,) => {
      const correctAnswerLetter = correctAnswer.replace("Correct Answer: ", "").trim().charAt(0);
      const isCorrect = userAnswer.charAt(0).toUpperCase() === correctAnswerLetter.toUpperCase();
      console.log('Submitting answer:', userAnswer);
      console.log('Correct answer:', correctAnswer);
      //console.log('Submitting answer:', selectedAnswer, 'Correct answer:', correctAnswer, 'Is correct:', isCorrect);
      setLastAnswerCorrect(isCorrect);
      if (isCorrect) {
        setScore(prevScore => prevScore + 1);
      } else {
        //console.log('Adding failed question:', quizHtml);
        setFailedQuizzes(prev => [...prev, quizHtml || '']);
      }
      if (isQuizActive) 
      {        
        setQuizzesTaken(prevQuizzes => prevQuizzes + 1);
      }
      setSelectedAnswer(null); // Reset selected answer when submitting    
  }

  const resetQuiz = useCallback(() => {
    console.log('Resetting quiz...');
    setScore(0);
    setQuizzesTaken(0);
    setSelectedAnswer(null);
    setIsQuizActive(false);
    
    setLastAnswerCorrect(null);
    setSkillDescription(''); // Reset skill description when resetting quiz
    setPreviousPath_internal(null); // Reset previous path when resetting quiz
    console.log('Clearing previousQuizzes array');
    setPreviousQuizzes([]); // Reset previous quizzes when resetting quiz
    setFailedQuizzes([]); // Reset failed quizzes when resetting quiz
    setCoderTestQuestions([]); // Reset coder test questions when resetting quiz
    setCurrentCoderTestIndex(0); // Reset coder test index when resetting quiz
    // Don't reset saved snippets - they should persist across quiz resets
    // setUserSavedSnippets([]); // Reset saved snippets when resetting quiz
  }, []);

  const setPreviousPath = useCallback((path: string) => {
    setPreviousPath_internal(path);
  }, []);

  const setLevel = useCallback((newLevel: string) => {
    setLevelState(newLevel);
  }, []);  
  
  // Function to clear all saved snippets
  const clearSavedSnippets = useCallback(() => {
    setUserSavedSnippets([]);
    localStorage.removeItem('userSavedSnippets');
    console.log('Quiz context - Cleared all saved snippets');
  }, []);

  // Function to clear all saved coder tests
  const clearSavedCoderTests = useCallback(() => {
    setSavedUserCoderTests([]);
    localStorage.removeItem('savedUserCoderTests');
    console.log('Quiz context - Cleared all saved coder tests');
  }, []);

  // Function to clear all saved quizzes
  const clearSavedQuizzes = useCallback(() => {
    setSavedUserQuizzes([]);
    localStorage.removeItem('savedUserQuizzes');
    console.log('Quiz context - Cleared all saved quizzes');
  }, []);

  // Function to clear all saved slidedecks
  const clearSavedSlidedecks = useCallback(() => {
    setSavedUserSlidedecks([]);
    localStorage.removeItem('savedUserSlidedecks');
    console.log('Quiz context - Cleared all saved slidedecks');
  }, []);
  
  //identify to provider all that want to share with other components.  usualy specified in app.tsx 
  const contextValue = {
    score,
    quizzesTaken,
    maxQuizzes,
    setMaxQuizzes,
    selectedAnswer,
    isQuizActive,
    previousPath,
    level,
    lastAnswerCorrect,
    skillDescription,
    showYoutubeResources,
    startQuiz,
    selectAnswer,
    submitAnswer,
    resetQuiz,
    setPreviousPath,
    setLevel,
    setSkillDescription,
    setShowYoutubeResources,
    startCourse,
    setStartCourse,
    previousQuizzes,
    setPreviousQuizzes,
    failedQuizzes,
    setFailedQuizzes,
    coderTestQuestions,
    setCoderTestQuestions,
    currentCoderTestIndex,
    setCurrentCoderTestIndex,
    inCoderTest,
    setInCoderTest,
    userSavedSnippets,
    setUserSavedSnippets,
    savedUserCoderTests,
    setSavedUserCoderTests,
    savedUserQuizzes,
    setSavedUserQuizzes,
    savedUserSlidedecks,
    setSavedUserSlidedecks,
    clearSavedSnippets,
    clearSavedCoderTests,
    clearSavedQuizzes,
    clearSavedSlidedecks,
    language,
    setLanguage,
  };

  return <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>;
};

//for clients.  give them the context from useContext
export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
