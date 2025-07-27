import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Box, Typography, TextField, Button, Avatar, IconButton, Chip } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { VideoCall as VideoCallIcon } from '@mui/icons-material';
import { useSocket } from '../../context/SocketContext';
import { getChatRoomMessages } from '../../services/chatService';
import { getAllCoaches } from '../../services/coachService';
import { jwtDecode } from 'jwt-decode';
import VideoCall from './VideoCall';
import OutgoingCallModal from './OutgoingCallModal';
import IncomingCallModal from './IncomingCallModal';
import ChatInput from './ChatInput';
import CloseIcon from '@mui/icons-material/Close';
import VideocamIcon from '@mui/icons-material/Videocam';
import { getVideoToken } from '../../services/chatService';

const ChatWindow = ({ room, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [coachUser, setCoachUser] = useState(null);
    const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [otherUserTyping, setOtherUserTyping] = useState(false);
    const { socket } = useSocket();
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const limit = 20;

    // Video call states
    const [isInVideoCall, setIsInVideoCall] = useState(false);
    const [videoToken, setVideoToken] = useState(null);
    const [isCallStarting, setIsCallStarting] = useState(false);
    const [showOutgoingCallModal, setShowOutgoingCallModal] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null);

    // Get current user info
    let currentUserId = null;
    let role = null;
    const accessToken = localStorage.getItem('accessToken');
    if (typeof accessToken === 'string' && accessToken) {
        try {
            const decoded = jwtDecode(accessToken);
            currentUserId = decoded.userId || decoded.id || decoded.sub;
            role = decoded.role;
        } catch (e) {
            currentUserId = null;
            role = null;
        }
    }

    const displayUser = role === 'coach'
        ? room.user
        : room.coach?.user;

    useEffect(() => {
        const fetchCoach = async () => {
            try {
                // Use the coach info directly from room if available
                if (room.coach?.user) {
                    setCoachUser({
                        username: room.coach.user.username,
                        avatar: room.coach.user.avatar,
                        email: room.coach.user.email
                    });
                    return;
                }

                // Fallback to API lookup if needed
                const response = await getAllCoaches();
                const coaches = response.data || [];
                const coachId = room.coach_id || room.coach?.id || room.coach?.user?.id;
                let foundCoach = coaches.find(c => c.user_id === coachId || c.id === coachId);
                if (foundCoach && foundCoach.users) {
                    setCoachUser({
                        username: foundCoach.users.username,
                        avatar: foundCoach.users.avatar,
                        email: foundCoach.users.email
                    });
                } else {
                    setCoachUser(null);
                }
            } catch (e) {
                // Final fallback to room.coach.user if available
                if (room.coach?.user) {
                    setCoachUser({
                        username: room.coach.user.username,
                        avatar: room.coach.user.avatar,
                        email: room.coach.user.email
                    });
                } else {
                    setCoachUser(null);
                }
            }
        };
        fetchCoach();
    }, [room.coach_id, room.coach?.user]);

    // Fetch latest messages on mount
    useEffect(() => {
        const fetchLatestMessages = async () => {
            setInitialLoading(true);
            setLoadingMore(true);
            try {
                const data = await getChatRoomMessages(room.id, limit, 0);
                const arr = Array.isArray(data.data?.data) ? data.data.data : Array.isArray(data.data) ? data.data : [];
                setMessages(arr);
                setOffset(arr.length);
                setHasMore(arr.length === limit);
                // Scroll to bottom after initial load
                setTimeout(() => {
                    if (messagesContainerRef.current) {
                        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
                    }
                }, 100);
            } finally {
                setLoadingMore(false);
                setInitialLoading(false);
            }
        };
        fetchLatestMessages();
    }, [room.id]);

    // Load more messages when scrolled to top
    const handleScroll = async (e) => {
        if (loadingMore || !hasMore) return;
        const container = e.target;
        if (container.scrollTop === 0) {
            setLoadingMore(true);
            try {
                const data = await getChatRoomMessages(room.id, limit, offset);
                const arr = Array.isArray(data.data?.data) ? data.data.data : Array.isArray(data.data) ? data.data : [];
                setMessages(prev => [...arr, ...prev]);
                setOffset(prev => prev + arr.length);
                setHasMore(arr.length === limit);
                // Maintain scroll position after prepending
                setTimeout(() => {
                    if (messagesContainerRef.current && arr.length > 0) {
                        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight / (arr.length + 1);
                    }
                }, 100);
            } finally {
                setLoadingMore(false);
            }
        }
    };

    // Listen for new messages via socket
    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = (msg) => {
            if (msg.chat_room_id === room.id) {
                setMessages((prev) => [...prev, msg]);
            }
        };
        socket.on('newMessage', handleNewMessage);
        return () => socket.off('newMessage', handleNewMessage);
    }, [socket, room.id]);

    // Listen for typing events
    useEffect(() => {
        if (!socket) return;

        const handleUserTyping = (data) => {
            if (data.userId !== currentUserId) {
                setOtherUserTyping(data.isTyping);
            }
        };

        socket.on('userTyping', handleUserTyping);
        return () => socket.off('userTyping', handleUserTyping);
    }, [socket, currentUserId]);

    // Scroll to bottom on new message (if not loading more)
    useLayoutEffect(() => {
        if (!loadingMore && messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages, loadingMore]);

    // Join room when component mounts
    useEffect(() => {
        if (socket && room.id) {
            socket.emit('joinRoom', { chat_room_id: room.id });
        }
    }, [socket, room.id]);

    // Leave room when component unmounts
    useEffect(() => {
        return () => {
            if (socket && room.id) {
                socket.emit('leaveRoom', { chat_room_id: room.id });
            }
        };
    }, [socket, room.id]);

    // Handle typing indicator
    const handleInputChange = (e) => {
        setInput(e.target.value);

        if (!socket) return;

        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing', { chat_room_id: room.id, isTyping: true });
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.emit('typing', { chat_room_id: room.id, isTyping: false });
        }, 2000);
    };

    // Send message
    const handleSend = () => {
        if (!socket) {
            alert('Socket not connected');
            return;
        }
        if (!socket.connected) {
            alert('Socket is not connected to server');
            return;
        }
        if (!input.trim()) return;

        // Stop typing indicator
        if (isTyping) {
            setIsTyping(false);
            socket.emit('typing', { chat_room_id: room.id, isTyping: false });
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }

        socket.emit('sendMessage', {
            chat_room_id: room.id,
            message: input,
        });
        setInput('');
    };

    // Handle socket errors - simplified
    useEffect(() => {
        if (!socket) return;
        const handleError = (err) => {
            console.error('Socket error:', err);
        };
        socket.on('error', handleError);
        return () => socket.off('error', handleError);
    }, [socket]);

    // Check other user's online status
    useEffect(() => {
        if (!socket || !displayUser?.id) return;

        const handleUserOnlineStatus = (data) => {
            if (data.userId === displayUser.id) {
                setIsOtherUserOnline(data.isOnline);
            }
        };

        const handleUserOnline = (data) => {
            if (data.userId === displayUser.id) {
                setIsOtherUserOnline(true);
            }
        };

        const handleUserOffline = (data) => {
            if (data.userId === displayUser.id) {
                setIsOtherUserOnline(false);
            }
        };

        // Listen for online status responses and real-time updates
        socket.on('user-online-status', handleUserOnlineStatus);
        socket.on('user-online', handleUserOnline);
        socket.on('user-offline', handleUserOffline);

        // Check other user's online status when component mounts
        socket.emit('check-user-online', { userId: displayUser.id });

        // Check online status periodically (every 30 seconds)
        const interval = setInterval(() => {
            socket.emit('check-user-online', { userId: displayUser.id });
        }, 30000);

        return () => {
            socket.off('user-online-status', handleUserOnlineStatus);
            socket.off('user-online', handleUserOnline);
            socket.off('user-offline', handleUserOffline);
            clearInterval(interval);
        };
    }, [socket, displayUser?.id]);

    // Video call socket events for both caller and callee
    useEffect(() => {
        if (!socket) {
            alert('Socket not connected');
            return;
        }

        const handleIncomingCall = (data) => {
            console.log('🔔 Incoming call received:', data);
            setIncomingCall(data);
        };

        const handleCallAccepted = (data) => {
            setIsCallStarting(false);
            setShowOutgoingCallModal(false);

            // Use the fresh token sent with the call-accepted event
            if (data.token) {
                setVideoToken(data.token);
                setIsInVideoCall(true);
            } else {
                console.error('No token received with call-accepted event');
            }
        };

        const handleCallRejected = (data) => {
            setIsCallStarting(false);
            setShowOutgoingCallModal(false);
            alert('Call was rejected by ' + (data.callee?.username || 'the other user'));
        };

        const handleCallEnded = () => {
            setIsInVideoCall(false);
            setVideoToken(null);
            setIsCallStarting(false);
            setShowOutgoingCallModal(false);
            setIncomingCall(null);
        };

        socket.on('incoming-call', handleIncomingCall);
        socket.on('call-accepted', handleCallAccepted);
        socket.on('call-rejected', handleCallRejected);
        socket.on('call-ended', handleCallEnded);

        return () => {
            socket.off('incoming-call', handleIncomingCall);
            socket.off('call-accepted', handleCallAccepted);
            socket.off('call-rejected', handleCallRejected);
            socket.off('call-ended', handleCallEnded);
        };
    }, [socket, currentUserId, room.id]);

    // Video call functions
    const startVideoCall = async () => {
        if (!socket) {
            alert('Socket not connected. Please refresh and try again.');
            return;
        }

        if (!socket.connected) {
            alert('Socket is not connected to server. Please refresh and try again.');
            return;
        }
        if (!isOtherUserOnline) {
            alert(`Cannot start video call. ${displayUser?.username || 'User'} is currently offline.`);
            return;
        }

        setIsCallStarting(true);
        setShowOutgoingCallModal(true);

        try {
            // Always get a fresh token for the caller
            const tokenResponse = await getVideoToken(room.id);
            if (!tokenResponse?.data?.token) {
                throw new Error('Failed to get video token');
            }

            socket.emit('start-call', {
                chatRoomId: room.id,
                callerToken: tokenResponse.data.token // Send the fresh token to backend
            }, (response) => {
                setIsCallStarting(false);

                if (response?.event === 'error') {
                    alert('Error starting call: ' + response.data.message);
                    setShowOutgoingCallModal(false);
                } else if (response?.event === 'call-started') {
                    // Modal is already showing, keep it open
                } else {
                    // Keep modal open for any other response
                }
            });
        } catch (error) {
            console.error('Error starting call:', error);
            alert('Error starting call: ' + (error.message || 'Unknown error'));
            setIsCallStarting(false);
            setShowOutgoingCallModal(false);
        }
    };

    const acceptCall = async () => {
        if (!socket || !incomingCall) {
            console.log('❌ Cannot accept call - missing socket or incomingCall:', { socket: !!socket, incomingCall });
            return;
        }

        console.log('📞 Accepting call with data:', incomingCall);

        try {
            // Always get a fresh token for the accepter
            const tokenResponse = await getVideoToken(room.id);
            console.log('🎬 Got fresh video token for accepting call:', tokenResponse);

            if (tokenResponse?.data?.token) {
                setVideoToken(tokenResponse.data.token);
                setIsInVideoCall(true);
                setIncomingCall(null);

                // Notify caller that call was accepted with fresh token
                socket.emit('accept-call', {
                    chatRoomId: incomingCall.roomId || incomingCall.chatRoomId || room.id,
                    callerId: incomingCall.caller?.id || incomingCall.callerId,
                    caller: incomingCall.caller,
                    accepterToken: tokenResponse.data.token // Send fresh token to backend
                });

                console.log('✅ Call accepted successfully with fresh token');
            } else {
                throw new Error('Failed to get video token');
            }
        } catch (error) {
            console.error('❌ Error accepting call:', error);
            alert('Error accepting call: ' + error.message);
        }
    };

    const rejectCall = () => {
        if (!socket || !incomingCall) {
            console.log('❌ Cannot reject call - missing socket or incomingCall:', { socket: !!socket, incomingCall });
            return;
        }

        console.log('❌ Rejecting call with data:', incomingCall);

        socket.emit('reject-call', {
            chatRoomId: incomingCall.roomId || incomingCall.chatRoomId || room.id,
            callerId: incomingCall.caller?.id || incomingCall.callerId,
            caller: incomingCall.caller
        });

        setIncomingCall(null);
        console.log('📞 Call rejected');
    };

    const endCall = () => {
        if (!socket) return;

        socket.emit('end-call', { chatRoomId: room.id });
        setIsInVideoCall(false);
        setVideoToken(null);
        setIsCallStarting(false);
        setShowOutgoingCallModal(false);
    };

    const cancelOutgoingCall = () => {
        if (!socket) return;

        socket.emit('end-call', { chatRoomId: room.id });
        setIsCallStarting(false);
        setShowOutgoingCallModal(false);
    };

    // Cleanup typing timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                color: 'text.primary',
                borderRadius: 0,
                border: 'none',
                boxShadow: 'none',
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
                    height: '60px',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            src={displayUser?.avatar || ''}
                            alt={displayUser?.username || ''}
                            sx={{ width: 40, height: 40, mr: 2 }}
                        >
                            {displayUser?.username ? displayUser.username.charAt(0).toUpperCase() : '?'}
                        </Avatar>
                        {/* Online status indicator */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 2,
                                right: 10,
                                width: 12,
                                height: 12,
                                backgroundColor: isOtherUserOnline ? '#44ff44' : '#ccc',
                                border: '2px solid white',
                                borderRadius: '50%',
                                zIndex: 1,
                            }}
                        />
                    </Box>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ mb: -1 }} variant="subtitle2">
                                {displayUser?.username || ''}
                            </Typography>
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    backgroundColor: isOtherUserOnline ? '#44ff44' : '#ccc',
                                    borderRadius: '50%',
                                    flexShrink: 0,
                                }}
                            />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                            {isOtherUserOnline ? 'Online' : 'Offline'} • {displayUser?.email || ''}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                        onClick={startVideoCall}
                        disabled={isCallStarting || isInVideoCall || !isOtherUserOnline}
                        sx={{
                            color: isOtherUserOnline ? 'primary.main' : 'action.disabled',
                            '&:hover': {
                                bgcolor: isOtherUserOnline ? 'primary.main' : 'action.hover',
                                color: isOtherUserOnline ? 'white' : 'action.disabled'
                            },
                            '&.Mui-disabled': {
                                color: 'action.disabled',
                                cursor: 'not-allowed'
                            }
                        }}
                        title={isOtherUserOnline ? 'Start video call' : `${displayUser?.username || 'User'} is offline`}
                    >
                        <VideocamIcon />
                    </IconButton>
                    <IconButton
                        onClick={onClose}
                        sx={{ ml: 0, alignSelf: 'center' }}
                    >
                        <CloseIcon sx={{ m: 0, p: 0, color: 'black' }} />
                    </IconButton>
                </Box>
            </Box>

            {/* Message Area */}
            {initialLoading ? (
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
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
                    {loadingMore && (
                        <Typography variant="caption" sx={{ textAlign: 'center', width: '100%', mb: 1 }}>
                            Loading more messages...
                        </Typography>
                    )}
                    {messages.length === 0 && (
                        <Box sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: 0.7
                        }}>
                            <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                                No messages yet.
                            </Typography>
                        </Box>
                    )}
                    {[...messages].sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at)).map((msg, idx) => {
                        const isCurrentUser = msg.sender_id === currentUserId;
                        const senderInfo = isCurrentUser ?
                            { username: 'You', avatar: null } :
                            (displayUser || { username: 'User', avatar: null });

                        const isVideoCallMessage = msg.message && (
                            msg.message.includes('📞 Video call started') ||
                            msg.message.includes('Video call started') ||
                            msg.message.includes('📞') ||
                            msg.message.toLowerCase().includes('video call')
                        );

                        // Special styling for video call messages
                        if (isVideoCallMessage) {
                            return (
                                <Box
                                    key={msg.id || idx}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        mb: 2,
                                        px: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%)',
                                            color: 'white',
                                            borderRadius: 4,
                                            p: 2,
                                            maxWidth: '90%',
                                            textAlign: 'center',
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                                            border: '2px solid rgba(255, 255, 255, 0.15)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: '-100%',
                                                width: '100%',
                                                height: '100%',
                                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                                                animation: 'shimmer 2s infinite',
                                            },
                                            '@keyframes shimmer': {
                                                '0%': { left: '-100%' },
                                                '100%': { left: '100%' },
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                            }}
                                        >
                                            {msg.message}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                mt: 0.5,
                                                opacity: 0.9,
                                                fontSize: '0.75rem',
                                                display: 'block',
                                            }}
                                        >
                                            {new Date(msg.sent_at).toLocaleTimeString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        }

                        // Regular message styling
                        return (
                            <Box
                                key={msg.id || idx}
                                sx={{
                                    display: 'flex',
                                    flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                                    alignItems: 'flex-start',
                                    mb: 1,
                                    gap: 1,
                                }}
                            >
                                {/* Avatar - only show for other users */}
                                {!isCurrentUser && (
                                    <Box sx={{ position: 'relative' }}>
                                        <Avatar
                                            src={senderInfo.avatar || ''}
                                            alt={senderInfo.username || ''}
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                bgcolor: 'white',
                                                flexShrink: 0,
                                                mt: 0.5
                                            }}
                                        >
                                            {senderInfo.username ? senderInfo.username.charAt(0).toUpperCase() : '?'}
                                        </Avatar>
                                        {/* Online status indicator for message avatar */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                width: 10,
                                                height: 10,
                                                backgroundColor: isOtherUserOnline ? '#44ff44' : '#ccc',
                                                border: '2px solid white',
                                                borderRadius: '50%',
                                                zIndex: 1,
                                            }}
                                        />
                                    </Box>
                                )}

                                {/* Message Content */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
                                        maxWidth: isCurrentUser ? '80%' : '70%',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            bgcolor: isCurrentUser ? 'primary.main' : 'section.light',
                                            color: isCurrentUser ? 'white' : 'text.primary',
                                            borderRadius: 3,
                                            p: '8px 16px',
                                            wordBreak: 'break-word',
                                            boxShadow: isCurrentUser
                                                ? '0 2px 5px rgba(0, 0, 0, 0.1)'
                                                : '0 2px 5px rgba(0, 0, 0, 0.05)',
                                            border: '1px solid',
                                            borderColor: isCurrentUser ? 'primary.main' : 'divider',
                                        }}
                                    >
                                        <Typography variant="body2">{msg.message}</Typography>
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ mt: 0.5, px: 1 }}
                                    >
                                        {new Date(msg.sent_at).toLocaleTimeString()}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}

                    {/* Typing indicator */}
                    {otherUserTyping && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
                            <Avatar
                                src={displayUser?.avatar || ''}
                                alt={displayUser?.username || ''}
                                sx={{ width: 24, height: 24 }}
                            >
                                {displayUser?.username ? displayUser.username.charAt(0).toUpperCase() : '?'}
                            </Avatar>
                            <Chip
                                label={`${displayUser?.username || 'User'} is typing...`}
                                size="small"
                                sx={{
                                    bgcolor: 'action.hover',
                                    color: 'text.secondary',
                                    fontSize: '0.75rem',
                                    animation: 'pulse 1.5s ease-in-out infinite',
                                    '@keyframes pulse': {
                                        '0%': { opacity: 0.6 },
                                        '50%': { opacity: 1 },
                                        '100%': { opacity: 0.6 },
                                    },
                                }}
                            />
                        </Box>
                    )}

                    <div ref={messagesEndRef} />
                </Box>
            )}

            {/* Input Area */}
            {(!initialLoading) && (
                <ChatInput
                    input={input}
                    setInput={setInput}
                    handleSend={handleSend}
                    handleInputChange={handleInputChange}
                    disabled={initialLoading}
                />
            )}

            {/* Outgoing Call Modal */}
            <OutgoingCallModal
                open={showOutgoingCallModal}
                callee={displayUser}
                onCancel={cancelOutgoingCall}
            />

            {/* Incoming Call Modal */}
            <IncomingCallModal
                open={!!incomingCall}
                caller={incomingCall?.caller}
                onAccept={acceptCall}
                onReject={rejectCall}
            />

            {isInVideoCall && videoToken && (
                <VideoCall
                    token={videoToken}
                    roomName={room.id}
                    onDisconnect={endCall}
                />
            )}
        </Box>
    );
};

export default ChatWindow;