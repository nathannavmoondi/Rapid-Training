import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react'; // Added useCallback

interface QuizContextType {
  score: number;
  quizzesTaken: number;
  selectedAnswer: string | null;
  isQuizActive: boolean;
  previousPath: string | null;
  startQuiz: () => void;
  selectAnswer: (answer: string) => void;
  submitAnswer: (correctAnswer: string) => void;
  resetQuiz: () => void;
  setPreviousPath: (path: string) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [score, setScore] = useState(0);
  const [quizzesTaken, setQuizzesTaken] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [previousPath, setPreviousPath_internal] = useState<string | null>(null); // Renamed setter for clarity

  const startQuiz = useCallback(() => {
    setIsQuizActive(true);
    setSelectedAnswer(null); // Reset selected answer when a new quiz starts
  }, []); // setIsQuizActive and setSelectedAnswer are stable references

  const selectAnswer = useCallback((answer: string) => {
    // The calling component (SkillsRefresherDetail) already ensures this is called 
    // only when a quiz is active by conditionally rendering the RadioGroup.
    setSelectedAnswer(answer);
  }, []); // setSelectedAnswer is a stable reference

  const submitAnswer = useCallback((correctAnswer: string) => {
    if (selectedAnswer) {
      // Extract the letter from "Correct Answer: X"
      const correctAnswerLetter = correctAnswer.replace("Correct Answer: ", "").trim().charAt(0);
      if (selectedAnswer.charAt(0).toUpperCase() === correctAnswerLetter.toUpperCase()) {
        setScore(prevScore => prevScore + 1);
      } else {
        setScore(prevScore => prevScore); // Corrected: Decrement score for incorrect answer
      }
      setQuizzesTaken(prevQuizzes => prevQuizzes + 1);
      setIsQuizActive(false); // Deactivate quiz mode after submitting an answer
    }
  }, [selectedAnswer]); // Depends on selectedAnswer state

  const resetQuiz = useCallback(() => {
    setScore(0);
    setQuizzesTaken(0);
    setSelectedAnswer(null);
    setIsQuizActive(false);
    // previousPath is not reset here, as it's for navigation
  }, []); // All setters are stable references

  const setPreviousPath = useCallback((path: string) => {
    setPreviousPath_internal(path);
  }, []); // setPreviousPath_internal (useState setter) is a stable reference
  
  const contextValue = {
    score,
    quizzesTaken,
    selectedAnswer,
    isQuizActive,
    previousPath,
    startQuiz,
    selectAnswer,
    submitAnswer,
    resetQuiz,
    setPreviousPath,
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
