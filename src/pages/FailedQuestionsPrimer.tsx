import React, { useState } from 'react';
import { useQuiz } from '../contexts/quizContext';
import { getFailedQuestionsPrimer } from '../services/aiService';
import { Container, Typography, Paper, Box, Button, CircularProgress } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useNavigate } from 'react-router-dom';


const processHtmlWithSyntaxHighlighting = (html: string) => {
  const codeBlockRegex = /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  console.log('Processing HTML for syntax highlighting:', html);
  while ((match = codeBlockRegex.exec(html)) !== null) {
    console.log('Found code block:', match[0]);
    if (match.index > lastIndex) {
      const textPart = html.slice(lastIndex, match.index);
      parts.push(
        <div key={`text-${parts.length}`} dangerouslySetInnerHTML={{ __html: textPart }} />
      );
    }
    console.log('language', match[1], 'code', match[2]);
    const language = match[1];
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
        wrapLines={true}
        wrapLongLines={true}
        customStyle={{
          margin: '12px 0',
          padding: '16px',
          background: '#1E1E1E',
          fontSize: '18px',
          lineHeight: '1.4',
          borderRadius: '6px',
          fontFamily: "'Fira Code', 'Consolas', monospace",
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        {code}
      </SyntaxHighlighter>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < html.length) {
    const remainingText = html.slice(lastIndex);
    parts.push(
      <div key={`text-${parts.length}`} dangerouslySetInnerHTML={{ __html: remainingText }} />
    );
  }
  return parts;
};

const FailedQuestionsPrimer: React.FC = () => {
  const { skillDescription, userFailedQuizzes } = useQuiz();
  const [primerHtml, setPrimerHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {  resetQuiz  } = useQuiz();
  
  const navigate = useNavigate();

  const handleGoBack = () => {    
    resetQuiz(); // Reset quiz state when going back
    navigate('/topics'); // Navigate to topics page
  };

  React.useEffect(() => {
    handleGetPrimer();
  }, []);

  const handleGetPrimer = async () => {
    setLoading(true);
    setError(null);
    try {
      // Extract HTML content from FailedQuiz objects
      const failedQuestionHtmls = userFailedQuizzes.map(quiz => quiz.html);
      const html = await getFailedQuestionsPrimer(skillDescription, failedQuestionHtmls);
      setPrimerHtml(html);
    } catch (err) {
      setError('Failed to load primer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(45, 45, 45, 0.9)', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom color="primary.main">
          Failed Questions Primer
        </Typography>
        <Typography variant="h6" color="primary.light" gutterBottom>
          Skill: {skillDescription}
        </Typography>        {!primerHtml && <Button variant="contained" color="primary" onClick={handleGetPrimer} disabled={loading} sx={{ mb: 3 }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Get Primer'}
        </Button>}
        {error && <Typography color="error">{error}</Typography>}    

        {primerHtml && (        
           <Box sx={{ 
            mt: 3, 
            p: 3, 
            background: '#000000', 
            borderRadius: 2, 
            minHeight: 200,
            color: '#ffffff',
            '& h1': {
              color: 'lightcyan !important',
              fontSize: '2em',
              marginBottom: '0.5em'
            },
            '& h2': {
              color: 'lightcyan !important',
              fontSize: '1.5em',
              marginBottom: '0.5em'
            },
            '& h3': {
              color: 'lightcyan !important',
              fontSize: '1.25em',
              marginBottom: '0.5em'
            }
          }}>
            {processHtmlWithSyntaxHighlighting(primerHtml)}
          </Box>
        )}
      </Paper>
      <Button variant="contained" color="primary" onClick={() => handleGoBack()} sx={{ mt: 2 }}>
                Go Back To Topics
              </Button>
    </Container>
  );
};

export default FailedQuestionsPrimer;
