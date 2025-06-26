import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, CircularProgress, Button } from '@mui/material';
import achievementsService from '../../services/achievementsService';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from '../../components/profilePage/ProfileSidebar';

const AchievementsPage = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const data = await achievementsService.getAllAchievements();
                setAchievements(data.data || []);
            } catch (err) {
                setError('Failed to load achievements');
            } finally {
                setLoading(false);
            }
        };
        fetchAchievements();
    }, []);

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
                    ) : achievements.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>No achievements yet.</Box>
                    ) : (
                        achievements.map((ach, idx) => (
                            <Box key={ach.id || idx} sx={{ p: 3, borderBottom: idx !== achievements.length - 1 ? '1px solid' : 'none', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Avatar src={ach.image_url} alt={ach.name} sx={{ width: 80, height: 80, borderRadius: 2, mr: 2 }} />
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>{ach.name}</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{ach.point} pts</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{ach.description}</Typography>
                                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>Created: {new Date(ach.created_at).toLocaleDateString()}</Typography>
                                </Box>
                            </Box>
                        ))
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default AchievementsPage;
