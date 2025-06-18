/**
 * AlgorithmDetail Component
 * 
 * Displays detailed information about a specific algorithm, including:
 * - Title
 * - Description in a styled card
 * - Implementation with syntax highlighting
 * - Back navigation that preserves the language selection
 * 
 * Features:
 * - Syntax highlighting for both C# and JavaScript
 * - Responsive layout
 * - Custom styling for code display
 * - Error handling for non-existent algorithms
 */
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { algorithms } from '../data/algorithms';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Register the languages we need
//SyntaxHighlighter.registerLanguage('csharp', csharp);
//SyntaxHighlighter.registerLanguage('javascript', javascript);

export const AlgorithmDetail = () => {
  // Get algorithm ID from URL parameters
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the algorithm in our data
  const algorithm = algorithms.find(algo => algo.id === id);

  // Handle case where algorithm is not found
  if (!algorithm) {
    return (
      <Container>
        <Typography>Algorithm not found</Typography>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />}>
          Go Back
        </Button>
      </Container>
    );
  }

  console.log('LANGUAGE', algorithm.language);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        onClick={() => navigate(`/algorithms?lang=${algorithm.language}`)}
        startIcon={<ArrowBackIcon />}
        variant="contained"
        sx={{ 
          mb: 4,
          bgcolor: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.dark'
          }
        }}
      >
        Back to List
      </Button>

      <Typography variant="h3" gutterBottom sx={{ 
        color: 'primary.main',
        fontWeight: 'bold',
        mb: 4
      }}>
        {algorithm.title}
      </Typography>

      {/* Description Section */}
      <Paper sx={{ 
        p: 4,
        bgcolor: 'rgba(25, 118, 210, 0.08)',
        mb: 4
      }}>
        <Typography variant="h5" gutterBottom sx={{
          color: 'primary.main',
          fontWeight: 500,
          mb: 3
        }}>
          Description
        </Typography>
        <Typography variant="body1" sx={{ 
          lineHeight: 1.7,
          color: 'text.primary'
        }}>
          {algorithm.description}
        </Typography>
      </Paper>

      {/* Implementation Section */}
      <Paper sx={{ 
        bgcolor: '#1E1E1E',
        p: 0,
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ 
          p: 3,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          bgcolor: '#1E1E1E'
        }}>
          <Typography variant="h5" sx={{ 
            color: 'white',
            fontWeight: 500
          }}>
            Implementation
          </Typography>
        </Box>
        
        <Box sx={{ p: 0 }}>            <SyntaxHighlighter
            language={algorithm.language}
            style={vscDarkPlus}
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: '24px',
              background: '#1E1E1E',
              fontSize: '17px',
              lineHeight: '1.5',
              borderRadius: '0 0 8px 8px',
              fontFamily: "'Fira Code', 'Consolas', monospace",
            }}
            codeTagProps={{
              style: {
                fontFamily: "'Fira Code', 'Consolas', monospace",
              }
            }}
          >
            {algorithm.code}
          </SyntaxHighlighter>
        </Box>
      </Paper>
    </Container>
  );
};