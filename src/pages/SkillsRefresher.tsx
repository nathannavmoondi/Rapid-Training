/**
 * SkillsRefresher Component
 * 
 * Displays a grid of skill cards organized by category (Frontend, Backend, General).
 * Features a tab system for switching between skill categories and responsive card layout.
 * Each card shows the skill title, description, and key topics to learn.
 */
import { Box, Card, CardContent, Container, Tab, Tabs, Typography, Chip, Stack, 
  Radio, RadioGroup, FormControlLabel, FormControl, TextField, Button, IconButton, InputAdornment, Select, MenuItem, FormHelperText } from '@mui/material';
import { Close as CloseIcon, Search as SearchIcon, Clear as ClearIcon, Launch as LaunchIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { skills } from '../data/skills';
import { useQuiz } from '../contexts/quizContext';

type SkillCategory = 'all' | 'frontend' | 'backend' | 'general' | 'non-technology';
type CustomSkillCategory = Exclude<SkillCategory, 'all'>;
interface CustomSkill {
  id: string;
  title: string;
  category: SkillCategory;
  description: string;
  topics: string[];
}

export const SkillsRefresher = () => {
  const navigate = useNavigate();  
  const { setStartCourse, resetQuiz } = useQuiz();
  const [currentTab, setCurrentTab] = useState<SkillCategory>('all');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('general');
  const [newSkillTitle, setNewSkillTitle] = useState('');
  const [customSkills, setCustomSkills] = useState<CustomSkill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillDropdownValue, setSkillDropdownValue] = useState('');

  // Turn off course mode when entering homepage/skills page
  useEffect(() => {
    setStartCourse(0);
  }, [setStartCourse]);

  // Load custom skills from localStorage on component mount
  useEffect(() => {
    const savedSkills = localStorage.getItem('customSkills');
    if (savedSkills) {
      setCustomSkills(JSON.parse(savedSkills));
    }
    resetQuiz();
  }, []);
  // Combine built-in skills with custom skills and filter based on category
  const allSkills = [...skills, ...customSkills];
  const categoryFilteredSkills = currentTab === 'all' ? allSkills : allSkills.filter(skill => skill.category === currentTab);
  
  // Apply search filter
  const filteredSkills = searchTerm 
    ? categoryFilteredSkills.filter(skill => 
        skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : categoryFilteredSkills;

  const handleAddSkill = () => {
    if (!newSkillTitle.trim()) return;
    
    // Normalize the new skill title
    const normalizedTitle = newSkillTitle.trim();
    
    // Check if skill already exists
    const allSkills = [...skills, ...customSkills];
    const existingSkill = allSkills.find(s => s.title.toLowerCase() === normalizedTitle.toLowerCase());
    
    if (existingSkill) {
      alert('A skill with this name already exists');
      return;
    }

    const newSkill: CustomSkill = {
      id: `custom-${Date.now()}`,
      title: normalizedTitle,
      category: newSkillCategory,
      description: `Custom ${normalizedTitle} skill`,
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

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleSkillDropdownChange = (value: string, skillTitle: string, skillCategory: SkillCategory) => {
    console.log(`Selected ${value} for skill: ${skillTitle}`);
    // Add your logic here for handling different dropdown options
    switch (value) {
      case 'quiz':
        // Navigate to topics detail page - same as clicking the card
        navigate(`/topics/detail?skill=${encodeURIComponent(skillTitle)}&category=${skillCategory}`);
        break;
      case 'questions':
        // Navigate to topics detail page - same as clicking the card (same as quiz for now)
        navigate(`/topics/detail?skill=${encodeURIComponent(skillTitle)}&category=${skillCategory}`);
        break;
      case 'course':
        // Navigate to topics detail page with course mode
        navigate(`/topics/detail?skill=${encodeURIComponent(skillTitle)}&category=${skillCategory}&mode=course`);
        break;
      case 'slide-deck':
        // Navigate to topics detail page with slide deck mode
        navigate(`/topics/detail?skill=${encodeURIComponent(skillTitle)}&category=${skillCategory}&mode=slidedeck`);
        break;
      case 'youtube':
        // Navigate to topics detail page with youtube mode
        navigate(`/topics/detail?skill=${encodeURIComponent(skillTitle)}&category=${skillCategory}&mode=youtube`);
        break;
      case 'faq':
        // Navigate to FAQ page for this skill
        navigate(`/faq/${encodeURIComponent(skillTitle)}`);
        break;
      default:
        break;
    }
    setSkillDropdownValue(''); // Reset dropdown after selection
  };

  const isCustomSkill = (skillId: string) => skillId.startsWith('custom-');
  return (
    <Container sx={{ py: 2 }}>      
      {/* Header with Search */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Rapid Training -&nbsp;
          {currentTab === 'all' ? 'All Topics' :
           currentTab === 'frontend' ? 'Frontend Development' :
           currentTab === 'backend' ? 'Backend Development' :
           currentTab === 'non-technology' ? 'Non-Technology' :
           'General Concepts'}
        </Typography>

        <TextField
          size="small"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            minWidth: 250,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
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
            '& .MuiInputBase-input': {
              color: 'white',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClearSearch}
                  size="small"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={currentTab} 
          onChange={(_, newValue) => setCurrentTab(newValue as SkillCategory)}
          centered          sx={{
            '& .MuiTab-root': {
              fontSize: '1rem',
              fontWeight: 500
            }
          }}
        >
          <Tab label="All" value="all" />
          <Tab label="Frontend" value="frontend" />
          <Tab label="Backend" value="backend" />
          <Tab label="General" value="general" />
          <Tab label="Non-Technology" value="non-technology" />
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
              }            }}
            onClick={() => navigate(`/topics/detail?skill=${encodeURIComponent(skill.title)}&category=${skill.category}`)}
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
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mt: 'auto', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 1 }}>
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
                </Box>
                <FormControl size="small" sx={{ minWidth: 'auto' }}>
                  <Select
                    value={skillDropdownValue}
                    onChange={(e) => handleSkillDropdownChange(e.target.value, skill.title, skill.category)}
                    onClick={(e) => e.stopPropagation()}
                    displayEmpty
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      height: 32,
                      width: 'auto',
                      minWidth: 48,
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '& .MuiSelect-icon': {
                        color: 'white',
                        right: 4
                      },
                      '& .MuiSelect-select': {
                        paddingLeft: '8px',
                        paddingRight: '24px !important',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }
                    }}
                  >
                    <MenuItem value="">
                      <svg width="24" height="24" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                        <path d="M11 15H6l7-14v8h5l-7 14z" fill="#2196F3" stroke="black" strokeWidth="1" />
                      </svg>
                    </MenuItem>
                    <MenuItem value="quiz" sx={{ color: 'white' }}>Quiz</MenuItem>
                    <MenuItem value="questions" sx={{ color: 'white' }}>Questions</MenuItem>
                    <MenuItem value="course" sx={{ color: 'white' }}>Course</MenuItem>
                    <MenuItem value="slide-deck" sx={{ color: 'white' }}>Slide Deck</MenuItem>
                    <MenuItem value="youtube" sx={{ color: 'white' }}>Youtube</MenuItem>
                    <MenuItem value="faq" sx={{ color: 'white' }}>FAQ</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>      {/* Add Your Skill section */}
      <Box sx={{ p: 3, backgroundColor: 'rgba(144, 202, 249, 0.1)', borderRadius: 2, mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'primary.light', textAlign: 'center' }}>
          Add Your Topic
        </Typography>
        <Stack spacing={2.5}>
          <RadioGroup
            row
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
            sx={{ justifyContent: 'center' }}
          >
            <FormControlLabel value="general" control={<Radio />} label="General" />
            <FormControlLabel value="frontend" control={<Radio />} label="Frontend" />
            <FormControlLabel value="backend" control={<Radio />} label="Backend" />            
            <FormControlLabel value="non-technology" control={<Radio />} label="Non-Technology" />            
          </RadioGroup>
          
          <TextField
            fullWidth
            label="What would you like to learn?"
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
            Add Topic
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};
