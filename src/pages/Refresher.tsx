import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import MemoryIcon from '@mui/icons-material/Memory';
import CheckCircle from '@mui/icons-material/CheckCircle';

const Refresher: React.FC = () => {
  const [skillLevel, setSkillLevel] = React.useState('basic');

  const handleSkillLevelChange = (event: SelectChangeEvent) => {
    setSkillLevel(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card 
        variant="outlined" 
        sx={{ 
          maxWidth: 800, 
          mx: 'auto', 
          mb: 4,
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(59, 63, 85, 0.5)',
          backgroundColor: '#262b3d'
        }}
      >
        <CardContent sx={{ p: 4 }}>

            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <CheckCircle color="success" sx={{ mr: 2 }} />
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                   Cool New Feature! 
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, mb: 3 }}>
            <CodeIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <KeyboardIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <MemoryIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          </Box>
          
          <Typography variant="h4" component="div" align="center" gutterBottom sx={{ fontWeight: 500, mb: 2, color: '#a5b3ff' }}>
            Refresher
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Divider sx={{ width: '120px', height: '3px', backgroundColor: '#a5b3ff', opacity: 0.7 }} />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ textAlign: 'center', color: '#d1d8ff', marginBottom: '10px' }}>
              Select your skill level to get tailored syntax examples that you can type out to refresh your knowledge.
              <br />
                 <Divider sx={{ mb: 2, mt: 2 }} />
                
     Nothing better than typing out code. Try it out!
            </Typography>
          </Box>
          
          <FormControl 
            sx={{ 
              width: '250px', 
              mx: 'auto', 
              mb: 4,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                color: '#d1d8ff',
                '& fieldset': {
                  borderColor: 'rgba(165, 179, 255, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: '#a5b3ff',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#a5b3ff',
              },
              '& .MuiSvgIcon-root': {
                color: '#a5b3ff',
              }
            }}
          >
            <InputLabel id="skill-level-label">Skill Level</InputLabel>
            <Select
              labelId="skill-level-label"
              id="skill-level-select"
              value={skillLevel}
              label="Skill Level"
              onChange={handleSkillLevelChange}
            >
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
          
          <Divider sx={{ mt: 2, mb: 4 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => console.log('Button clicked - no action')}
              startIcon={<CodeIcon />}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Start {skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)} Refresher
            </Button>
          </Box>
          
          <Divider sx={{ mt: 4 }} />
        </CardContent>
      </Card>
    </Container>
  );
};

export default Refresher;