import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === null) {
        return { socket: null, refreshSocket: () => {} };
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('accessToken'));

    const refreshSocket = useCallback(() => {
        const currentToken = localStorage.getItem('accessToken');
        setToken(currentToken);
    }, []);

    useEffect(() => {
        // Listen for storage changes to detect token updates
        const handleStorageChange = (e) => {
            if (e.key === 'accessToken') {
                setToken(e.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also check for token changes periodically (for same-tab changes)
        const tokenCheckInterval = setInterval(() => {
            const currentToken = localStorage.getItem('accessToken');
            if (currentToken !== token) {
                setToken(currentToken);
            }
        }, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(tokenCheckInterval);
        };
    }, [token]);

    useEffect(() => {
        // Disconnect existing socket if it exists
        if (socket) {
            socket.disconnect();
            window.socketInstance = null;
        }

        // Only create new socket if token exists
        if (token) {
            const socketInstance = io('http://localhost:8000/chat', {
                transports: ['websocket'],
                auth: {
                    token: token
                }
            });

            setSocket(socketInstance);
            
            // Store socket instance globally for logout access
            window.socketInstance = socketInstance;

            socketInstance.on('connect_error', (err) => {
                console.error('Socket connection error:', err.message);
            });

            return () => {
                socketInstance.disconnect();
                // Clean up global reference
                window.socketInstance = null;
            };
        } else {
            // No token, clear socket
            setSocket(null);
            window.socketInstance = null;
        }
    }, [token]);

    return (
        <SocketContext.Provider value={{ socket, refreshSocket }}>
            {children}
        </SocketContext.Provider>
    );
};
