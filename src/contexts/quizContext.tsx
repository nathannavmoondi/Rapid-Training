import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

export const languages: string[] = ["english", "french", "spanish"];

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
  userSavedSnippets: string[];
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
  setUserSavedSnippets: React.Dispatch<React.SetStateAction<string[]>>;
  clearSavedSnippets: () => void;
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
  const [userSavedSnippets, setUserSavedSnippets] = useState<string[]>(() => {
    try {
      const savedSnippets = localStorage.getItem('userSavedSnippets');
      return savedSnippets ? JSON.parse(savedSnippets) : [];
    } catch (error) {
      console.error('Error loading saved snippets from localStorage:', error);
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
    clearSavedSnippets,
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
