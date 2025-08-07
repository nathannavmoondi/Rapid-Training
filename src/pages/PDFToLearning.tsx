import React, { useState, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon, 
  PictureAsPdf as PdfIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as ProcessIcon
} from '@mui/icons-material';

export const PDFToLearning: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setUploadSuccess(true);
        // Reset file input to allow selecting the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        alert('Please select a PDF file');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadSuccess(false);
  };

  const handleProcessFile = () => {
    // This is where you would implement the actual processing logic
    setIsProcessing(true);
    
    // Simulating a process with a timeout
    setTimeout(() => {
      setIsProcessing(false);
      // Additional logic would go here for actual processing
    }, 2000);
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
         <Box sx={{ 
                maxWidth: '100%', 
                margin: '0 auto',
                mb: 3
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 1
                }}>
                  <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                  <Typography variant="h6">
                    Cool New Feature!
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
              </Box>

      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ 
          color: 'white',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          mb: 2
        }}>
          <PdfIcon sx={{ fontSize: 45, color: '#1976d2' }} />
          PDF to Learning
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Transform your PDFs into interactive learning materials<br/>
        <span style={{ color: '#00bcd4', fontWeight: 600, marginLeft: 8 }}>
            (under development)
        </span>
          
        </Typography>
      </Box>

      {/* Main Content Card */}
      <Box sx={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        borderRadius: 4,
        p: 6
      }}>
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            mb: 3,
            fontWeight: 'medium',
            textAlign: 'center'
          }}
        >
          Please upload a PDF containing information you would like your team members to learn from, handle quizzes, summaries and ask questions again.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            mb: 4,
            textAlign: 'center'
          }}
        >
          Once uploaded, system will process it and send you email when finished
        </Typography>

        {/* File Upload Area */}
        <Box 
          sx={{ 
            border: '2px dashed rgba(255, 255, 255, 0.3)', 
            borderRadius: 2, 
            p: 4, 
            mb: 4, 
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: '#42a5f5',
              backgroundColor: 'rgba(66, 165, 245, 0.1)'
            }
          }}
          onClick={handleUploadClick}
        >
          <input
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          
          {!selectedFile ? (
            <>
              <CloudUploadIcon sx={{ fontSize: 60, color: '#42a5f5', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Click to Upload PDF
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Maximum file size: 50MB
              </Typography>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PdfIcon sx={{ fontSize: 40, color: '#1976d2', mr: 1 }} />
                <Typography variant="h6" sx={{ color: 'white', mr: 2, maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedFile.name}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleRemoveFile(); 
                  }}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </Typography>
              {uploadSuccess && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', color: '#4CAF50' }}>
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">File uploaded successfully</Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Process Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={handleProcessFile}
            disabled={!selectedFile || isProcessing}
            variant="contained"
            size="large"
            startIcon={isProcessing ? <CircularProgress size={24} color="inherit" /> : <ProcessIcon />}
            sx={{
              backgroundColor: '#4CAF50',
              color: 'white',
              fontWeight: 'bold',
              px: 6,
              py: 1.5,
              fontSize: '1.2rem',
              borderRadius: 3,
              textTransform: 'none',
              '&:hover': { 
                backgroundColor: '#388E3C',
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
              },
              transition: 'all 0.2s ease-in-out',
              '&:disabled': {
                backgroundColor: 'rgba(76, 175, 80, 0.3)',
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
          >
            {isProcessing ? 'Processing...' : 'Process PDF'}
          </Button>
        </Box>

        {/* Information Box */}
        <Box sx={{ mt: 4, p: 3, backgroundColor: 'rgba(25, 118, 210, 0.1)', borderRadius: 2, border: '1px solid rgba(25, 118, 210, 0.3)' }}>
          <Typography variant="subtitle1" sx={{ color: '#42a5f5', fontWeight: 'bold', mb: 1 }}>
            What happens next?
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Our system will analyze your PDF, extract key information, and create learning materials. You'll receive an email notification once processing is complete.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default PDFToLearning;
