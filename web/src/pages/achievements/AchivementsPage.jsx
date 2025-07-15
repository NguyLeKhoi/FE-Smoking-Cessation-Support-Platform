import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, CircularProgress, LinearProgress, Chip } from '@mui/material';
import achievementsService from '../../services/achievementsService';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from '../../components/profilePage/ProfileSidebar';
import { jwtDecode } from 'jwt-decode';
import AchievementStyle from '../../components/profilePage/AchievementStyle';

const AchievementsPage = () => {
    const [progressList, setProgressList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAchievementsProgress = async () => {
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
                const progressData = await achievementsService.getUserAchievementsProgressById(userId);
                setProgressList(Array.isArray(progressData.data) ? progressData.data : []);
            } catch (err) {
                setError('Failed to load achievement progress');
            } finally {
                setLoading(false);
            }
        };
        fetchAchievementsProgress();
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
                    ) : progressList.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>No achievements yet.</Box>
                    ) : (
                        progressList.map((ach, idx, arr) => {
                            const isMet = ach.isMet;
                            const progress = Math.min((Number(ach.progressValue) / Number(ach.threshold_value)) * 100, 100);
                            // console.log('Progress:', ach.name, progress, ach.progressValue, ach.threshold_value);
                            return (
                                <AchievementStyle
                                    key={ach.id || idx}
                                    ach={ach}
                                    isMet={isMet}
                                    progress={progress}
                                    idx={idx}
                                    arr={arr}
                                />
                            );
                        })
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default AchievementsPage;
