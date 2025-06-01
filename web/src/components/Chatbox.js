import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
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
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 400, // Increased width
        height: 500, // Increased height
        bgcolor: '#262626', // Dark background similar to Instagram
        color: 'white',
        borderRadius: 2, // Rounded corners
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Hide scrollbar on the main box
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1.5, // Increased padding
          borderBottom: '1px solid #3a3a3a', // Subtle separator
        }}
      >
        <Typography variant="h6">Chat with our AI coach</Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: '#aaa' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Message Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 1.5, // Increased padding
          display: 'flex',
          flexDirection: 'column',
          gap: 1, // Space between messages
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              bgcolor: msg.sender === 'user' ? '#0095f6' : '#3a3a3a',
              color: 'white',
              borderRadius: 2,
              p: '6px 10px',
              maxWidth: '80%',
              wordBreak: 'break-word',
            }}
          >
            <Typography variant="body2">{msg.text}</Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, borderTop: '1px solid #3a3a3a' }}> {/* Subtle separator */}
        <TextField
          placeholder="Message..."
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
              borderRadius: '25px',
              paddingRight: 0,
              bgcolor: '#3a3a3a',
              color: 'white',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '& input': {
              padding: '10px 14px',
            }
          }}
          InputProps={{
            style: { color: 'white' },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={!message.trim() || loading}
          sx={{
            bgcolor: '#0095f6', // Instagram blue
            '&:hover': { bgcolor: '#007ac1' },
            ml: 1, // Add some margin to the left of the icon button
          }}
        >
          <SendIcon sx={{ color: 'white' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Chatbox; 