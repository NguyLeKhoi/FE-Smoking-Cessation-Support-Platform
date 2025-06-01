import React from 'react';
import { Box } from '@mui/material';

export default function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#202A33', // Changed background color
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: 4,
      }}
    >
      {/* The content from login/signup pages will be rendered here */}
      {children}
    </Box>
  );
} 