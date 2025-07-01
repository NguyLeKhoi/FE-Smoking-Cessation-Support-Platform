import React from 'react';
import { Paper, Box, Typography, CircularProgress, List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText } from '@mui/material';

const ChatSidebar = ({ chatRooms, loading, selectedRoom, onSelectRoom, getRoomDisplayInfo }) => (
    <Paper elevation={2} sx={{ width: 340, minWidth: 280, maxWidth: 400, height: '100%', overflowY: 'auto', borderRadius: 0, borderRight: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', height: '60px' }}>
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

export default ChatSidebar;
