import React from 'react';
import { Box, Typography } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';
import '../styles/header.css';

interface PageHeaderProps {
  title?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title = 'Under Development' }) => {
  return (
    <Box className="app-header">
      <Box className="app-header-icons">
        <BuildIcon className="app-header-icon" />
        <SchoolIcon className="app-header-icon" />
        <ArticleIcon className="app-header-icon" />
      </Box>
      
      <Typography variant="h1" className="app-header-title">
        {title}
      </Typography>
      
      <hr className="app-header-separator" />
    </Box>
  );
};

export default PageHeader;
