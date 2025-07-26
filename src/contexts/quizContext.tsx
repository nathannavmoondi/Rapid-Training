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
  inCoderTest: boolean;
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
  setInCoderTest: (inTest: boolean) => void;
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
  const [inCoderTest, setInCoderTest] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("english");


  // // Add effect to log quiz state changes
  // useEffect(() => {
  //   console.log('Quiz context - previousQuizzes updated:', previousQuizzes.length);    
  // }, [previousQuizzes]);

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
  }, []);

  const setPreviousPath = useCallback((path: string) => {
    setPreviousPath_internal(path);
  }, []);

  const setLevel = useCallback((newLevel: string) => {
    setLevelState(newLevel);
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
    inCoderTest,
    setInCoderTest,
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
