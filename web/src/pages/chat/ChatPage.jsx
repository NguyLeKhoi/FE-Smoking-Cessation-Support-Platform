import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { getAllChatRooms, getAllCoachChatRooms, getChatRoomMessages } from '../../services/chatService';
import ChatWindow from '../../components/chat/ChatWindow';
import { useSocket } from '../../context/SocketContext';
import { jwtDecode } from 'jwt-decode';
import ChatSidebar from '../../components/chat/ChatSidebar';

const ChatPage = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [role, setRole] = useState(null);
    const { socket } = useSocket();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                setRole(decoded.role);
            } catch (e) {
                setRole(null);
            }
        } else {
            setRole(null);
        }
    }, []);

    useEffect(() => {
        const fetchChatRooms = async () => {
            setLoading(true);
            try {
                let response;
                if (role === 'coach') {
                    response = await getAllCoachChatRooms();
                } else {
                    response = await getAllChatRooms();
                }
                let chatRoomsArray = [];
                if (response?.data?.data && Array.isArray(response.data.data)) {
                    chatRoomsArray = response.data.data;
                } else if (response?.data && Array.isArray(response.data)) {
                    chatRoomsArray = response.data;
                } else if (Array.isArray(response)) {
                    chatRoomsArray = response;
                }
                // Fetch last message for each room if not present
                const roomsWithLastMessage = await Promise.all(
                    chatRoomsArray.map(async (room) => {
                        if (room.lastMessage || room.last_message) return room;
                        try {
                            const msgRes = await getChatRoomMessages(room.id);
                            let arr = Array.isArray(msgRes.data?.data) ? msgRes.data.data : Array.isArray(msgRes.data) ? msgRes.data : [];
                            // Sort messages by sent_at ascending before picking the last one
                            arr = arr.sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
                            const lastMsg = arr.length > 0 ? arr[arr.length - 1] : null;
                            return { ...room, lastMessage: lastMsg };
                        } catch {
                            return { ...room, lastMessage: null };
                        }
                    })
                );
                setChatRooms(roomsWithLastMessage);
                if (roomsWithLastMessage.length > 0) {
                    setSelectedRoom(roomsWithLastMessage[0]);
                }
            } catch (e) {
                setChatRooms([]);
            } finally {
                setLoading(false);
            }
        };
        if (role) fetchChatRooms();
    }, [role]);

    // Listen for new messages to update last message preview
    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = (msg) => {
            setChatRooms((prevRooms) => {
                // Move the room with new message to the top
                const idx = prevRooms.findIndex(r => r.id === msg.chat_room_id);
                if (idx === -1) return prevRooms;
                const updatedRoom = { ...prevRooms[idx], lastMessage: msg };
                const newRooms = [updatedRoom, ...prevRooms.filter((_, i) => i !== idx)];
                return newRooms;
            });
        };
        socket.on('newMessage', handleNewMessage);
        return () => socket.off('newMessage', handleNewMessage);
    }, [socket]);

    // Disable body scroll for this page
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    const getRoomDisplayInfo = (room) => {
        // For user: show coach info; for coach: show user info
        if (role === 'coach') {
            return room.user || {};
        } else {
            return room.coach?.user || {};
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default', overflow: 'hidden' }}>
            <ChatSidebar
                chatRooms={chatRooms}
                loading={loading}
                selectedRoom={selectedRoom}
                onSelectRoom={setSelectedRoom}
                getRoomDisplayInfo={getRoomDisplayInfo}
            />
            {/* Right: Chat Window */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center', bgcolor: 'background.default', overflow: 'hidden', height: '100%' }}>
                {selectedRoom ? (
                    <Box sx={{ width: '100%', height: '100%' }}>
                        <ChatWindow room={selectedRoom} onClose={() => setSelectedRoom(null)} />
                    </Box>
                ) : (
                    <Box sx={{ m: 'auto', textAlign: 'center', color: 'text.secondary' }}>
                        <Typography variant="h5">Select a chat to start messaging</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ChatPage;
