import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

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
  setStartCourse: (value: number) => void;
  setMaxQuizzes: (value: number) => void;
  startQuiz: () => void;
  selectAnswer: (answer: string) => void;
  submitAnswer: (correctAnswer: string, quizHtml?: string) => void;
  resetQuiz: () => void;
  setPreviousPath: (path: string) => void;
  setLevel: (level: string) => void;
  setSkillDescription: (description: string) => void;
  setShowYoutubeResources: (show: boolean) => void;
  setPreviousQuizzes: React.Dispatch<React.SetStateAction<string[]>>;
  setFailedQuizzes: React.Dispatch<React.SetStateAction<string[]>>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  const startQuiz = useCallback(() => {
    setIsQuizActive(true);
    setSelectedAnswer(null);
    setLastAnswerCorrect(null);
  }, []);

  const selectAnswer = useCallback((answer: string) => {
    setSelectedAnswer(answer);
  }, []);  
  
  const submitAnswer = useCallback((correctAnswer: string, quizHtml?: string) => {
    if (selectedAnswer) {
      const correctAnswerLetter = correctAnswer.replace("Correct Answer: ", "").trim().charAt(0);
      const isCorrect = selectedAnswer.charAt(0).toUpperCase() === correctAnswerLetter.toUpperCase();
      //console.log('Submitting answer:', selectedAnswer, 'Correct answer:', correctAnswer, 'Is correct:', isCorrect);
      setLastAnswerCorrect(isCorrect);
      if (isCorrect) {
        setScore(prevScore => prevScore + 1);
      } else {
        //console.log('Adding failed question:', quizHtml);
        setFailedQuizzes(prev => [...prev, quizHtml || '']);
      }
      setQuizzesTaken(prevQuizzes => prevQuizzes + 1);
      setSelectedAnswer(null); // Reset selected answer when submitting
    }
  }, [selectedAnswer]);
  
  const resetQuiz = useCallback(() => {
    console.log('Resetting quiz...');
    setScore(0);
    setQuizzesTaken(0);
    setSelectedAnswer(null);
    setIsQuizActive(false);
    
    setLastAnswerCorrect(null);
    setSkillDescription(''); // Reset skill description when resetting quiz
    setPreviousPath_internal(null); // Reset previous path when resetting quiz
    setPreviousQuizzes([]); // Reset previous quizzes when resetting quiz
    setFailedQuizzes([]); // Reset failed quizzes when resetting quiz
  }, []);

  const setPreviousPath = useCallback((path: string) => {
    setPreviousPath_internal(path);
  }, []);

  const setLevel = useCallback((newLevel: string) => {
    setLevelState(newLevel);
  }, []);  
  
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
  };

  return <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>;
};

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
