import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Chatbox from '../components/Chatbox';
import { Box, IconButton } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { isAuthenticated, logout } from '../services/authService'; // Import isAuthenticated and logout

export default function MainLayout({ children, showHeader = true, showFooter = true }) {
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState(isAuthenticated()); // State for authentication status

  const toggleChatbox = () => {
    setIsChatboxOpen(!isChatboxOpen);
  };

  // Function to handle logout and update auth status
  const handleLogout = async () => {
    await logout(); // Call the logout function from authService
    setAuthStatus(false); // Update the auth status state
  };

  return (
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}> {/* Ensure relative positioning for fixed children */}
      {showHeader && (
        <Box style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1100, // Ensure header is above other content, adjust as needed
          backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
          backdropFilter: 'blur(5px)', // Apply a blur effect
          WebkitBackdropFilter: 'blur(5px)', // For Safari support
        }}>
          <Header authStatus={authStatus} onLogout={handleLogout} />
        </Box>
      )}
      <Box component="main" sx={{ flexGrow: 1, paddingTop: showHeader ? '64px' : 0 }}>
        {React.Children.map(children, (child) => {
          if (child && child.type && child.type.name === 'ProfilePage') {
            return React.cloneElement(child, { handleLogout });
          }
          return child;
        })}
      </Box>
      
      {/* Chat button positioned fixed at bottom right */}
      {!isChatboxOpen && (
        <IconButton
          aria-label="open chat"
          onClick={toggleChatbox}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20, // Keep it at right: 20 when chatbox is closed
            zIndex: 1200, // Ensure button is above chatbox
            bgcolor: '#0095f6', // Instagram blue
            color: 'white',
            '&:hover': { bgcolor: '#007ac1' },
            transition: 'right 0.3s ease-in-out', // Smooth transition for position change
          }}
        >
          <ChatBubbleOutlineIcon />
        </IconButton>
      )}

      {isChatboxOpen && <Chatbox onClose={toggleChatbox} />}

      {showFooter && <Footer />}
    </Box>
  );
};
