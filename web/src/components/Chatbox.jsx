import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, Avatar, Paper, Button, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import FaceRetouchingNaturalOutlinedIcon from '@mui/icons-material/FaceRetouchingNaturalOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import motivationService from '../services/motivationService';
import { fetchCurrentUser } from '../services/userService';

const Chatbox = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // State to store messages
  const [loading, setLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [checkingMembership, setCheckingMembership] = useState(true);
  const messagesEndRef = useRef(null); // Ref for scrolling to bottom
  const navigate = useNavigate();

  // Check membership status on component mount
  useEffect(() => {
    const checkMembership = async () => {
      try {
        const response = await fetchCurrentUser();
        // Handle both response structures: response.data.data or response.data
        const userData = response?.data?.data || response?.data || {};
        setIsMember(userData.isMember === true);
      } catch (error) {
        console.error('Error checking membership:', error);
        toast.error('Error checking membership status');
        setIsMember(false);
      } finally {
        setCheckingMembership(false);
      }
    };
    
    checkMembership();
  }, []);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUpgradeMembership = () => {
    onClose?.();
    navigate('/subscription');
    toast.info('Please subscribe to a membership plan to access AI chat');
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages

    if (!isMember) {
      toast.error('Please subscribe to a membership plan to access AI chat');
      return;
    }

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
          position: 'relative',
        }}
      >
        {checkingMembership ? (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1
          }}>
            <CircularProgress size={30} />
          </Box>
        ) : !isMember ? (
          <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            p: 3
          }}>
            <LockIcon sx={{ fontSize: 50, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Premium Feature</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: '80%' }}>
              Unlock access to our AI coach by subscribing to a membership plan.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpgradeMembership}
              sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
            >
              Upgrade to Premium
            </Button>
          </Box>
        ) : messages.length === 0 ? (
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
        ) : null}

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
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'relative',
        }}
      >
        {!isMember && !checkingMembership && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              backdropFilter: 'blur(2px)',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpgradeMembership}
              startIcon={<LockIcon />}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Subscribe to Chat
            </Button>
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: 1, opacity: isMember ? 1 : 0.5 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={isMember ? "Type your message..." : "Subscribe to chat with AI coach"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            multiline
            maxRows={4}
            disabled={loading || !isMember}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'background.default',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: isMember ? 'primary.main' : 'divider',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: isMember ? 'primary.main' : 'divider',
                  borderWidth: 1,
                },
              },
              '& .Mui-disabled': {
                cursor: 'not-allowed',
                '&::placeholder': {
                  color: 'text.disabled',
                },
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!message.trim() || loading || !isMember}
            sx={{
              bgcolor: isMember ? 'primary.main' : 'action.disabled',
              color: 'white',
              '&:hover': {
                bgcolor: isMember ? 'primary.dark' : 'action.disabled',
              },
              '&.Mui-disabled': {
                bgcolor: 'action.disabled',
                color: 'action.disabled',
              },
            }}
          >
            <SendIcon sx={{ color: 'white', fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default Chatbox;