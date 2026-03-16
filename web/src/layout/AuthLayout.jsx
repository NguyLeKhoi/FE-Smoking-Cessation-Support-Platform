import React from 'react';
import { Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';

export default function AuthLayout({ children }) {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'background.paper' 
    }}>
      <Toaster />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: 'background.paper' 
        }}
      >
        {children}
      </Box>
    </Box>
  );
}