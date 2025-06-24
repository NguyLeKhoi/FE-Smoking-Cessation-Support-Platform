import React from 'react';
import { Box, Typography } from '@mui/material';
import Lottie from 'lottie-react';
import bouncingBlackCat from '../assets/animations/bouncing-black-cat.json';

const LoadingPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: '#fff',
        textAlign: 'center',
        padding: 4,
      }}
    >
      <Lottie
        animationData={bouncingBlackCat}
        loop
        style={{ width: 320, height: 320, marginBottom: 32 }}
      />
      <Typography variant="h5" sx={{ color: '#3f332b', fontWeight: 700 }}>
        Loading...
      </Typography>
      <Typography variant="body2" sx={{ mt: 1.5, color: '#7c6a58', fontSize: '1.05rem' }}>
        Please wait a moment
      </Typography>
    </Box>
  );
};

export default LoadingPage; 