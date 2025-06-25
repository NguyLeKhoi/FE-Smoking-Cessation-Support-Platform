import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Chatbox from '../components/Chatbox';
import { Box, IconButton } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { isAuthenticated, logout } from '../services/authService'; 
import { Toaster } from 'react-hot-toast';

export default function MainLayout({ children, showHeader = true, showFooter = true, fab }) {
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState(isAuthenticated()); 

  const toggleChatbox = () => {
    setIsChatboxOpen(!isChatboxOpen);
  };

  // Function to handle logout and update auth status
  const handleLogout = async () => {
    await logout(); // Call the logout function from authService
    setAuthStatus(false); // Update the auth status state
  };

  return (
    <Box sx={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'background.paper' 
    }}>
      <Toaster />
      {showHeader && (
        <Box style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1100,
          backgroundColor: 'background.paper',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
        }}>
          <Header authStatus={authStatus} onLogout={handleLogout} />
        </Box>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingTop: showHeader ? '64px' : 0,
          backgroundColor: 'background.paper' 
        }}
      >
        {React.Children.map(children, (child) => {
          if (child && child.type && child.type.name === 'ProfilePage') {
            return React.cloneElement(child, { handleLogout });
          }
          return child;
        })}
      </Box>

      {/* Floating Action Button or Chat button positioned fixed at bottom right */}
      {fab ? (
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1200 }}>{fab}</Box>
      ) : !isChatboxOpen && (
        <IconButton
          aria-label="open chat"
          onClick={toggleChatbox}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1200,
            bgcolor: '#3f332b',
            color: 'white',
            '&:hover': { bgcolor: '#5f5349' },
            transition: 'right 0.3s ease-in-out',
          }}
        >
          <ChatBubbleOutlineIcon />
        </IconButton>
      )}

      {isChatboxOpen && <Chatbox onClose={toggleChatbox} />}

      {showFooter && <Footer />}
    </Box>
  );
}
