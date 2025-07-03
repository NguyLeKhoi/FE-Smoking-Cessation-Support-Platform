import React from 'react';
import { Card, Avatar, Typography, Chip, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Email, Phone, AccessTime } from '@mui/icons-material';

const CoachInfo = ({ coach, onStartChat }) => {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex', gap: 3, width: '100%', maxWidth: 1000 }}>
            {/* Left Section - Coach Info */}
            <Card
                elevation={2}
                sx={{
                    flex: 1,
                    borderRadius: 5,
                    p: 4,
                    bgcolor: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.08)',
                    height: 'fit-content',
                    minHeight: "500px",
                    maxHeight: '500px',
                    width: 500,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ mb: 3 }}>

                        <Typography
                            variant="body1"
                            sx={{
                                color: '#3f332b',
                                fontWeight: 500,
                            }}
                        >
                            {coach.specialization || ''}
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
                        {coach.bio || ''}
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
                    onClick={() => navigate('/chat-page', { state: { coachId: coach.id } })}
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
                        '&:hover': {
                            bgcolor: '#334155'
                        }
                    }}
                >
                    Start Consultation
                </Button>
            </Card>

            {/* Right Section - Avatar with Animated Blob */}
            <Card
                elevation={2}
                sx={{
                    width: 500,
                    height: 500,
                    borderRadius: 5,
                    overflow: 'hidden',
                    position: 'relative',
                    background: '#ffffff',
                    minHeight: "500px",
                    maxHeight: '600px',
                    
                }}
            >


                {/* Avatar */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 280,
                        height: 280,
                        
                    }}
                >
                    <Avatar
                        src={coach.users?.avatar || ''}
                        alt={coach.users?.username || 'Coach'}
                        sx={{
                            width: '100%',
                            height: '100%',
                            bgcolor: '#f0f0f0',
                            fontSize: '4rem',
                            fontWeight: 700,
                            color: '#3f332b',
                            borderRadius: '15%',
                        }}
                    >
                        {coach.users?.username ? coach.users.username.charAt(0).toUpperCase() : '?'}
                    </Avatar>
                </Box>

                {/* View Profile Button */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 30,
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}
                >
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
            </Card>
        </Box>
    );
};

export default CoachInfo; 