import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Card,
  CardContent
} from '@mui/material';
import {
  Code as CodeIcon,
  Construction as ConstructionIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';

const CoderTest: React.FC = () => {
  const [searchParams] = useSearchParams();
  const language = searchParams.get('language') || 'Unknown';
  const level = searchParams.get('level') || 'Unknown';

  // Capitalize first letter for display
  const formatText = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const getLanguageDisplayName = (lang: string) => {
    switch (lang) {
      case 'csharp': return 'C#';
      case 'javascript': return 'JavaScript';
      case 'cpp': return 'C++';
      case 'python': return 'Python';
      case 'java': return 'Java';
      default: return formatText(lang);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
            mb: 2
          }}
        >
          Coder Test
        </Typography>
        
        <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            fontWeight: 'medium'
          }}
        >
          {getLanguageDisplayName(language)} • {formatText(level)}
        </Typography>
      </Box>

      <Card
        sx={{
          maxWidth: 600,
          mx: 'auto',
          background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(123, 31, 162, 0.1) 100%)',
          border: '1px solid rgba(156, 39, 176, 0.2)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          {/* Icons */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <ConstructionIcon sx={{ fontSize: 48, color: '#9C27B0' }} />
            <CodeIcon sx={{ fontSize: 48, color: '#7B1FA2' }} />
            <PsychologyIcon sx={{ fontSize: 48, color: '#9C27B0' }} />
          </Box>

          {/* Main Status */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#9C27B0',
              mb: 3,
              fontSize: { xs: '1.8rem', sm: '2.2rem' }
            }}
          >
            Coming Soon
          </Typography>

          {/* Divider */}
          <Box
            sx={{
              width: 60,
              height: 3,
              background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
              borderRadius: 2,
              mx: 'auto',
              mb: 3
            }}
          />

          {/* Selected Parameters */}
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
              fontSize: '1.1rem',
              fontWeight: 'medium',
              mb: 2
            }}
          >
            Selected Configuration:
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body1"
              sx={{
                color: '#9C27B0',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}
            >
              Language: {getLanguageDisplayName(language)}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#7B1FA2',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}
            >
              Level: {formatText(level)}
            </Typography>
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
              fontSize: '1rem',
              fontStyle: 'italic'
            }}
          >
            LeetCode-style coding challenges will be available here soon!
          </Typography>

          {/* Coming Soon Badge */}
          <Paper
            sx={{
              display: 'inline-block',
              mt: 3,
              px: 3,
              py: 1,
              background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
              color: 'white',
              borderRadius: 20,
              fontWeight: 'bold',
              fontSize: '0.9rem',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            Under Development
          </Paper>
        </CardContent>
      </Card>

      {/* Future Features Preview */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            mb: 2,
            fontWeight: 'medium'
          }}
        >
          Upcoming Features
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 2,
            maxWidth: 500,
            mx: 'auto'
          }}
        >
          {[
            'LeetCode Problems',
            'Show Answer Feature',
            'Copy to Editor',
            'Progress Tracking'
          ].map((feature, index) => (
            <Paper
              key={index}
              sx={{
                px: 2,
                py: 1,
                backgroundColor: 'rgba(156, 39, 176, 0.1)',
                border: '1px solid rgba(156, 39, 176, 0.2)',
                borderRadius: 2,
                color: '#9C27B0',
                fontSize: '0.9rem',
                fontWeight: 'medium'
              }}
            >
              {feature}
            </Paper>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default CoderTest;
