import React, { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { jwtDecode } from 'jwt-decode';
import theme from './theme/theme';
import { routes } from './router/Router';
import { SocketProvider, useSocket } from './context/SocketContext';
import IncomingCallModal from './components/chat/IncomingCallModal';
import VideoCall from './components/chat/VideoCall';
import { startAutoRefresh, stopAutoRefresh, debugTokenStatus, testRefreshToken } from './services/api';

const GlobalCallManager = () => {
  const { socket } = useSocket();
  const [incomingCall, setIncomingCall] = useState(null);
  const [isInVideoCall, setIsInVideoCall] = useState(false);
  const [videoToken, setVideoToken] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(null);

  // Get current user info
  let currentUserId = null;
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);
      currentUserId = decoded.userId || decoded.id || decoded.sub;
    } catch (e) {
      // Silent error handling
    }
  }

  useEffect(() => {
    if (!socket || !currentUserId) return;

    const handleIncomingCall = (data) => {
      setIncomingCall(data);
    };

    const handleCallEnded = () => {
      setIsInVideoCall(false);
      setVideoToken(null);
      setIncomingCall(null);
      setCurrentRoomId(null);
    };

    socket.on('incoming-call', handleIncomingCall);
    socket.on('call-ended', handleCallEnded);

    return () => {
      socket.off('incoming-call', handleIncomingCall);
      socket.off('call-ended', handleCallEnded);
    };
  }, [socket, currentUserId]);

  const acceptCall = () => {
    if (!socket || !incomingCall) {
      return;
    }

    const handleCallAcceptedToken = (data) => {
      setVideoToken(data.token);
      setIsInVideoCall(true);
      setCurrentRoomId(incomingCall.roomId);
      setIncomingCall(null);
      socket.off('call-accepted-token', handleCallAcceptedToken);
      socket.off('error', handleErrorEvent);
    };

    const handleErrorEvent = (error) => {
      alert('Error: ' + error.message);
      socket.off('call-accepted-token', handleCallAcceptedToken);
      socket.off('error', handleErrorEvent);
    };

    socket.on('call-accepted-token', handleCallAcceptedToken);
    socket.on('error', handleErrorEvent);

    socket.emit('accept-call', { 
      chatRoomId: incomingCall.roomId, 
      caller: incomingCall.caller 
    });
  };

  const rejectCall = () => {
    if (!socket || !incomingCall) return;
    
    socket.emit('reject-call', { callerId: incomingCall.caller.id });
    setIncomingCall(null);
  };

  const endCall = () => {
    if (!socket || !currentRoomId) return;
    
    socket.emit('end-call', { chatRoomId: currentRoomId });
    setIsInVideoCall(false);
    setVideoToken(null);
    setIncomingCall(null);
    setCurrentRoomId(null);
  };

  return (
    <>
      <IncomingCallModal
        open={!!incomingCall}
        caller={incomingCall?.caller}
        onAccept={acceptCall}
        onReject={rejectCall}
      />

      {isInVideoCall && videoToken && (
        <VideoCall
          token={videoToken}
          roomName={currentRoomId || 'unknown'}
          onDisconnect={endCall}
        />
      )}
    </>
  );
};

function App() {
  useEffect(() => {
    // Initialize auto refresh token on app start
    const initializeApp = async () => {
      try {
        // Test refresh token functionality
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          await testRefreshToken();
        }
        
        startAutoRefresh();
      } catch (error) {
        // Silent error handling
      }
    };

    initializeApp();
    
    // Cleanup on app unmount
    return () => {
      stopAutoRefresh();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SocketProvider>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <RouterProvider router={routes} />
          <GlobalCallManager />
        </LocalizationProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
