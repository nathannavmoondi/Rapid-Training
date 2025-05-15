import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const PromptDB: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [expanded, setExpanded] = useState(true);
  const handleFetch = async () => {
    try {
      setExpanded(false); // Collapse the table structure when fetching
      const queryText = prompt.trim() || 'show me all customers'; // Default query if empty
      const encodedPrompt = encodeURIComponent(queryText);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/sql/${encodedPrompt}`);
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error fetching data:', error);
      setResult('Error fetching results. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(45, 45, 45, 0.8)', borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary.main" textAlign="center">
          SQL Query Helper
        </Typography>
        
        <Typography variant="h6" gutterBottom color="primary.light" textAlign="center">
          Please type in what you wish to see
        </Typography>

        <Box sx={{ mt: 3, mb: 2 }}>          <TextField
            fullWidth
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="(show me all customers)"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleFetch();
              }
            }}
            variant="outlined"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(144, 202, 249, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(144, 202, 249, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>

        <Accordion 
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            mb: 2,
            '&.MuiAccordion-root': {
              '&:before': {
                backgroundColor: 'transparent',
              },
            },
            '& .MuiAccordionSummary-root': {
              backgroundColor: 'rgba(144, 202, 249, 0.1)',
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'primary.light' }} />}
          >
            <Typography color="primary.light">Table Structure</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ 
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              p: 2,
              borderRadius: 1,
              border: '1px solid rgba(144, 202, 249, 0.2)'
            }}>
              <Typography component="div" sx={{ color: '#e0e0e0' }}>
{`Customers Table Structure:

CustomerID: string;        # Unique identifier for each customer
CompanyName: string;       # Name of the customer's company
ContactName?: string;      # Full name of the contact person (this contains both first and last names)
ContactTitle?: string;     # Job title of the contact person
Address?: string;         # Street address
City?: string;           # City name
Region?: string;         # State or region
PostalCode?: string;     # Postal/ZIP code
Country?: string;        # Country name
Phone?: string;          # Phone number
Fax?: string;           # Fax number`}
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 2, fontStyle: 'italic' }}
        >
          Example: Show me all customers with first name is Maria
        </Typography>

        <Button
          variant="contained"
          onClick={handleFetch}
          fullWidth
          sx={{
            py: 1.5,
            mb: 3,
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          Fetch
        </Button>

        {result && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom color="primary.light">
              Results:
            </Typography>
            <TextField
              multiline
              fullWidth
              rows={10}
              value={result}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  fontFamily: 'monospace',
                  '& fieldset': {
                    borderColor: 'rgba(144, 202, 249, 0.3)',
                  },
                },
              }}
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};
