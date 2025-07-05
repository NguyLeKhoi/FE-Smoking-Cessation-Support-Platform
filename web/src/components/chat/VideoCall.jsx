import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography, Paper, Avatar, Fade, Tooltip } from '@mui/material';
import { 
  Videocam, 
  VideocamOff, 
  Mic, 
  MicOff, 
  CallEnd, 
  Fullscreen, 
  FullscreenExit,
  MoreVert,
  PresentToAll,
  Settings
} from '@mui/icons-material';
import { 
  LiveKitRoom, 
  VideoConference, 
  RoomAudioRenderer
} from '@livekit/components-react';
import '../../styles/VideoCall.css';

const VideoCall = ({ token, roomName, onDisconnect }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [identity, setIdentity] = useState(null);

  const serverUrl = process.env.REACT_APP_LIVEKIT_URL || 'ws://localhost:7880';

  // Extract identity from token
  useEffect(() => {
    if (token) {
      try {
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        const extractedIdentity = decodedPayload.sub;
          setIdentity(extractedIdentity);
      } catch (e) {
        setIdentity('user'); // fallback
      }
    }
  }, [token]);

  const handleDisconnect = () => {
    if (onDisconnect) {
      onDisconnect();
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        bgcolor: '#0D1117',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
      }}
    >
      {/* Top Header Bar */}
      <Fade in timeout={800}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Call Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: '#00D26A',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.5, transform: 'scale(1.1)' },
                  '100%': { opacity: 1, transform: 'scale(1)' },
                },
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
              {identity || 'Video Call'}
            </Typography>
          </Box>

          {/* Top Controls */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Settings">
              <IconButton 
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Settings />
              </IconButton>
            </Tooltip>
            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              <IconButton 
                onClick={toggleFullscreen}
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  backdropFilter: 'blur(10px)',
                }}
              >
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>
            <Tooltip title="More">
              <IconButton 
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  backdropFilter: 'blur(10px)',
                }}
              >
                <MoreVert />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Fade>

      {/* Main Video Area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          position: 'relative',
          background: 'radial-gradient(circle at center, #1a1a2e 0%, #16213e 50%, #0D1117 100%)',
        }}
      >
        {identity ? (
          <LiveKitRoom
            video={isVideoEnabled}
            audio={isAudioEnabled}
            token={token}
            serverUrl={serverUrl}
            style={{ 
              height: '100%',
              borderRadius: '0px',
            }}
            onDisconnected={(reason) => {
              handleDisconnect();
            }}
            onConnected={() => {
              // Connected successfully
            }}
            onError={(error) => {
              // Handle error
            }}
            connectOptions={{
              autoSubscribe: true,
            }}
          >
            <VideoConference 
              chatMessageFormatter={undefined}
              SettingsComponent={undefined}
              options={{
                showChatToggle: false,
                showDisconnectButton: false,
                showSettingsToggle: false,
                showScreenShareButton: false,
                showMicButton: false,
                showCameraButton: false,
              }}
            />
            <RoomAudioRenderer />
          </LiveKitRoom>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: 'white',
            gap: 3,
          }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: '#5865F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'spin 2s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            >
              <Videocam sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Connecting to call...
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.7 }}>
              Setting up your video and audio
            </Typography>
          </Box>
        )}
      </Box>

      {/* Bottom Control Bar - Discord Style */}
      <Fade in timeout={1000}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 2,
            p: 2,
            borderRadius: '24px',
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Microphone Button */}
          <Tooltip title={isAudioEnabled ? "Mute" : "Unmute"}>
            <IconButton
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              sx={{
                width: 56,
                height: 56,
                bgcolor: isAudioEnabled ? 'rgba(67, 56, 202, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: isAudioEnabled ? '#4F46E5' : '#EF4444',
                border: `2px solid ${isAudioEnabled ? '#4F46E5' : '#EF4444'}`,
                '&:hover': {
                  bgcolor: isAudioEnabled ? 'rgba(67, 56, 202, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {isAudioEnabled ? <Mic /> : <MicOff />}
            </IconButton>
          </Tooltip>

          {/* Video Button */}
          <Tooltip title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}>
            <IconButton
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              sx={{
                width: 56,
                height: 56,
                bgcolor: isVideoEnabled ? 'rgba(67, 56, 202, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: isVideoEnabled ? '#4F46E5' : '#EF4444',
                border: `2px solid ${isVideoEnabled ? '#4F46E5' : '#EF4444'}`,
                '&:hover': {
                  bgcolor: isVideoEnabled ? 'rgba(67, 56, 202, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {isVideoEnabled ? <Videocam /> : <VideocamOff />}
            </IconButton>
          </Tooltip>

          {/* Screen Share Button */}
          <Tooltip title="Share screen">
            <IconButton
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'rgba(156, 163, 175, 0.2)',
                color: '#9CA3AF',
                border: '2px solid #9CA3AF',
                '&:hover': {
                  bgcolor: 'rgba(156, 163, 175, 0.3)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <PresentToAll />
            </IconButton>
          </Tooltip>

          {/* End Call Button */}
          <Tooltip title="Leave call">
            <IconButton
              onClick={handleDisconnect}
              sx={{
                width: 56,
                height: 56,
                bgcolor: '#DC2626',
                color: 'white',
                border: '2px solid #DC2626',
                '&:hover': {
                  bgcolor: '#B91C1C',
                  transform: 'scale(1.1)',
                  boxShadow: '0 4px 20px rgba(220, 38, 38, 0.4)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <CallEnd />
            </IconButton>
          </Tooltip>
        </Box>
      </Fade>
    </Box>
  );
};

export default VideoCall; 