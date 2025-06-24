import React from 'react';
import { useQuiz } from '../contexts/quizContext'; // Import useQuiz

const Test2: React.FC = () => {

     const {         
        previousQuizzes, //most of these shoudl be local state
        setPreviousQuizzes
      } = useQuiz(); //from quizcontext

const [quizzes, setQuizzes] = React.useState<string[]>([]);
console.log('previousQuizzes:', previousQuizzes.length);
  return (
    <div style={{ padding: 32 }}>
      <h1>Test2 Page</h1>
      <p>This is the Test2 page, accessible at <code>/test2</code>.</p>
        <h2>Quizzes</h2>
        {quizzes.map((quiz, index) => (
          <div key={index} style={{ marginBottom: 16, padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
            <h3>{quiz}</h3>
            <p>Details about {quiz}...</p>  
            </div>
        ))}

      <button onClick={() => setQuizzes([...quizzes, `Quiz ${quizzes.length + 1}`])} style={{ padding: '8px 16px', fontSize: '16px' }}>
        Add Quiz
      </button>

           <h1>Context Page</h1>
      <p>This is the Context page, accessible at <code>/test2</code>.</p>
        <h2>Quizzes</h2>
        {previousQuizzes.map((quiz, index) => (
          <div key={index} style={{ marginBottom: 16, padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
            <h3>{quiz}</h3>
            <p>Details about {quiz}...</p>  
            </div>
  ))}

<button onClick={() => setPreviousQuizzes([...previousQuizzes, `Quiz ${previousQuizzes.length + 1}`])} style={{ padding: '8px 16px', fontSize: '16px' }}>
        Add Quiz
      </button>
    </div>
  );
};

export default Test2;
