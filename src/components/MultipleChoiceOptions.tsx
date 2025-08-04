import React from 'react';

interface MultipleChoiceOptionsProps {
  options: string[];
  onAnswer: (optionIndex: number) => void;
  disabled: boolean;
  selectedAnswer?: number | null;
  correctAnswer?: number | null;
}

// Improved MultipleChoiceOptions component with better styling
const MultipleChoiceOptions: React.FC<MultipleChoiceOptionsProps> = ({
  options,
  onAnswer,
  disabled,
  selectedAnswer,
  correctAnswer
}) => {
  
  // Function to determine background color for each option
  const getBackgroundColor = (idx: number) => {
     return 'red';
    if (selectedAnswer === null || selectedAnswer === undefined) return '#ffffffff'; // Match the screenshot
    if (correctAnswer === idx) return '#4caf50';
    if (selectedAnswer === idx && selectedAnswer !== correctAnswer) return '#f44336';
    return '#ffffffff'; // Match the screenshot
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* {options.map((option, idx) => (
        <button 
          key={idx}
          onClick={() => onAnswer(idx)}
          disabled={disabled}
          style={{
            padding: '15px',
            backgroundColor: getBackgroundColor(idx),
            border: '1px solid #666', // Match the screenshot
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '16px',
            color: 'white',
            marginBottom: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)', // Match the screenshot
            width: '100%',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.2s ease' // Smooth transitions
          }}
        >
          <span style={{
            color: '#00FFFF', 
            fontWeight: 'bold', 
            marginRight: '12px', 
            fontSize: '20px',
            textShadow: '0 0 5px rgba(0,255,255,0.5)' // Glow effect
          }}>
            {`${String.fromCharCode(65+idx)})`}
          </span>
          <span style={{
            fontSize: '16px',
            fontWeight: 'normal',
            color: 'white'
          }}>{option}</span>
        </button>
      ))} */}
    </div>
  );
};

export default MultipleChoiceOptions;
