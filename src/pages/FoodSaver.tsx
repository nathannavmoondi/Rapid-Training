import { useState } from 'react';
import { Container, Typography, Paper, Box, Button, TextField } from '@mui/material';
import { getFoodSaverResults } from '../services/aiService';


export const FoodSaver = () => {
  const [foodItem, setFoodItem] = useState('');
  const [city, setCity] = useState('Toronto, Canada');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFindCheapestStores = async () => {
    setIsLoading(true);
    setError('');
    setResult('');
    try {
      const response = await getFoodSaverResults(foodItem, city);
      setResult(response || 'No results found.');
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, backgroundColor: 'rgba(45, 45, 45, 0.7)' }}>
        <Typography variant="h4" gutterBottom color="primary.main">
          Food Saver
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Find the cheapest stores for your food item.
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          (example: "skinless chicken breast" or "apples" or "Sealtest Homogenized 3.25% Milk, 1 L")
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ color: '#42a5f5' }}>
          I wrote this for myself as a helpful tool.
        </Typography>
        <Box sx={{ my: 3 }}>
          <TextField
            label="Food Item"
            variant="outlined"
            fullWidth
            value={foodItem}
            onChange={e => setFoodItem(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (!isLoading && foodItem.trim()) {
                  handleFindCheapestStores();
                }
              }
            }}
            disabled={isLoading}
            sx={{ mb: 2, backgroundColor: 'black', borderRadius: 1, input: { color: 'white' } }}
          />
          <TextField
            label="City"
            variant="outlined"
            fullWidth
            value={city}
            onChange={e => setCity(e.target.value)}
            disabled={isLoading}
            sx={{ mb: 2, backgroundColor: 'black', borderRadius: 1, input: { color: 'white' } }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFindCheapestStores}
            disabled={isLoading || !foodItem.trim()}
            sx={{ mt: 1 }}
          >
            {isLoading ? 'Searching...' : 'Find cheapest stores'}
          </Button>
        </Box>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
        )}
        {result && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" color="primary.light" gutterBottom>
              Cheapest Stores:
            </Typography>
            <div dangerouslySetInnerHTML={{ __html: result }} />
          </Box>
        )}
      </Paper>
    </Container>
  );
};
