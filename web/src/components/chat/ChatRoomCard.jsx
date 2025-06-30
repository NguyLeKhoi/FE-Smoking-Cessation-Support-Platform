import React from 'react';
import { Card, Typography, Chip, Button, Box } from '@mui/material';

const ChatRoomCard = ({ room, onOpenChat }) => (
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
            onClick={() => onOpenChat(room)}
        >
            Open Chat
        </Button>
    </Card>
);

export default ChatRoomCard; 