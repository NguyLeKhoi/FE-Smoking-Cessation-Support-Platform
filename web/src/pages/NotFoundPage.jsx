import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        textAlign: 'center',
        padding: 4,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '10rem', fontWeight: 'bold', color: '#3f332b' }}>
        404
      </Typography>
      <Typography variant="h4" gutterBottom sx={{ color: '#3f332b' }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        onClick={handleGoHome}
        sx={{
          bgcolor: '#3f332b',
          '&:hover': { bgcolor: '#5f5349' },
          color: 'white',
          padding: '10px 20px',
          fontSize: '1rem',
          borderRadius: '8px',
        }}
      >
        Go to Homepage
      </Button>
    </Box>
  );
};

export default NotFoundPage; 