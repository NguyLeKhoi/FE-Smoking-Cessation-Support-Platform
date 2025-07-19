import React from 'react';
import { Paper, Box, Typography, CircularProgress, List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ChatSidebar = ({ chatRooms, loading, selectedRoom, onSelectRoom, getRoomDisplayInfo }) => {
    const navigate = useNavigate();
    let role = null;
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        try {
            const decoded = jwtDecode(accessToken);
            role = decoded.role;
        } catch (e) {
        }
    }
    return (
        <Paper elevation={2} sx={{ width: 340, minWidth: 280, maxWidth: 400, height: '100%', overflowY: 'auto', borderRadius: 0, borderRight: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', height: '60px', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    variant="text"
                    onClick={() => {
                        if (role === 'coach') {
                            navigate('/');
                        } else {
                            navigate('/coaches-list');
                        }
                    }}
                    sx={{ minWidth: 0 }}
                >
                    <ArrowBackIcon />
                </Button>
                <Typography variant="h6" fontWeight={700}>Chats</Typography>
            </Box>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : chatRooms.length === 0 ? (
                <Box sx={{ p: 3 }}>
                    <Typography>No chat rooms found.</Typography>
                </Box>
            ) : (
                <List disablePadding>
                    {chatRooms.map((room) => {
                        const info = getRoomDisplayInfo(room);
                        return (
                            <ListItem key={room.id} disablePadding selected={selectedRoom?.id === room.id}>
                                <ListItemButton onClick={() => onSelectRoom(room)} sx={{ alignItems: 'flex-start', py: 2 }}>
                                    <ListItemAvatar>
                                        <Avatar src={info.avatar || ''} alt={info.username || ''}>
                                            {info.username ? info.username.charAt(0).toUpperCase() : '?'}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography fontWeight={600}>{info.username || 'Unknown'}</Typography>}
                                        secondary={
                                            <>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {room.lastMessage?.message || room.last_message?.message || ''}
                                                </Typography>
                                                <Typography variant="caption" color="text.disabled">
                                                    {room.lastMessage?.sent_at ? new Date(room.lastMessage.sent_at).toLocaleTimeString() : room.last_message?.sent_at ? new Date(room.last_message?.sent_at).toLocaleTimeString() : ''}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            )}
        </Paper>
    );
};

export default ChatSidebar;
