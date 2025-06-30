import React from 'react';
import { Card, CardContent, Avatar, Typography, Chip, Button, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const CoachInfo = ({ coach, onStartChat }) => (
    <Card
        elevation={3}
        sx={{
            borderRadius: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            minHeight: 220,
            width: 800,
            boxSizing: 'border-box',
        }}
    >
        {/* Left: Info */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3 }}>
            <Box sx={{ mb: 1 }}>
                <Chip
                    label={coach.is_active ? 'Active' : 'Inactive'}
                    color={coach.is_active ? 'success' : 'default'}
                    size="small"
                    sx={{ mb: 1 }}
                />
            </Box>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                <strong>Specialization:</strong> {coach.specialization}
            </Typography>
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
                sx={{ mt: 2, alignSelf: 'flex-start' }}
                onClick={() => onStartChat(coach.id)}
            >
                Start Chat
            </Button>
        </Box>
        {/* Right: Avatar & Username */}
        <Box sx={{
            width: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f3f7ff',
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            p: 3,
        }}>
            <Avatar
                src={coach.users?.avatar || ''}
                alt={coach.users?.username || 'Coach'}
                sx={{ width: 80, height: 80, mb: 2, bgcolor: '#e0e0e0', fontWeight: 700 }}
            >
                {coach.users?.username ? coach.users.username.charAt(0).toUpperCase() : '?'}
            </Avatar>
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
        </Box>
    </Card>
);

export default CoachInfo; 