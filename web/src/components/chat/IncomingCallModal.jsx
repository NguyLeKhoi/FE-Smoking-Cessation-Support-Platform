import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Chip,
} from '@mui/material';
import { VideoCall, CallEnd, Phone, Videocam } from '@mui/icons-material';

const IncomingCallModal = ({ open, caller, onAccept, onReject }) => {
  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject();
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={false}
      onClose={handleReject}
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%)',
          color: 'white',
          textAlign: 'center',
          p: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <DialogContent sx={{ p: 3, py: 2 }}>
        {/* Incoming Call Badge */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label="📞 Incoming Video Call"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.8rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
        </Box>

        {/* Caller Avatar */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
              src={caller?.avatar || ''}
              alt={caller?.username || ''}
              sx={{
                width: 90,
                height: 90,
                mx: 'auto',
                mb: 1.5,
                border: '3px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              }}
            >
              {caller?.username ? caller.username.charAt(0).toUpperCase() : '?'}
            </Avatar>


          </Box>

          <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 0.5 }}>
            {caller?.username || 'Unknown User'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            wants to start a video call
          </Typography>
        </Box>

        {/* Animated Video Icon */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              p: 2,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.4)' },
                '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 8px rgba(255, 255, 255, 0)' },
                '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)' },
              },
            }}
          >
            <Videocam sx={{ fontSize: 36, color: 'white' }} />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
            mb: 2,
          }}
        >
          {/* Reject Button */}
          <Box sx={{ textAlign: 'center' }}>
            <IconButton
              onClick={handleReject}
              sx={{
                bgcolor: '#dc2626',
                color: 'white',
                width: 60,
                height: 60,
                boxShadow: '0 3px 15px rgba(220, 38, 38, 0.4)',
                border: '2px solid rgba(220, 38, 38, 0.3)',
                '&:hover': {
                  bgcolor: '#b91c1c',
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 20px rgba(220, 38, 38, 0.6)',
                },
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            >
              <CallEnd sx={{ fontSize: 28 }} />
            </IconButton>
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7, fontSize: '0.75rem' }}>
              Decline
            </Typography>
          </Box>

          {/* Accept Button */}
          <Box sx={{ textAlign: 'center' }}>
            <IconButton
              onClick={handleAccept}
              sx={{
                bgcolor: '#16a34a',
                color: 'white',
                width: 60,
                height: 60,
                boxShadow: '0 3px 15px rgba(22, 163, 74, 0.4)',
                border: '2px solid rgba(22, 163, 74, 0.3)',
                '&:hover': {
                  bgcolor: '#15803d',
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 20px rgba(22, 163, 74, 0.6)',
                },
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            >
              <Phone sx={{ fontSize: 28 }} />
            </IconButton>
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7, fontSize: '0.75rem' }}>
              Accept
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default IncomingCallModal; 