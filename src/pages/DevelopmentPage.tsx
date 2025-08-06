import React from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import PageHeader from '../components/PageHeader';

const DevelopmentPage = () => {
  return (
    <>
      <PageHeader />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Coming Soon
          </Typography>
          <Typography variant="body1" paragraph>
            We're currently working on this exciting new feature. Our development team is putting together 
            the final touches to ensure you have the best possible experience.
          </Typography>
          <Typography variant="body1" paragraph>
            Check back soon for updates or subscribe to our newsletter to be notified when this feature launches.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary">
              Subscribe for Updates
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default DevelopmentPage;
