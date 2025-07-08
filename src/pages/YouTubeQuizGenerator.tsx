import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper,
  CircularProgress
} from '@mui/material';
import { getYoutubeQuiz, getYoutubeSummaryAndTranscript } from '../services/youtubeService';

export const YouTubeQuizGenerator: React.FC = () => {

//   This error is caused by CORS (Cross-Origin Resource Sharing) restrictions. When you run your React app locally (http://localhost:3000), the browser blocks direct fetch requests to YouTube (https://www.youtube.com/...) because YouTube does not allow cross-origin requests from browsers for these resources.

// Specifically:

// The youtube-transcript library tries to fetch the transcript by making a direct HTTP request to YouTube from your browser.
// YouTube’s servers do not include the necessary CORS headers to allow this, so the browser blocks the request for security reasons.
// This is why you see errors like "No 'Access-Control-Allow-Origin' header is present" and "Failed to fetch".
// How to solve or work around this:

// Use a backend proxy:
// Move the transcript-fetching logic to your backend (Node.js/Express or serverless function). The backend is not subject to browser CORS restrictions and can fetch from YouTube, then return the transcript to your frontend.

// Use only public APIs:
// The YouTube Data API v3 can provide captions/transcripts, but only for videos where captions are public and available, and you need an API key. Even then, it’s not as straightforward as scraping the transcript.

// Rely on user-uploaded transcripts:
// Ask users to upload or paste the transcript, then process it in your app.

  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/watch?v=HlPyFmq3edw');
  const [isLoading, setIsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoId, setVideoId] = useState('');
  const [quizGenerated, setQuizGenerated] = useState(false);

  const extractVideoId = (url: string): string => {
    // Extract video ID from various YouTube URL formats
    const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url; // Return the ID or the original string if it's already an ID
  };

  const handleLoad = () => {
    if (!youtubeUrl.trim()) return;
    
    const extractedId = extractVideoId(youtubeUrl.trim());
    setVideoId(extractedId);
    setShowVideo(true);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      // First AI call: Get summary and transcript
      console.log('Step 1: Getting summary and transcript...');
      console.log('Using real YouTube transcript extraction...');
      const summaryAndTranscript = await getYoutubeSummaryAndTranscript(youtubeUrl);
      console.log('Summary and Transcript:', summaryAndTranscript);
      
      // Check if there was an error getting the transcript
      if (summaryAndTranscript.includes('Error:')) {
        // Display the error but don't fail completely
        console.warn('Transcript extraction had issues, but continuing...');
      }
      
      // Second AI call: Generate quiz using the summary and transcript
      console.log('Step 2: Generating quiz from summary and transcript...');
      const response = await getYoutubeQuiz(youtubeUrl, summaryAndTranscript);
      console.log('Generated Quiz HTML:', response);
      setQuizGenerated(true);
    } catch (error) {
      console.error('Error generating quiz:', error);
      // Show a more user-friendly error message
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}. Please check the console for more details.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2, 
          backgroundColor: 'rgba(45, 45, 45, 0.7)',
          textAlign: 'center'
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              color: '#42a5f5',
              fontWeight: 'bold',
              mb: 2
            }}
          >
            Create quizzes out of Youtube training videos!
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#ffb74d',
              fontStyle: 'italic'
            }}
          >
            (UNDER DEVELOPMENT)
          </Typography>
        </Box>

        {/* Cool graphic placeholder */}
        <Box sx={{ mb: 4, p: 3, bgcolor: 'rgba(25, 118, 210, 0.1)', borderRadius: 2 }}>
          <Typography variant="h1" sx={{ color: '#1976d2', fontSize: '4rem' }}>
            🎬📝
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Transform educational YouTube videos into interactive quizzes powered by AI
          </Typography>
        </Box>

        {/* Input Section */}
        <Box sx={{ mb: 4 }}>
          <TextField
            label="YouTube URL or Video ID"
            variant="outlined"
            fullWidth
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=VIDEO_ID or just VIDEO_ID"
            sx={{ 
              mb: 2, 
              backgroundColor: 'black', 
              borderRadius: 1, 
              input: { color: 'white' } 
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !showVideo && youtubeUrl.trim()) {
                handleLoad();
              }
            }}
          />
          
          {!showVideo && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoad}
              disabled={!youtubeUrl.trim()}
              sx={{ 
                mt: 1,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Load
            </Button>
          )}
        </Box>

        {/* YouTube Video Section */}
        {showVideo && videoId && (
          <Box sx={{ mb: 4 }}>
            <Box 
              sx={{ 
                position: 'relative',
                paddingBottom: '56.25%', // 16:9 aspect ratio
                height: 0,
                overflow: 'hidden',
                maxWidth: '100%',
                backgroundColor: '#000',
                borderRadius: 2
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allowFullScreen
              />
            </Box>

            {/* Generate Button */}
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleGenerate}
                disabled={isLoading}
                sx={{ 
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  backgroundColor: '#9c27b0',
                  '&:hover': {
                    backgroundColor: '#7b1fa2'
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    Generating Quiz...
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
            </Box>
          </Box>
        )}

        {/* Result Section */}
        {quizGenerated && (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
            <Typography variant="h5" sx={{ color: '#4caf50', mb: 2 }}>
              Thank you. This feature is still in development.
            </Typography>
            
          </Box>
        )}
      </Paper>
    </Container>
  );
};