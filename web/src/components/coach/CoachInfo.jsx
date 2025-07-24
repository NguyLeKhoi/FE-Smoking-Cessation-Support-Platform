import React, { useEffect, useState } from 'react';
import { Card, Avatar, Typography, Chip, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Email, Phone, AccessTime } from '@mui/icons-material';
import { createChatRoom, getAllChatRooms } from '../../services/chatService';
import { toast } from 'react-toastify';
import CoachFeedback from './CoachFeedback';
import BlackButton from '../buttons/BlackButton';
import WriteFeedbackBox from './WriteFeedbackBox';

const CoachInfo = ({ coach }) => {
    const navigate = useNavigate();
    const [existingChatRoom, setExistingChatRoom] = useState(null);
    const [checkingRoom, setCheckingRoom] = useState(true);
    const [newFeedback, setNewFeedback] = useState('');
    const [submittingFeedback, setSubmittingFeedback] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Optionally fetch current user from context or API
        // For now, try to get from localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        setCurrentUser(userInfo && userInfo.id ? userInfo : null);
    }, []);

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
                alignItems: { xs: 'stretch', md: 'flex-start' },
                borderRadius: 5,
                p: 5,
                mb: 5,
                bgcolor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.08)',
                width: '100%',
                maxWidth: 1400,
                height: { xs: 'auto', md: 700 },
                mx: 'auto',
            }}
        >
            {/* Avatar and Start Consultation Button (Left) */}
            <Box
                sx={{
                    flexBasis: { xs: '100%', md: '36%' },
                    flexGrow: 1,
                    width: '100%',
                    minWidth: 500,
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
                        width: 300,
                        height: 300,
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
                <BlackButton
                    size="large"
                    onClick={handleStartConsultation}
                    disabled={checkingRoom}
                    sx={{
                        borderRadius: 5,
                        py: 1.5,
                        px: 4,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        marginTop: 2,
                        alignSelf: 'center',
                        width: 300,
                    }}
                >
                    {checkingRoom
                        ? 'Loading...'
                        : existingChatRoom
                            ? 'Continue Consultation'
                            : 'Start Consultation'}
                </BlackButton>
            </Box>

            {/* Coach Info (Right) */}
            <Box sx={{ flexBasis: { xs: '100%', md: '64%' }, flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
                            fontWeight={600}
                            gutterBottom
                            align="left"
                            sx={{ color: '#1e293b' }}
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
                                Expert for: {""}
                                {coach.experience_years} {""}
                                years
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
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '1.15rem' }}>
                                {coach.users?.email || 'Available upon request'}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Phone sx={{ mr: 1, color: '#64748b', fontSize: '1.2rem' }} />
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '1.15rem' }}>
                                {coach.users?.phone_number || 'Available upon request'}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTime sx={{ mr: 1, color: '#64748b', fontSize: '1.2rem' }} />
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '1.15rem' }}>
                                {coach.working_hours || 'Mon-Fri 9:00-17:00'}
                            </Typography>
                        </Box>
                    </Box>
                    {/* Coach Feedback */}
                    <CoachFeedback
                        averageStars={coach.averageStars || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }}
                        averageRating={coach.averageRating || 0}
                    />
                </Box>
            </Box>
        </Card>
    );
};

export default CoachInfo; 