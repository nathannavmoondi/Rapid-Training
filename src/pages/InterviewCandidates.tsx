import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Card,
  CardContent
} from '@mui/material';
import {
  People as PeopleIcon,
  Construction as ConstructionIcon,
  BusinessCenter as BusinessIcon
} from '@mui/icons-material';

const InterviewCandidates: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
            mb: 2
          }}
        >
          Interview Candidates
        </Typography>
      </Box>

      <Card
        sx={{
          maxWidth: 700,
          mx: 'auto',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          {/* Icons */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <ConstructionIcon sx={{ fontSize: 48, color: '#667eea' }} />
            <PeopleIcon sx={{ fontSize: 48, color: '#764ba2' }} />
            <BusinessIcon sx={{ fontSize: 48, color: '#667eea' }} />
          </Box>

          {/* Main Status */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#667eea',
              mb: 3,
              fontSize: { xs: '1.8rem', sm: '2.2rem' }
            }}
          >
            Under Development
          </Typography>

          {/* Divider */}
          <Box
            sx={{
              width: 60,
              height: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              mx: 'auto',
              mb: 3
            }}
          />

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
              fontSize: '1.1rem',
              fontWeight: 'medium',
              mb: 3
            }}
          >
            This is where Managers can create quizzes for candidates.
          </Typography>

          {/* Features List */}
          <Box sx={{ textAlign: 'left', maxWidth: 500, mx: 'auto', mb: 3 }}>
            <ul style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '1rem', 
              lineHeight: '1.8',
              paddingLeft: '20px' 
            }}>
              <li>Create quizzes (custom or AI)</li>
              <li>Enter candidate information (name, email)</li>
              <li>Interview candidate in real-time</li>
              <li>Send candidate quiz url</li>
              <li>Watch their results in real-time (using SignalR)</li>
              <li>At end, be given their score</li>
            </ul>
          </Box>

          {/* Coming Soon Badge */}
          <Paper
            sx={{
              display: 'inline-block',
              mt: 2,
              px: 3,
              py: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 20,
              fontWeight: 'bold',
              fontSize: '0.9rem',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            Coming Soon
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
          Key Features
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 2,
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          {[
            'Real-time Monitoring',
            'Custom Quiz Builder',
            'Candidate Management',
            'Live Interview Mode',
            'Auto Scoring',
            'Performance Analytics'
          ].map((feature, index) => (
            <Paper
              key={index}
              sx={{
                px: 2,
                py: 1,
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                borderRadius: 2,
                color: '#667eea',
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

export default InterviewCandidates;
