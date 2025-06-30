import React from 'react';
import { Card, CardContent, CardHeader, Avatar, Typography, Chip, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const CoachInfo = ({ coach, onStartChat }) => (
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
                onClick={() => onStartChat(coach.id)}
            >
                Start Chat
            </Button>
        </CardContent>
    </Card>
);

export default CoachInfo; 