import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useSocket } from '../../context/SocketContext';
import { getChatRoomMessages } from '../../services/chatService';

const ChatWindow = ({ room, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const socket = useSocket();
    const messagesEndRef = useRef(null);

    // Fetch initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            const data = await getChatRoomMessages(room.id);
            setMessages(Array.isArray(data.data?.data) ? data.data.data : []);
        };
        fetchMessages();
    }, [room.id]);

    // Listen for new messages via socket
    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = (msg) => {
            if (msg.chat_room_id === room.id) {
                setMessages((prev) => [...prev, msg]);
            }
        };
        socket.on('newMessage', handleNewMessage);
        return () => socket.off('newMessage', handleNewMessage);
    }, [socket, room.id]);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Join room when component mounts
    useEffect(() => {
        if (socket && room.id) {
            socket.emit('joinRoom', { chat_room_id: room.id });
        }
    }, [socket, room.id]);

    // Leave room when component unmounts
    useEffect(() => {
        return () => {
            if (socket && room.id) {
                socket.emit('leaveRoom', { chat_room_id: room.id });
            }
        };
    }, [socket, room.id]);

    // Send message
    const handleSend = () => {
        if (!socket) {
            alert('Socket not connected');
            return;
        }
        if (!socket.connected) {
            alert('Socket is not connected to server');
            return;
        }
        if (!input.trim()) return;
        console.log('Emitting sendMessage', { chat_room_id: room.id, message: input });
        socket.emit('sendMessage', {
            chat_room_id: room.id,
            message: input,
        });
        setInput('');
    };

    useEffect(() => {
        if (!socket) return;
        const handleError = (err) => {
            alert('Socket error: ' + (err?.message || JSON.stringify(err)));
        };
        socket.on('error', handleError);
        return () => socket.off('error', handleError);
    }, [socket]);

    return (
        <Paper sx={{ width: 350, height: 500, display: 'flex', flexDirection: 'column', p: 2, position: 'relative' }}>
            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Room: {room.id.slice(0, 8)}...</Typography>
                <Button size="small" onClick={onClose}>Close</Button>
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto', mb: 1, bgcolor: '#fafafa', borderRadius: 1, p: 1 }}>
                {messages.map((msg, idx) => (
                    <Box key={msg.id || idx} sx={{ mb: 1 }}>
                        <Typography variant="body2"><b>{msg.sender_id}</b>: {msg.message}</Typography>
                        <Typography variant="caption" color="text.secondary">{new Date(msg.sent_at).toLocaleTimeString()}</Typography>
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    size="small"
                    fullWidth
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                />
                <Button variant="contained" onClick={handleSend} disabled={!input.trim()}>Send</Button>
            </Box>
        </Paper>
    );
};

export default ChatWindow;