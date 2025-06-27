import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, CircularProgress, Button } from '@mui/material';
import achievementsService from '../../services/achievementsService';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from '../../components/profilePage/ProfileSidebar';
import { jwtDecode } from 'jwt-decode';

const AchievementsPage = () => {
    const [allAchievements, setAllAchievements] = useState([]);
    const [userAchievements, setUserAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAchievements = async () => {
            const accessToken = localStorage.getItem('accessToken');
            let userId = null;
            if (accessToken) {
                const decoded = jwtDecode(accessToken);
                userId = decoded.sub || decoded.id || decoded.user_id;
            }
            if (!userId) {
                setError('User ID not found');
                setLoading(false);
                return;
            }
            try {
                const [allData, userData] = await Promise.all([
                    achievementsService.getAllAchievements(),
                    achievementsService.getUserAchievementsById(userId)
                ]);
                setAllAchievements(allData.data || []);
                setUserAchievements(userData.data || []);
            } catch (err) {
                setError('Failed to load achievements');
            } finally {
                setLoading(false);
            }
        };
        fetchAchievements();
    }, []);

    // Create a Set of user achievement IDs for fast lookup
    // Support both id and achievement_id fields for robustness
    const userAchievementIds = new Set([
        ...userAchievements.map(a => a.id),
        ...userAchievements.map(a => a.achievement_id)
    ].filter(Boolean));

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.paper' }}>
            <ProfileSidebar userData={null} />
            <Box sx={{ flex: 1, maxWidth: 700, mx: 'auto', mt: 6, mb: 6 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: 'text.primary', textAlign: 'start' }}>
                    All Achievements
                </Typography>
                <Paper
                    elevation={0}
                    sx={{ p: 0, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}
                >
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>{error}</Box>
                    ) : allAchievements.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>No achievements yet.</Box>
                    ) : (
                        allAchievements.map((ach, idx) => {
                            const hasAchievement = userAchievementIds.has(ach.id);
                            // Use ach.thumbnail as fallback for image
                            const imageUrl = ach.image_url || ach.thumbnail;
                            return (
                                <Box
                                    key={ach.id || idx}
                                    sx={{
                                        p: 3,
                                        borderBottom: idx !== allAchievements.length - 1 ? '1px solid' : 'none',
                                        borderColor: 'divider',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 3,
                                        opacity: hasAchievement ? 1 : 0.5,
                                        filter: hasAchievement ? 'none' : 'grayscale(100%)',
                                    }}
                                >
                                    <Avatar src={imageUrl} alt={ach.name} sx={{ width: 50, height: 50, borderRadius: 2, mr: 2 }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>{ach.name}</Typography>
                                            {ach.point && <Typography variant="body2" sx={{ color: 'text.secondary' }}>{ach.point} pts</Typography>}
                                        </Box>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{ach.description}</Typography>
                                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>{hasAchievement ? 'Obtained' : 'Not obtained yet'}</Typography>
                                    </Box>
                                </Box>
                            );
                        })
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default AchievementsPage;
