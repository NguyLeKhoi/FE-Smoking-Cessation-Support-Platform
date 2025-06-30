import React, { useEffect, useState } from 'react';
import { getAllCoaches } from '../../services/coachService';
import { createChatRoom, getAllChatRooms } from '../../services/chatService';
import {
    Card, CardContent, CardHeader, Avatar, Typography, Grid, Chip, Box, CircularProgress, Button
} from '@mui/material';
import { Link } from 'react-router-dom';

const CoachListPage = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chatRooms, setChatRooms] = useState([]);
    const [chatRoomsLoading, setChatRoomsLoading] = useState(false);

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
                console.log('Full response:', response);
                console.log('response.data:', response.data);
                console.log('Is response.data an array?', Array.isArray(response.data));

                // The chat rooms array is in response.data.data
                const chatRoomsArray = Array.isArray(response.data?.data) ? response.data.data : [];
                console.log('chatRoomsArray to set:', chatRoomsArray);

                setChatRooms(chatRoomsArray);
            } catch (e) {
                console.error('Error fetching chat rooms:', e);
                setChatRooms([]);
            } finally {
                setChatRoomsLoading(false);
            }
        };
        fetchChatRooms();
    }, []);

    useEffect(() => {
        console.log('chatRooms state updated:', chatRooms);
    }, [chatRooms]);

    const handleStartChat = async (coachId) => {
        try {
            const result = await createChatRoom(coachId);
            alert('Chat room created!');
        } catch (error) {
            alert('Failed to create chat room.');
        }
    };

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
        <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 6, px: 2 }}>
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
                                <Card elevation={2} sx={{ borderRadius: 2, p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="h6" fontWeight={600}>
                                            Chat Room
                                        </Typography>
                                        <Chip
                                            label={room.status}
                                            color={room.status === 'active' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Room ID:</strong> {room.id.slice(0, 8)}...
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Started:</strong> {new Date(room.started_at).toLocaleDateString()}
                                    </Typography>
                                    {room.ended_at && (
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Ended:</strong> {new Date(room.ended_at).toLocaleDateString()}
                                        </Typography>
                                    )}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{ mt: 2, bgcolor: '#000000', '&:hover': { bgcolor: '#000000cd' } }}
                                    >
                                        Open Chat
                                    </Button>
                                </Card>
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
                        <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
                            <CardHeader
                                avatar={
                                    <Avatar
                                        src={coach.users?.avatar || ''}
                                        alt={coach.users?.username || 'Coach'}
                                        sx={{ width: 56, height: 56, bgcolor: '#e0e0e0', fontWeight: 700 }}
                                    >
                                        {coach.users?.username ? coach.users.username.charAt(0).toUpperCase() : '?'}
                                    </Avatar>
                                }
                                title={
                                    <Button
                                        component={Link}
                                        to={`/profile/${coach.user_id}`}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '1.1rem',
                                            color: '#222',
                                            pl: 0,
                                            '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' }
                                        }}
                                    >
                                        {coach.users?.username || 'Unknown Coach'}
                                    </Button>
                                }
                                subheader={coach.specialization}
                                action={
                                    coach.is_active ? (
                                        <Chip label="Active" color="success" size="small" />
                                    ) : (
                                        <Chip label="Inactive" color="default" size="small" />
                                    )
                                }
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <strong>Experience:</strong> {coach.experience_years} years
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <strong>Bio:</strong> {coach.bio}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <strong>Working Hours:</strong> {coach.working_hours}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <strong>Email:</strong> {coach.users?.email || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Phone:</strong> {coach.users?.phone_number || 'N/A'}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ mt: 2 }}
                                    onClick={() => handleStartChat(coach.id)}
                                >
                                    Start Chat
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CoachListPage;
