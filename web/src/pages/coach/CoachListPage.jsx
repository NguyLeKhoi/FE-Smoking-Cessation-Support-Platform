import React, { useEffect, useState } from 'react';
import { getAllCoaches } from '../../services/coachService';
import { createChatRoom, getAllChatRooms, getAllCoachChatRooms } from '../../services/chatService';
import {
    Grid, Typography, Box, CircularProgress
} from '@mui/material';
import CoachInfo from '../../components/coach/CoachInfo';
import ChatRoom from '../../components/chat/ChatRoom';
import { useSocket } from '../../context/SocketContext';
import ChatWindow from '../../components/chat/ChatWindow';
import { jwtDecode } from 'jwt-decode';

const CoachListPage = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chatRooms, setChatRooms] = useState([]);
    const [chatRoomsLoading, setChatRoomsLoading] = useState(false);
    const socket = useSocket();
    const [openChatRooms, setOpenChatRooms] = useState([]);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                setRole(decoded.role); // e.g., 'user' or 'coach'
            } catch (e) {
                console.error('Failed to decode accessToken:', e);
                setRole(null);
            }
        } else {
            setRole(null);
        }
    }, []);

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                setLoading(true);
                const data = await getAllCoaches();
                setCoaches(data.data || []);
            } catch (err) {
                setError('Failed to fetch coaches.');
            } finally {
                setLoading(false);
            }
        };
        fetchCoaches();
    }, []);

    // Move chat room fetching logic to a function
    const fetchChatRooms = async () => {
        setChatRoomsLoading(true);
        try {
            let response;
            if (role === 'coach') {
                response = await getAllCoachChatRooms();
            } else {
                response = await getAllChatRooms();
            }

            console.log('Fetch chat rooms response:', response);

            // Handle different response structures
            let chatRoomsArray = [];
            if (response?.data?.data && Array.isArray(response.data.data)) {
                chatRoomsArray = response.data.data;
            } else if (response?.data && Array.isArray(response.data)) {
                chatRoomsArray = response.data;
            } else if (Array.isArray(response)) {
                chatRoomsArray = response;
            }

            console.log('Processed chat rooms array:', chatRoomsArray);
            setChatRooms(chatRoomsArray);
        } catch (e) {
            console.error('Error fetching chat rooms:', e);
            setChatRooms([]);
        } finally {
            setChatRoomsLoading(false);
        }
    };

    useEffect(() => {
        if (role) {
            fetchChatRooms();
        }
    }, [role]);

    const handleStartChat = async (coachId) => {
        try {
            console.log('Creating chat room for coach:', coachId);
            const response = await createChatRoom(coachId);
            console.log('Create chat room response:', response);

            // Show success message
            alert('Chat room created successfully!');

            // Add a small delay to ensure the backend has processed the creation
            setTimeout(() => {
                fetchChatRooms(); // Refresh the chat room list after creation
            }, 500);

        } catch (error) {
            console.error('Error creating chat room:', error);
            alert('Failed to create chat room: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleOpenChat = (room) => {
        setOpenChatRooms((prev) => {
            if (prev.find(r => r.id === room.id)) return prev;
            if (prev.length >= 2) return [prev[1], room];
            return [...prev, room];
        });
    };

    const handleCloseChat = (roomId) => {
        setOpenChatRooms((prev) => prev.filter(r => r.id !== roomId));
    };

    // Example: join a room
    const joinRoom = (chatRoomId) => {
        if (socket) {
            socket.emit('joinRoom', { chat_room_id: chatRoomId });
        }
    };

    // Example: listen for new messages
    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = (msg) => {
            // handle the new message
        };
        socket.on('newMessage', handleNewMessage);
        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket]);

    // Add refresh function for manual refresh
    const handleRefreshChatRooms = () => {
        if (role) {
            fetchChatRooms();
        }
    };

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error" align="center" sx={{ mt: 8 }}>{error}</Typography>;
    }

    console.log('Current chatRooms state:', chatRooms);
    console.log('Chat rooms length:', chatRooms?.length);

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 1, px: 2 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom align="center">
                Meet Our Coaches
            </Typography>
            <Box sx={{ mb: 4 }}>

                {/* {chatRoomsLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} />
                        <Typography>Loading chat rooms...</Typography>
                    </Box>
                ) : Array.isArray(chatRooms) && chatRooms.length > 0 ? (
                    <Grid container spacing={2}>
                        {chatRooms.map(room => (
                            <Grid item xs={12} sm={6} md={4} key={room.id}>
                                <ChatRoom
                                    room={room}
                                    role={role}
                                    onOpenChat={() => handleOpenChat(room)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box>
                        <Typography>No chat rooms found.</Typography>
                        <Typography variant="caption" color="text.secondary">
                            Role: {role || 'Not determined'} | Rooms count: {chatRooms?.length || 0}
                        </Typography>
                    </Box>
                )} */}
            </Box>
            <Box sx={{ position: 'fixed', bottom: 16, right: 16, display: 'flex', gap: 2, zIndex: 1300 }}>
                {openChatRooms.map(room => (
                    <ChatWindow
                        key={room.id}
                        room={room}
                        onClose={() => handleCloseChat(room.id)}
                    />
                ))}
            </Box>
            <Grid container spacing={4} justifyContent="center">
                {coaches.length === 0 && (
                    <Grid item xs={12}>
                        <Typography align="center">No coaches found.</Typography>
                    </Grid>
                )}
                {coaches.map((coach) => (
                    <Grid item xs={12} sm={8} md={6} key={coach.user_id}>
                        <CoachInfo coach={coach} onStartChat={handleStartChat} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CoachListPage;