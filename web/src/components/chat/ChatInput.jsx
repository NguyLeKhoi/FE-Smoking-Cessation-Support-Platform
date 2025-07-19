import React from 'react';
import { Box, TextField, Button } from '@mui/material';

const ChatInput = ({ input, setInput, handleSend, handleInputChange, disabled }) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            p: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'section.light',
        }}
    >
        <TextField
            placeholder="Type a message..."
            variant="outlined"
            fullWidth
            value={input}
            onChange={handleInputChange}
            onKeyDown={e => e.key === 'Enter' && input.trim() && handleSend()}
            sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: 5,
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
        <Button
            variant="contained"
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            sx={{
                bgcolor: 'primary.main',
                ml: 1,
                borderRadius: 5,
                p: '8px 16px',
                minWidth: 0,
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
            Send
        </Button>
    </Box>
);

export default ChatInput;
