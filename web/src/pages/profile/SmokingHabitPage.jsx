import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Chip, Stack, Paper } from '@mui/material';
import LoadingPage from '../LoadingPage';
import smokingService from '../../services/smokingService';
import ProfileSidebar from '../../components/profilePage/ProfileSidebar';
import { fetchCurrentUser } from '../../services/userService';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const SmokingHabitPage = () => {
    const [habit, setHabit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [habitRes, userRes] = await Promise.all([
                    smokingService.getMySmokingHabits(),
                    fetchCurrentUser()
                ]);
                setHabit(habitRes.data || habitRes);
                setUserData(userRes.data || userRes);
            } catch (e) {
                const backendMsg = e?.response?.data?.message;
                setError(backendMsg || 'Failed to load your smoking habit data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statBox = (label, value, icon, color = 'primary.main') => (
        <Paper elevation={1} sx={{
            p: 2, minWidth: 140, textAlign: 'center', bgcolor: 'section.light', borderRadius: 3, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1
        }}>
            {icon}
            <Typography variant="h6" fontWeight={700} color={color}>{value}</Typography>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
        </Paper>
    );

    const content = (
        <Paper elevation={0} sx={{
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'visible',
            width: '100%',
            maxWidth: 900,
            mx: 'auto',
            mt: 4,
        }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                My Smoking Habit
            </Typography>

            {/* Key Stats Row */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 5, flexWrap: 'wrap' }}>
                {statBox('Cigarettes/Day', habit?.cigarettes_per_day, <LocalFireDepartmentIcon color="error" />)}
                {statBox('Years Smoking', habit?.smoking_years, <CalendarMonthIcon color="primary" />)}
                {statBox('Daily Cost', habit?.daily_cost ? `$${habit.daily_cost}` : '-', <AttachMoneyIcon color="success" />)}
            </Stack>

            {/* Profile Details */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>Your Smoking Profile</Typography>
                <List sx={{ maxWidth: 700 }}>
                    <ListItem>
                        <ListItemText primary="Cigarettes per pack" secondary={habit?.cigarettes_per_pack} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Price per pack" secondary={`$${habit?.price_per_pack}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Health issues" secondary={habit?.health_issues} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Last updated" secondary={habit?.created_at ? new Date(habit.created_at).toLocaleString() : ''} />
                    </ListItem>
                </List>
            </Box>

            {/* Triggers as Chips */}
            <Box sx={{ mb: 5 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>Triggers</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {(Array.isArray(habit?.triggers) ? habit.triggers : (habit?.triggers ? [habit.triggers] : [])).map((trigger, idx) => (
                        <Chip key={idx} label={trigger} color="secondary" variant="outlined" />
                    ))}
                </Box>
            </Box>

            {/* AI Feedback */}
            <Box sx={{ mt: 3, maxWidth: 700 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmojiObjectsIcon sx={{ color: 'warning.main', verticalAlign: 'middle' }} />
                    AI Feedback
                </Typography>
                <Box sx={{
                    bgcolor: '#ffd8ba',
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: '#ffd8ba',
                    mt: 1,
                    boxShadow: 1,
                }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{habit?.ai_feedback}</Typography>
                </Box>
            </Box>
        </Paper>
    );

    if (loading) {
        return <LoadingPage />;
    }

    if (error) {
        if (error === 'Smoking habit for user not found') {
            return (
                <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
                    <ProfileSidebar userData={userData} />
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper' }}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', maxWidth: 500, mx: 'auto', textAlign: 'center' }}>
                            <Typography variant="h5" fontWeight={700} gutterBottom>
                                Take a quiz now
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                Complete our quick assessment to get personalized feedback and insights about your smoking habits.
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <button
                                    onClick={() => window.location.href = '/smoking-quiz'}
                                    style={{
                                        padding: '12px 32px',
                                        borderRadius: '12px',
                                        background: '#3f332b',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '1.1rem',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 0 #3f332b40',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    Take Smoking Habit Quiz
                                </button>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            );
        } else {
            return (
                <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
                    <ProfileSidebar userData={userData} />
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper' }}>
                        <Typography color="error">{error}</Typography>
                    </Box>
                </Box>
            );
        }
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <ProfileSidebar userData={userData} />
            <Box sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                color: 'text.primary',
                overflowY: 'auto'
            }}>
                {content}
            </Box>
        </Box>
    );
};

export default SmokingHabitPage;
