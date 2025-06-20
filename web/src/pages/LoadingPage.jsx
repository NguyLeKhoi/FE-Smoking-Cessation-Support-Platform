import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingPage = () => {
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
      <CircularProgress sx={{ color: '#3f332b', mb: 2 }} size={60} />
      <Typography variant="h5" sx={{ color: '#3f332b' }}>
        Loading...
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, color: '#666' }}>
        Please wait a moment.
      </Typography>
    </Box>
  );
};

export default LoadingPage; 