import React, { useEffect, useState } from 'react';
import { Card, Avatar, Typography, Chip, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Email, Phone, AccessTime } from '@mui/icons-material';
import { createChatRoom, getAllChatRooms } from '../../services/chatService';
import { toast } from 'react-toastify';

const CoachInfo = ({ coach }) => {
    const navigate = useNavigate();
    const [existingChatRoom, setExistingChatRoom] = useState(null);
    const [checkingRoom, setCheckingRoom] = useState(true);

    useEffect(() => {
        const fetchChatRooms = async () => {
            setCheckingRoom(true);
            try {
                const rooms = await getAllChatRooms();
                const chatRoomsArray = Array.isArray(rooms) ? rooms : (rooms.data || []);
                console.log('CoachInfo: chatRoomsArray', chatRoomsArray);
                console.log('CoachInfo: coach.user_id', coach.user_id);
                const foundRoom = chatRoomsArray.find(
                    room =>
                        room.coach &&
                        room.coach.user &&
                        room.coach.user.id === coach.user_id
                );
                if (foundRoom) {
                    console.log('CoachInfo: found matching room', foundRoom);
                }
                setExistingChatRoom(foundRoom || null);
            } catch (e) {
                setExistingChatRoom(null);
            } finally {
                setCheckingRoom(false);
            }
        };
        fetchChatRooms();
    }, [coach.user_id]);

    const handleStartConsultation = async () => {
        if (existingChatRoom) {
            navigate('/chat-page');
            return;
        }
        try {
            const response = await createChatRoom(coach.id);
            const newRoom = response.data ? response.data : response;
            if (!newRoom || !newRoom.id) {
                toast.error('Failed to create chat room: No room ID returned.');
                return;
            }
            toast.success('Chat room created successfully!');
            navigate('/chat-page');
        } catch (error) {
            toast.error('Failed to create chat room: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Card
            elevation={2}
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'stretch',
                borderRadius: 5,
                p: 5,
                mb: 5,
                bgcolor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.08)',
                width: 1000,
                height: 500

            }}
        >
            {/* Avatar and View Profile Button (Left) */}
            <Box
                sx={{
                    width: { xs: '100%', md: 320 },
                    minWidth: 220,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    pr: { md: 4 },
                    mb: { xs: 3, md: 0 },
                }}
            >
                <Avatar
                    src={coach.users?.avatar || ''}
                    alt={coach.users?.username || 'Coach'}
                    sx={{
                        width: 180,
                        height: 180,
                        bgcolor: coach.users?.avatar ? '#f0f0f0' : '#e0e0e0',
                        fontSize: '4rem',
                        fontWeight: 700,
                        color: '#3f332b',
                        borderRadius: '15%',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {coach.users?.avatar
                        ? (coach.users?.username ? coach.users.username.charAt(0).toUpperCase() : '?')
                        : <span style={{ fontSize: '3rem' }}>C</span>
                    }
                </Avatar>
                <Button
                    component={Link}
                    to={`/profile/${coach.user_id}`}
                    variant="outlined"
                    sx={{
                        color: 'black',
                        borderColor: '#000000',
                        borderRadius: 5,
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                            color: 'white',
                            borderColor: 'white',
                            bgcolor: '#000000'
                        }
                    }}
                >
                    View Full Profile
                </Button>
            </Box>

            {/* Coach Info (Right) */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#3f332b',
                                fontWeight: 500,
                            }}
                        >
                            {coach.specialization || 'Certified Coach'}
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 500,
                                color: '#1e293b',
                            }}
                        >
                            {coach.users?.username || 'Professional Coach'}
                        </Typography>
                    </Box>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#475569',
                            lineHeight: 1.7,
                            mb: 1,
                            my: 1,
                            fontSize: '1.1rem'
                        }}
                    >
                        {coach.bio || 'No bio provided.'}
                    </Typography>
                    {/* Stats */}
                    {coach.experience_years && (
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Typography variant="body1" sx={{
                                color: '#475569',
                                lineHeight: 1.7,
                                mb: 1,
                                my: 1,
                                fontSize: '1.1rem'
                            }}>
                                {coach.experience_years} {""}
                                years experience
                            </Typography>
                        </Box>
                    )}
                    {/* Contact Info */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 500, color: '#1e293b', mb: 1 }}>
                            Contact Information
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Email sx={{ mr: 1, color: '#64748b', fontSize: '1.2rem' }} />
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                {coach.users?.email || 'Available upon request'}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Phone sx={{ mr: 1, color: '#64748b', fontSize: '1.2rem' }} />
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                {coach.users?.phone_number || 'Available upon request'}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTime sx={{ mr: 1, color: '#64748b', fontSize: '1.2rem' }} />
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                {coach.working_hours || 'Mon-Fri 9:00-17:00'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleStartConsultation}
                    disabled={checkingRoom}
                    sx={{
                        bgcolor: '#1e293b',
                        color: 'white',
                        borderRadius: 5,
                        py: 1.5,
                        px: 4,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        marginTop: 'auto',
                        alignSelf: 'flex-start',
                        '&:hover': {
                            bgcolor: '#334155'
                        }
                    }}
                >
                    {checkingRoom
                        ? 'Loading...'
                        : existingChatRoom
                            ? 'Continue Consultation'
                            : 'Start Consultation'}
                </Button>
            </Box>
        </Card>
    );
};

export default CoachInfo; 