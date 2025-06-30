import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const token = localStorage.getItem('accessToken'); 

    useEffect(() => {
        const socketInstance = io('http://localhost:8000/chat', {
            transports: ['websocket'],

            auth: {
                token: token
            }
        });

        setSocket(socketInstance);

        // ✅ Lắng nghe sự kiện kết nối để debug
        socketInstance.on('connect', () => {
            console.log('✅ Socket connected:', socketInstance.id);
        });

        socketInstance.on('connect_error', (err) => {
            console.error('❌ Socket connection error:', err.message);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, [token]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
