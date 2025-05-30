import React from 'react';
import { Box } from '@mui/material';
import AuthBackground from '../assets/auth_background.jpg'; // Import the image

export default function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // Use the imported image variable in the url()
        backgroundImage: `url(${AuthBackground})`, // <--- Use the imported variable
        backgroundSize: 'cover', // Cover the entire box
        backgroundPosition: 'center', // Center the image
        // Consider adding a background color as a fallback if the image fails to load
        // backgroundColor: '#f5f5f5',
        py: 4,
      }}
    >
      {/* The content from login/signup pages will be rendered here */}
      {children}
    </Box>
  );
} 