import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ProfileSidebar from './ProfileSidebar';
import { fetchCurrentUser } from '../../services/userService'; 
import LoadingPage from '../../pages/LoadingPage';

const ProfileLayout = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                setLoading(true);
                const response = await fetchCurrentUser();
                setUserData(response.data);
            } catch (err) {
                setError('Failed to load user profile. Please try again later.');
                console.error('Error loading profile:', err);
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, []);

    if (loading) {
        return <LoadingPage />;
    }

    if (error) {
        return <div className="profile-error">{error}</div>;
    }

    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            bgcolor: 'background.default',
            overflow: 'visible'
        }}>
            {/* Pass userData to the ProfileSidebar */}
            <ProfileSidebar userData={userData} />

            {/* Main content */}
            <Box sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                color: 'text.primary',
                overflowY: 'auto'
            }}>
                {children}
            </Box>
        </Box>
    );
};

export default ProfileLayout;