import React, { useEffect, useState } from 'react';
import { getAllCoaches } from '../../services/coachService';
import { createChatRoom, getAllChatRooms } from '../../services/chatService';
import {
    Grid, Typography, Box, CircularProgress
} from '@mui/material';
import CoachInfo from '../../components/coach/CoachInfo';
import ChatRoom from '../../components/coach/ChatRoom';
import { useSocket } from '../../context/SocketContext';

const CoachListPage = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chatRooms, setChatRooms] = useState([]);
    const [chatRoomsLoading, setChatRoomsLoading] = useState(false);
    const socket = useSocket();

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

    useEffect(() => {
        const fetchChatRooms = async () => {
            setChatRoomsLoading(true);
            try {
                const response = await getAllChatRooms();
                const chatRoomsArray = Array.isArray(response.data?.data) ? response.data.data : [];
                setChatRooms(chatRoomsArray);
            } catch (e) {
                setChatRooms([]);
            } finally {
                setChatRoomsLoading(false);
            }
        };
        fetchChatRooms();
    }, []);

    const handleStartChat = async (coachId) => {
        try {
            await createChatRoom(coachId);
            alert('Chat room created!');
        } catch (error) {
            alert('Failed to create chat room.');
        }
    };

    const handleOpenChat = (room) => {
        // Implement navigation to chat room page if needed
        alert(`Open chat room: ${room.id}`);
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

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 1, px: 2 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom align="center">
                Meet Our Coaches
            </Typography>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    Your Chat Rooms
                </Typography>
                {chatRoomsLoading ? (
                    <CircularProgress size={20} />
                ) : Array.isArray(chatRooms) && chatRooms.length > 0 ? (
                    <Grid container spacing={2}>
                        {chatRooms.map(room => (
                            <Grid item xs={12} sm={6} md={4} key={room.id}>
                                <ChatRoom
                                    room={room}
                                    onOpenChat={() => joinRoom(room.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography>No chat rooms found.</Typography>
                )}
            </Box>
            <Grid container spacing={4}>
                {coaches.length === 0 && (
                    <Grid item xs={12}>
                        <Typography align="center">No coaches found.</Typography>
                    </Grid>
                )}
                {coaches.map((coach) => (
                    <Grid item xs={12} sm={6} md={4} key={coach.user_id}>
                        <CoachInfo coach={coach} onStartChat={handleStartChat} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CoachListPage;
