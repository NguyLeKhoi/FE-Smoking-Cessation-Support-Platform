import React, { useEffect, useState } from 'react';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Button } from '@mui/material';
import { useSocket } from '../../context/SocketContext';
import { getChatRoomMessages } from '../../services/chatService';

const ChatRoom = ({ room, onOpenChat }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastMessage, setLastMessage] = useState(null);
    const socket = useSocket();

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const data = await getChatRoomMessages(room.id);
                const messagesArray = Array.isArray(data.data?.data) ? data.data.data : [];
                setMessages(messagesArray);
                if (messagesArray.length > 0) {
                    setLastMessage(messagesArray[messagesArray.length - 1]);
                }
            } catch (e) {
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [room.id]);

    // Listen for new messages to update last message preview
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md border p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Chat Room</h3>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${room.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                >
                    {room.status}
                </span>
            </div>
            <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-600">
                    <span className="font-medium">Room ID:</span> {room.id.slice(0, 8)}...
                </div>
                <div className="text-sm text-gray-600">
                    <span className="font-medium">Started:</span> {formatDate(room.started_at)}
                </div>
                {room.ended_at && (
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Ended:</span> {formatDate(room.ended_at)}
                    </div>
                )}
                {lastMessage && (
                    <div className="text-sm text-gray-600 truncate">
                        <span className="font-medium">Last message:</span>{' '}
                        {lastMessage.message.length > 30
                            ? `${lastMessage.message.slice(0, 30)}...`
                            : lastMessage.message}{' '}
                        <span className="text-xs text-gray-400">
                            ({formatTime(lastMessage.sent_at)})
                        </span>
                    </div>
                )}
            </div>
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
        </div>
    );
};

export default ChatRoom;