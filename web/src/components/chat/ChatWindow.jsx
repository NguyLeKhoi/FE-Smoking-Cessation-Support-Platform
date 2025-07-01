import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Avatar } from '@mui/material';
import { useSocket } from '../../context/SocketContext';
import { getChatRoomMessages } from '../../services/chatService';
import { getAllCoaches } from '../../services/coachService';
import { jwtDecode } from 'jwt-decode';

const ChatWindow = ({ room, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [coachUser, setCoachUser] = useState(null);
    const socket = useSocket();
    const messagesEndRef = useRef(null);

    // Detect role
    let role = null;
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        try {
            const decoded = jwtDecode(accessToken);
            role = decoded.role;
        } catch (e) {
            role = null;
        }
    }

    // Determine which user info to display at the top
    const displayUser = role === 'coach'
        ? room.user
        : room.coach?.user;

    // Fetch coach info using getAllCoaches
    useEffect(() => {
        const fetchCoach = async () => {
            try {
                const response = await getAllCoaches();
                const coaches = response.data || [];
                // Find the coach by user_id or id
                let foundCoach = coaches.find(c => c.user_id === room.coach_id || c.id === room.coach_id);
                if (foundCoach && foundCoach.users) {
                    setCoachUser({
                        username: foundCoach.users.username,
                        avatar: foundCoach.users.avatar,
                        email: foundCoach.users.email
                    });
                } else if (room.coach?.user) {
                    setCoachUser({
                        username: room.coach.user.username,
                        avatar: room.coach.user.avatar,
                        email: room.coach.user.email
                    });
                }
            } catch (e) {
                // fallback to room.coach.user if available
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

    // Fetch initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            const data = await getChatRoomMessages(room.id);
            const arr = Array.isArray(data.data?.data) ? data.data.data : Array.isArray(data.data) ? data.data : [];
            setMessages(arr);
            console.log('Fetched messages:', arr);
        };
        fetchMessages();
    }, [room.id]);

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

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
        console.log('Emitting sendMessage', { chat_room_id: room.id, message: input });
        socket.emit('sendMessage', {
            chat_room_id: room.id,
            message: input,
        });
        setInput('');
    };

    useEffect(() => {
        if (!socket) return;
        const handleError = (err) => {
            alert('Socket error: ' + (err?.message || JSON.stringify(err)));
        };
        socket.on('error', handleError);
        return () => socket.off('error', handleError);
    }, [socket]);

    // Get user info for sender name
    const getSenderName = (msg) => {
        if (coachUser && msg.sender_id === room.coach_id) {
            return coachUser.username || 'Coach';
        }
        if (displayUser && msg.sender_id === displayUser.id) {
            return displayUser.username || 'User';
        }
        return msg.sender_type === 'coach' ? 'Coach' : 'User';
    };

    let currentUserId = null;
    if (accessToken) {
        try {
            const decoded = jwtDecode(accessToken);
            currentUserId = decoded.userId || decoded.id || decoded.sub; // adjust based on your JWT payload
        } catch (e) {
            currentUserId = null;
        }
    }

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
                    <Avatar
                        src={displayUser?.avatar || ''}
                        alt={displayUser?.username || ''}
                        sx={{ width: 40, height: 40, mr: 2 }}
                    >
                        {displayUser?.username ? displayUser.username.charAt(0).toUpperCase() : '?'}
                    </Avatar>
                    <Box>
                        <Typography sx={{ mb: -1 }} variant="subtitle2">{displayUser?.username || ''}</Typography>
                        <Typography variant="caption" color="text.secondary">{displayUser?.email || ''}</Typography>
                    </Box>
                </Box>
                <Button size="small" onClick={onClose} sx={{ ml: 0, alignSelf: 'flex-start', color: 'secondary.main' }}>Close</Button>
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
                        <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                            No messages yet.
                        </Typography>
                    </Box>
                )}
                {[...messages].sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at)).map((msg, idx) => {
                    const isCurrentUser = msg.sender_id === currentUserId;
                    return (
                        <Box
                            key={msg.id || idx}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
                                mb: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: isCurrentUser ? 'primary.main' : 'section.light',
                                    color: isCurrentUser ? 'white' : 'text.primary',
                                    borderRadius: 5,
                                    p: '8px 20px',
                                    maxWidth: '80%',
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
                                color={isCurrentUser ? 'rgba(0,0,0,0.4)' : 'text.secondary'}
                                sx={{ mt: 0.5, px: 1, textAlign: isCurrentUser ? 'right' : 'left', width: '100%' }}
                            >
                                {new Date(msg.sent_at).toLocaleTimeString()}
                            </Typography>
                        </Box>
                    );
                })}
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
                    value={input}
                    onChange={e => setInput(e.target.value)}
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
                    disabled={!input.trim()}
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
        </Box>
    );
};

export default ChatWindow;