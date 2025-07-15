import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, CircularProgress, LinearProgress, Chip } from '@mui/material';
import achievementsService from '../../services/achievementsService';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from '../../components/profilePage/ProfileSidebar';
import { jwtDecode } from 'jwt-decode';

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
                        progressList.map((ach, idx) => {
                            const isMet = ach.isMet;
                            const progress = Math.min((Number(ach.progressValue) / Number(ach.threshold_value)) * 100, 100);
                            return (
                                <Box
                                    key={ach.id || idx}
                                    sx={{
                                        p: 3,
                                        borderBottom: idx !== progressList.length - 1 ? '1px solid' : 'none',
                                        borderColor: 'divider',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 3,
                                    }}
                                >
                                    <Avatar src={ach.image_url || ach.thumbnail} alt={ach.name} sx={{ width: 50, height: 50, borderRadius: 2, mr: 2, opacity: isMet ? 1 : 0.5, filter: isMet ? 'none' : 'grayscale(100%)' }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', opacity: isMet ? 1 : 0.5, filter: isMet ? 'none' : 'grayscale(100%)' }}>{ach.name}</Typography>
                                            {Number(ach.progressValue) >= Number(ach.threshold_value) && (
                                                <Chip label="completed" size="small" sx={{ fontWeight: 600, ml: 1, justifySelf: 'flex-end', bgcolor: '#63bd6f', color: 'white' }} />
                                            )}
                                        </Box>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, opacity: isMet ? 1 : 0.5, filter: isMet ? 'none' : 'grayscale(100%)' }}>{ach.description}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={progress}
                                                sx={{
                                                    flex: 1,
                                                    height: 10,
                                                    borderRadius: 5,
                                                    bgcolor: isMet ? '#ffa426' : '#ffd8b9',
                                                    '& .MuiLinearProgress-bar': { bgcolor: isMet ? '#ffa426' : '#ffd8b9' }
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ minWidth: 80, textAlign: 'right', color: isMet ? '#ffa426' : 'text.secondary' }}>
                                                {`${Math.floor(Number(ach.progressValue))}/${ach.threshold_value}`}
                                            </Typography>
                                        </Box>
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
