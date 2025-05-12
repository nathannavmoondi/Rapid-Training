/**
 * SkillsRefresher Component
 * 
 * Displays a grid of skill cards organized by category (Frontend, Backend, General).
 * Features a tab system for switching between skill categories and responsive card layout.
 * Each card shows the skill title, description, and key topics to learn.
 */
import { Box, Card, CardContent, Container, Tab, Tabs, Typography, Chip, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { skills } from '../data/skills';

type SkillCategory = 'frontend' | 'backend' | 'general';

export const SkillsRefresher = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<SkillCategory>('frontend');

  // Filter skills based on selected category
  const filteredSkills = skills.filter(skill => skill.category === currentTab);

  return (
    <Container sx={{ py: 2 }}>
      <Typography variant="h5" sx={{ mb: 0.5, color: 'primary.main', fontWeight: 'bold' }}>
        {currentTab === 'frontend' ? 'Frontend Development' :
         currentTab === 'backend' ? 'Backend Development' : 
         'General Concepts'}
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={currentTab} 
          onChange={(_, newValue) => setCurrentTab(newValue as SkillCategory)}
          centered
          sx={{
            '& .MuiTab-root': {
              fontSize: '1rem',
              fontWeight: 500
            }
          }}
        >
          <Tab label="Frontend" value="frontend" />
          <Tab label="Backend" value="backend" />
          <Tab label="General" value="general" />
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
        {filteredSkills.map((skill, index) => (
          <Card 
            key={skill.id} 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              height: '100%',              cursor: 'pointer',
              bgcolor: 'rgba(45, 45, 45, 0.7)',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 20px rgba(144, 202, 249, 0.2)',
                bgcolor: 'rgba(45, 45, 45, 0.9)'
              }
            }}
            onClick={() => navigate(`/skills/detail?skill=${skill.id}`)}
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
                  {skill.title}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {skill.description}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mt: 'auto' }}>
                {skill.topics.slice(0, 3).map((topic) => (
                  <Chip 
                    key={topic}
                    label={topic}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(144, 202, 249, 0.1)',
                      color: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'rgba(144, 202, 249, 0.2)'
                      }
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};
