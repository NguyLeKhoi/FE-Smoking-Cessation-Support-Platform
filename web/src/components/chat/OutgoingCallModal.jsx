import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { CallEnd, Phone } from '@mui/icons-material';

const OutgoingCallModal = ({ open, callee, onCancel }) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={false}
      onClose={handleCancel}
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%)',
          color: 'white',
          textAlign: 'center',
          p: 2,
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        {/* Callee Avatar */}
        <Box sx={{ mb: 3 }}>
          <Avatar
            src={callee?.avatar || ''}
            alt={callee?.username || ''}
            sx={{
              width: 100,
              height: 100,
              mx: 'auto',
              mb: 2,
              border: '4px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            {callee?.username ? callee.username.charAt(0).toUpperCase() : '?'}
          </Avatar>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Calling {callee?.username || 'User'}...
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Waiting for response...
          </Typography>
        </Box>

        {/* Cancel Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 3,
          }}
        >
          <IconButton
            onClick={handleCancel}
            sx={{
              bgcolor: '#ff4444',
              color: 'white',
              width: 60,
              height: 60,
              '&:hover': {
                bgcolor: '#cc3333',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
          >
            <CallEnd sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>

        {/* Helper Text */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 3,
            opacity: 0.8,
          }}
        >
          Cancel call or wait for response
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default OutgoingCallModal; 