/**
 * AlgorithmList Component
 * 
 * Displays a grid of algorithm cards organized by programming language (C# or JavaScript).
 * Features a tab system for switching between languages and responsive card layout.
 * 
 * Key features:
 * - Language tabs for C# and JavaScript
 * - Responsive grid layout (1 column on mobile, 2 columns on desktop)
 * - Animated cards with hover effects
 * - Preserves selected language when navigating back from detail view
 */
import { Box, Card, CardContent, Container, Tab, Tabs, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { algorithms } from '../data/algorithms';

export const AlgorithmList = () => {
  // State for tracking current language tab
  const [currentTab, setCurrentTab] = useState<'csharp' | 'javascript'>('javascript');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Effect to handle language selection persistence
  useEffect(() => {
    const lang = searchParams.get('lang');
    if (lang && (lang === 'csharp' || lang === 'javascript')) {
      setCurrentTab(lang);
    } else if (location.pathname === '/algorithms') {
      setCurrentTab('javascript');
    }
  }, [location, searchParams]);

  // Filter algorithms based on selected language
  const filteredAlgorithms = algorithms.filter(algo => algo.language === currentTab);

  return (
    <Container sx={{ py: 2 }}>
      <Typography variant="h4" sx={{ mb: 0.5, color: 'primary.main', fontWeight: 'bold' }}>
        {currentTab === 'csharp' ? 'C# Algorithms' : 'JavaScript Algorithms'}
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={currentTab} 
          onChange={(_, newValue) => setCurrentTab(newValue)}
          centered
          sx={{
            '& .MuiTab-root': {
              fontSize: '1.25rem',
              fontWeight: 500
            }
          }}
        >
          <Tab label="C#" value="csharp" />
          <Tab label="JavaScript" value="javascript" />
        </Tabs>
      </Box>
      
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr'
        },
        gap: 2
      }}>
        {filteredAlgorithms.map((algorithm, index) => (
          <Card 
            key={algorithm.id} 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              cursor: 'pointer',
              bgcolor: 'rgba(45, 45, 45, 0.7)',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 20px rgba(144, 202, 249, 0.2)',
                bgcolor: 'rgba(45, 45, 45, 0.9)'
              }
            }}
            onClick={() => navigate(`/algorithm/${algorithm.id}`)}
          >
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: '#0A1929',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {index + 1}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {algorithm.title}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {algorithm.description.length > 100 
                  ? `${algorithm.description.substring(0, 100)}...`
                  : algorithm.description}
              </Typography>
              
              <Box sx={{ mt: 'auto', textAlign: 'right' }}>
                <Typography 
                  component="span" 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  View details →
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};