import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, Avatar, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import FaceRetouchingNaturalOutlinedIcon from '@mui/icons-material/FaceRetouchingNaturalOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import motivationService from '../services/motivationService';

const Chatbox = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // State to store messages
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null); // Ref for scrolling to bottom

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages

    const userMessage = { text: message, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]); // Add user message
    setMessage(''); // Clear input field
    setLoading(true);

    try {
      const data = await motivationService.sendMessage(userMessage.text);
      console.log('API response data:', data); // Log the response data
      const aiResponse = { text: data.data.message, sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, aiResponse]); // Add AI response
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { text: 'Error getting response from AI.', sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]); // Add error message to state
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 400,
        height: 500,
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderRadius: 3,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 9999,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'section.light',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Zerotine AI coach
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: 'secondary.main' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Message Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          bgcolor: 'background.default',
        }}
      >
        {messages.length === 0 && (
          <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.7
          }}>
            <FaceRetouchingNaturalOutlinedIcon sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
            <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              Hello! I'm your AI coach. How can I help with your smoking cessation journey today?
            </Typography>
          </Box>
        )}

        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            {msg.sender === 'ai' && (
              <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 32, height: 32 }}>
                <FaceRetouchingNaturalOutlinedIcon sx={{ color: 'white', fontSize: 18 }} />
              </Avatar>
            )}
            <Paper
              elevation={0}
              sx={{
                bgcolor: msg.sender === 'user' ? 'primary.main' : 'section.light',
                color: msg.sender === 'user' ? 'white' : 'text.primary',
                borderRadius: 3,
                p: '10px 16px',
                maxWidth: '80%',
                wordBreak: 'break-word',
                boxShadow: msg.sender === 'user' ?
                  '0 2px 5px rgba(0, 0, 0, 0.1)' :
                  '0 2px 5px rgba(0, 0, 0, 0.05)',
                border: '1px solid',
                borderColor: msg.sender === 'user' ? 'primary.main' : 'divider',
              }}
            >
              <Typography variant="body2">{msg.text}</Typography>
            </Paper>
            {msg.sender === 'user' && (
              <Avatar sx={{ bgcolor: 'secondary.main', ml: 1, width: 32, height: 32 }}>
                <PersonOutlineIcon sx={{ color: 'white', fontSize: 18 }} />
              </Avatar>
            )}
          </Box>
        ))}

        {/* Typing indicator */}
        {loading && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'flex-start',
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 32, height: 32 }}>
              <FaceRetouchingNaturalOutlinedIcon sx={{ color: 'white', fontSize: 18 }} />
            </Avatar>
            <Paper
              elevation={0}
              sx={{
                bgcolor: 'section.light',
                color: 'text.primary',
                borderRadius: 3,
                p: '10px 16px',
                maxWidth: '80%',
                wordBreak: 'break-word',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: 'text.secondary',
                    borderRadius: '50%',
                    animation: 'pulse 1s infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 0.4 },
                      '50%': { opacity: 1 },
                      '100%': { opacity: 0.4 },
                    },
                  }}
                />
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: 'text.secondary',
                    borderRadius: '50%',
                    animation: 'pulse 1s infinite 0.2s',
                    '@keyframes pulse': {
                      '0%': { opacity: 0.4 },
                      '50%': { opacity: 1 },
                      '100%': { opacity: 0.4 },
                    },
                  }}
                />
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: 'text.secondary',
                    borderRadius: '50%',
                    animation: 'pulse 1s infinite 0.4s',
                    '@keyframes pulse': {
                      '0%': { opacity: 0.4 },
                      '50%': { opacity: 1 },
                      '100%': { opacity: 0.4 },
                    },
                  }}
                />
              </Box>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'section.light',
        }}
      >
        <TextField
          placeholder="Type a message..."
          variant="outlined"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !loading) {
              handleSendMessage();
            }
          }}
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              paddingRight: 0,
              bgcolor: 'background.default',
              color: 'text.primary',
              borderColor: 'divider',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
            '& input': {
              padding: '12px 14px',
              fontSize: '0.875rem',
            }
          }}
        />
        <IconButton
          onClick={handleSendMessage}
          disabled={!message.trim() || loading}
          sx={{
            bgcolor: 'primary.main',
            ml: 1,
            borderRadius: 2,
            p: '8px',
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            },
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: 'none',
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
            },
            transition: 'all 0.2s',
          }}
        >
          <SendIcon sx={{ color: 'white', fontSize: 20 }} />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default Chatbox;