/**
 * SkillsRefresher Component
 * 
 * Displays a grid of skill cards organized by category (Frontend, Backend, General).
 * Features a tab system for switching between skill categories and responsive card layout.
 * Each card shows the skill title, description, and key topics to learn.
 */
import { Box, Card, CardContent, Container, Tab, Tabs, Typography, Chip, Stack, 
  Radio, RadioGroup, FormControlLabel, FormControl, TextField, Button, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { skills } from '../data/skills';

type SkillCategory = 'frontend' | 'backend' | 'general';
interface CustomSkill {
  id: string;
  title: string;
  category: SkillCategory;
  description: string;
  topics: string[];
}

export const SkillsRefresher = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<SkillCategory>('frontend');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('frontend');
  const [newSkillTitle, setNewSkillTitle] = useState('');
  const [customSkills, setCustomSkills] = useState<CustomSkill[]>([]);

  // Load custom skills from localStorage on component mount
  useEffect(() => {
    const savedSkills = localStorage.getItem('customSkills');
    if (savedSkills) {
      setCustomSkills(JSON.parse(savedSkills));
    }
  }, []);

  // Combine built-in skills with custom skills
  const allSkills = [...skills, ...customSkills];
  const filteredSkills = allSkills.filter(skill => skill.category === currentTab);

  const handleAddSkill = () => {
    if (!newSkillTitle.trim()) return;

    const newSkill: CustomSkill = {
      id: `custom-${Date.now()}`,
      title: newSkillTitle,
      category: newSkillCategory,
      description: `Custom ${newSkillTitle} skill`,
      topics: ['Basic Concepts', 'Best Practices', 'Common Patterns', 'General Knowledge']
    };

    const updatedSkills = [...customSkills, newSkill];
    setCustomSkills(updatedSkills);
    localStorage.setItem('customSkills', JSON.stringify(updatedSkills));
    setNewSkillTitle('');
  };

  const handleDeleteSkill = (skillId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click navigation
    const updatedSkills = customSkills.filter(skill => skill.id !== skillId);
    setCustomSkills(updatedSkills);
    localStorage.setItem('customSkills', JSON.stringify(updatedSkills));
  };

  const isCustomSkill = (skillId: string) => skillId.startsWith('custom-');

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

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 4 }}>
        {filteredSkills.map((skill) => (
          <Card 
            key={skill.id} 
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
            onClick={() => navigate(`/skills/detail?skill=${skill.title}`)}
          >
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                  {skill.title}
                </Typography>
                {isCustomSkill(skill.id) && (
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleDeleteSkill(skill.id, e)}
                    sx={{ 
                      p: 0.5, 
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': {
                        color: '#ff4444',
                        backgroundColor: 'rgba(255, 68, 68, 0.1)'
                      }
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
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
      </Box>      {/* Add Your Skill section */}
      <Box sx={{ p: 3, backgroundColor: 'rgba(144, 202, 249, 0.1)', borderRadius: 2, mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'primary.light', textAlign: 'center' }}>
          Add Your Skill
        </Typography>
        <Stack spacing={2.5}>
          <RadioGroup
            row
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
            sx={{ justifyContent: 'center' }}
          >
            <FormControlLabel value="frontend" control={<Radio />} label="Frontend" />
            <FormControlLabel value="backend" control={<Radio />} label="Backend" />
            <FormControlLabel value="general" control={<Radio />} label="General" />
          </RadioGroup>
          
          <TextField
            fullWidth
            label="Skill Title"
            value={newSkillTitle}
            onChange={(e) => setNewSkillTitle(e.target.value)}
            variant="outlined"
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(144, 202, 249, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(144, 202, 249, 0.5)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(144, 202, 249, 0.7)',
              }
            }}
          />
          
          <Button
            variant="contained" 
            onClick={handleAddSkill}
            fullWidth
            sx={{ 
              py: 1.5,
              mt: 1,
              backgroundColor: 'primary.main',
              fontSize: '1rem',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            Add Skill
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};
