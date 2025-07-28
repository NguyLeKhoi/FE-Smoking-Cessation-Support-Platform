import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../../services/userService";
import ProfileSidebar from "../../components/profilePage/ProfileSidebar";
import UserInfoSection from "../../components/profilePage/UserInfoSection";
import StatisticsSection from "../../components/profilePage/StatisticsSection";
import AchievementSection from "../../components/profilePage/AchievementSection";
import LoadingPage from "../LoadingPage";

export default function VisitUserProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingUserInfo, setLoadingUserInfo] = useState(true);
    const [loadingAchievements, setLoadingAchievements] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, []);

    useEffect(() => {
        const loadUserProfile = async () => {
            if (!userId) {
                setError("User ID is required");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await getUserById(userId);
                setUser(response.data);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError("Failed to load user profile. User may not exist or you may not have permission to view this profile.");
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, [userId]);

    if (loading) {
        return <LoadingPage />;
    }

    if (error) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: 'background.default',
                p: 4
            }}>
                <Typography variant="h4" sx={{ mb: 2, color: 'error.main' }}>
                    Error Loading Profile
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
                    {error}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography
                        variant="body2"
                        onClick={() => navigate(-1)}
                        sx={{
                            color: 'primary.main',
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' }
                        }}
                    >
                        Go Back
                    </Typography>
                    <Typography
                        variant="body2"
                        onClick={() => navigate('/')}
                        sx={{
                            color: 'primary.main',
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' }
                        }}
                    >
                        Go Home
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (!user) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: 'background.default',
                p: 4
            }}>
                <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>
                    User Not Found
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
                    The user you're looking for doesn't exist or has been removed.
                </Typography>
                <Typography
                    variant="body2"
                    onClick={() => navigate(-1)}
                    sx={{
                        color: 'primary.main',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    Go Back
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {(loading || loadingUserInfo || loadingAchievements) && <LoadingPage />}
            <Box sx={{
                display: 'flex',
                minHeight: '100vh',
                bgcolor: 'background.default',
                overflow: 'visible',
                // Hide content if loading
                opacity: (loading || loadingUserInfo || loadingAchievements) ? 0 : 1,
                pointerEvents: (loading || loadingUserInfo || loadingAchievements) ? 'none' : 'auto',
            }}>
                <ProfileSidebar userData={user} />
                {/* Main content */}
                <Box sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    p: 4,
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                }}>
                    {/* User Info Section - Read Only */}
                    <UserInfoSection
                        userData={user}
                        isReadOnly={true}
                        onLoaded={() => {
                            console.log('[VisitUserProfile] setLoadingUserInfo(false)');
                            setLoadingUserInfo(false);
                        }}
                    />

                    {/* Statistics Section */}
                    <StatisticsSection user={user} />

                    {/* Achievements Section */}
                    <Box sx={{ mt: 5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        </Box>
                        <AchievementSection
                            userData={user}
                            onLoaded={() => {
                                console.log('[VisitUserProfile] setLoadingAchievements(false)');
                                setLoadingAchievements(false);
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </>
    );
}
