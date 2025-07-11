import React, { useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography, CircularProgress } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import { GetIWantToLearn } from '../services/aiService';

export const IWantToLearn: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleLearn = async () => {
    setLoading(true);
    setResult(null);
    try {
      // Call the placeholder AI service method
      await GetIWantToLearn(topic);
      setResult('This feature is under development');
    } catch (e) {
      setResult('There was an error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center', background: 'rgba(45, 45, 45, 0.85)' }}>
        {/* Cool learning image/icon */}
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <MenuBookIcon sx={{ fontSize: 70, color: '#42a5f5', mb: 1 }} />
          <SchoolIcon sx={{ fontSize: 50, color: '#ffb74d' }} />
        </Box>
        <Typography variant="h4" sx={{ color: '#42a5f5', mb: 2, fontWeight: 'bold' }}>
          What would you like to learn?
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Enter topic"
          sx={{ mb: 3, background: 'white', borderRadius: 1, input: { color: 'black' } }}
        />
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleLearn}
          disabled={loading || !topic.trim()}
          sx={{ px: 5, py: 1.5, fontSize: '1.1rem', fontWeight: 600 }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Learn'}
        </Button>
        {result && (
          <Typography variant="h6" sx={{ mt: 4, color: '#ffb74d' }}>{result}</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default IWantToLearn;
