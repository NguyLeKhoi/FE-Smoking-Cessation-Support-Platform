import React, { useEffect, useState } from 'react';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Button, Card, CardContent, Typography, Box, Chip, Divider } from '@mui/material';
import { useSocket } from '../../context/SocketContext';
import { getChatRoomMessages } from '../../services/chatService';

const ChatRoom = ({ room, onOpenChat }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastMessage, setLastMessage] = useState(null);
    const [unauthorized, setUnauthorized] = useState(false);
    const socket = useSocket();

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            setUnauthorized(false);
            try {
                const data = await getChatRoomMessages(room.id);
                const messagesArray = Array.isArray(data.data?.data) ? data.data.data : [];
                setMessages(messagesArray);
                if (messagesArray.length > 0) {
                    setLastMessage(messagesArray[messagesArray.length - 1]);
                }
            } catch (e) {
                if (e.response?.status === 400 && e.response?.data?.message?.includes('not authorized')) {
                    setUnauthorized(true);
                }
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [room.id]);

    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = (msg) => {
            if (msg.chat_room_id === room.id) {
                setLastMessage(msg);
                setMessages((prev) => [...prev, msg]);
            }
        };
        socket.on('newMessage', handleNewMessage);
        return () => socket.off('newMessage', handleNewMessage);
    }, [socket, room.id]);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
    const formatTime = (dateString) => new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (unauthorized) {
        return (
            <Card variant="outlined" sx={{ mb: 2, bgcolor: 'grey.100', borderColor: 'divider' }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle1" fontWeight={600}>Chat Room</Typography>
                        <Chip label={room.status} color={room.status === 'active' ? 'success' : 'default'} size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Room ID:</strong> {room.id.slice(0, 8)}...
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Started:</strong> {formatDate(room.started_at)}
                    </Typography>
                    {room.ended_at && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>Ended:</strong> {formatDate(room.ended_at)}
                        </Typography>
                    )}
                    <Typography variant="body2" color="error" fontWeight={600} mt={2}>
                        You are not authorized to view messages in this chat room.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card variant="outlined" sx={{ mb: 2, borderColor: 'divider', cursor: 'pointer', '&:hover': { boxShadow: 2, borderColor: 'primary.main' } }}>
            <CardContent sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle1" fontWeight={600}>Chat Room</Typography>
                    <Chip label={room.status} color={room.status === 'active' ? 'success' : 'default'} size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Room ID:</strong> {room.id.slice(0, 8)}...
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Started:</strong> {formatDate(room.started_at)}
                </Typography>
                {room.ended_at && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Ended:</strong> {formatDate(room.ended_at)}
                    </Typography>
                )}
                {lastMessage && (
                    <Box mt={1}>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                            <strong>Last message:</strong> {lastMessage.message.length > 30 ? `${lastMessage.message.slice(0, 30)}...` : lastMessage.message}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                            {formatTime(lastMessage.sent_at)}
                        </Typography>
                    </Box>
                )}
                <Button
                    onClick={() => onOpenChat(room)}
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<ChatBubbleOutlineIcon />}
                    sx={{ mt: 2, textTransform: 'none', fontWeight: 500 }}
                >
                    Open Chat
                </Button>
            </CardContent>
        </Card>
    );
};

export default ChatRoom;