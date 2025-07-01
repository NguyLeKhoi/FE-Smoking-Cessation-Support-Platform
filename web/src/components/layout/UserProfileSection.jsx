import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    IconButton,
    Badge,
    Avatar,
    CircularProgress,
    Box,
    TextField,
    InputAdornment
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsDropdown from './NotificationsDropdown';
import { fetchCurrentUser } from '../../services/userService';

const UserProfileSection = ({ authStatus, loadingMotivation, notifications, setNotifications }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const currentPath = location.pathname;

    useEffect(() => {
        if (authStatus) {
            const fetchUserData = async () => {
                try {
                    setLoading(true);
                    // Clear any existing cached data first
                    sessionStorage.removeItem('userData');

                    const response = await fetchCurrentUser();
                    if (response && response.data) {
                        setUserData(response.data);
                        sessionStorage.setItem('userData', JSON.stringify(response.data));
                    } else {
                        console.error('Invalid response format from fetchCurrentUser');
                        setUserData(null);
                    }
                } catch (error) {
                    console.error('Error fetching user data for header:', error);
                    setUserData(null);
                    // Clear cached data on error
                    sessionStorage.removeItem('userData');
                } finally {
                    setLoading(false);
                }
            };
            fetchUserData();
        } else {
            // Clear user data when not authenticated
            setUserData(null);
            setLoading(false);
            sessionStorage.removeItem('userData');
        }
    }, [authStatus]);

    const handleNotificationClick = () => {
        setIsDropdownOpen((prev) => !prev);
        if (!isDropdownOpen) {
            markAllNotificationsAsRead();
        }
    };

    const markAllNotificationsAsRead = () => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((n) => ({ ...n, read: true }))
        );
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            console.log('Searching for:', searchQuery);
        }
    };

    const renderPathSpecificElement = () => {
        if (currentPath === '/blog') {
            return (
                <Box sx={{ position: 'relative', display: { xs: 'none', md: 'flex' } }}>
                    <TextField
                        placeholder="Search a post..."
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleSearch}
                        sx={{
                            width: '280px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '15px',
                                bgcolor: 'rgba(63, 51, 43, 0.04)',
                            },
                            '& .MuiOutlinedInput-input': {
                                padding: '8px 14px 8px 0',
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#3f332b', fontSize: '1.2rem' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            );
        } else if (currentPath === '/' && !loading && userData && userData.username) {
            return (
                <Typography
                    variant="subtitle1"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        color: '#3f332b',
                        fontWeight: 500,
                        mr: 1,
                    }}
                >
                    Welcome back, {userData.username}!
                </Typography>
            );
        }
        return <></>;
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {loadingMotivation && <CircularProgress size={20} sx={{ color: '#3f332b', mr: 1 }} />}

            {/* Path specific element (search or welcome) */}
            {renderPathSpecificElement()}

            {/* Admin Link */}
            {!loading && userData && userData.role === 'admin' && (
                <Button
                    component={RouterLink}
                    to="/admin"
                    variant="outlined"
                    sx={{
                        mr: 1,
                        color: '#3f332b',
                        borderColor: '#3f332b',
                        '&:hover': {
                            borderColor: '#000000',
                            backgroundColor: 'rgba(63, 51, 43, 0.04)',
                        },
                    }}
                >
                    Admin Panel
                </Button>
            )}

            <IconButton
                color="inherit"
                onClick={handleNotificationClick}
                sx={{ color: '#3f332b', fontSize: '2rem' }}
            >
                <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            {isDropdownOpen && (
                <NotificationsDropdown
                    notifications={notifications}
                    onClose={() => setIsDropdownOpen(false)}
                    onMarkAllAsRead={markAllNotificationsAsRead}
                />
            )}

            {/* User Avatar */}
            <IconButton
                component={RouterLink}
                to="/profile"
                sx={{
                    color: '#3f332b',
                    padding: 0
                }}
            >
                {!loading && userData ? (
                    userData.avatar ? (
                        <Avatar
                            src={userData.avatar}
                            alt={userData.username || 'User'}
                            sx={{
                                width: 40,
                                height: 40,
                                border: '0.5px solid',
                                borderColor: 'divider',
                                borderRadius: '15%',
                            }}
                        />
                    ) : (
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: '#f0f0f0',
                                border: '0.5px solid',
                                borderColor: 'divider',
                                color: 'text.primary',
                                fontWeight: 'bold',
                                borderRadius: '15%',
                            }}
                        >
                            {userData.username ? userData.username.charAt(0).toUpperCase() : 'U'}
                        </Avatar>
                    )
                ) : (
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: '#f0f0f0',
                            border: '0.5px solid',
                            borderColor: 'divider',
                            color: 'text.primary',
                            borderRadius: '15%',
                        }}
                    >
                        U
                    </Avatar>
                )}
            </IconButton>
        </Box>
    );
};

export default UserProfileSection;