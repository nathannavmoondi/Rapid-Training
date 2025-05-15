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
  startQuiz: () => void;
  selectAnswer: (answer: string) => void;
  submitAnswer: (correctAnswer: string) => void;
  resetQuiz: () => void;
  setPreviousPath: (path: string) => void;
  setLevel: (level: string) => void;
  setSkillDescription: (description: string) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [score, setScore] = useState(0);
  const [quizzesTaken, setQuizzesTaken] = useState(0);
  const [maxQuizzes] = useState(3); // Added maxQuizzes as a constant state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [previousPath, setPreviousPath_internal] = useState<string | null>(null);  const [level, setLevelState] = useState<string>('intermediate');
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [skillDescription, setSkillDescription] = useState<string>('');

  const startQuiz = useCallback(() => {
    setIsQuizActive(true);
    setSelectedAnswer(null);
    setLastAnswerCorrect(null);
  }, []);

  const selectAnswer = useCallback((answer: string) => {
    setSelectedAnswer(answer);
  }, []);

  const submitAnswer = useCallback((correctAnswer: string) => {
    if (selectedAnswer) {
      const correctAnswerLetter = correctAnswer.replace("Correct Answer: ", "").trim().charAt(0);
      const isCorrect = selectedAnswer.charAt(0).toUpperCase() === correctAnswerLetter.toUpperCase();
      
      setLastAnswerCorrect(isCorrect);
      
      if (isCorrect) {
        setScore(prevScore => prevScore + 1);
      } else {
        setScore(prevScore => prevScore);
      }
      setQuizzesTaken(prevQuizzes => prevQuizzes + 1);
      setIsQuizActive(false);
    }
  }, [selectedAnswer]);  const resetQuiz = useCallback(() => {
    setScore(0);
    setQuizzesTaken(0);
    setSelectedAnswer(null);
    setIsQuizActive(false);
    setLastAnswerCorrect(null);
    setSkillDescription(''); // Reset skill description when resetting quiz
    setPreviousPath_internal(null); // Reset previous path when resetting quiz
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
    selectedAnswer,
    isQuizActive,
    previousPath,
    level,
    lastAnswerCorrect,
    skillDescription,
    startQuiz,
    selectAnswer,
    submitAnswer,
    resetQuiz,
    setPreviousPath,
    setLevel,
    setSkillDescription,
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
